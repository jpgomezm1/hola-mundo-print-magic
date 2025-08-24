import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

// Initialize Supabase client with service role for database operations
const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

interface AnalyzeRequest {
  url?: string;
  storage_path?: string;
  video_id?: string;
  user_id?: string;
}

interface VideoMetadata {
  title?: string;
  description?: string;
  duration?: number;
  thumbnail_url?: string;
  creator_username?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
}

interface AnalysisResult {
  guion_oral: string;
  hook: string;
  cta: string;
  estilo_edicion: string;
  tema_principal: string;
  justificacion_tema: string;
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

async function fetchVideoFromUrl(url: string, requestId: string): Promise<Uint8Array> {
  console.log(`[${requestId}] fetchVideoFromUrl - Attempt 1/3`);
  
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[${requestId}] fetchVideoFromUrl - Attempt ${attempt}/3`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      console.log(`[${requestId}] Video downloaded`, { size: buffer.byteLength });
      
      return new Uint8Array(buffer);
      
    } catch (error) {
      lastError = error;
      console.error(`[${requestId}] Attempt ${attempt} failed:`, error);
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  throw lastError;
}

async function uploadToGemini(videoData: Uint8Array, requestId: string): Promise<string> {
  console.log(`[${requestId}] uploadToGemini - Attempt 1/3`);
  
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[${requestId}] uploadToGemini - Attempt ${attempt}/3`);
      console.log(`[${requestId}] Uploading to Gemini Files API`, { size: videoData.length });
      
      const formData = new FormData();
      formData.append('file', new Blob([videoData], { type: 'video/mp4' }), 'video.mp4');
      
      const uploadResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Goog-Upload-Protocol': 'multipart'
        }
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      console.log(`[${requestId}] File uploaded to Gemini, waiting for processing`, { fileName: uploadResult.file?.name });
      
      // Wait for processing
      const fileName = uploadResult.file?.name;
      if (!fileName) {
        throw new Error('No filename returned from upload');
      }
      
      let processingComplete = false;
      let attempts = 0;
      const maxAttempts = 20; // Wait up to 1 minute
      
      while (!processingComplete && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        attempts++;
        
        const statusResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${GEMINI_API_KEY}`);
        
        if (!statusResponse.ok) {
          throw new Error(`Status check failed with ${statusResponse.status}`);
        }
        
        const statusResult = await statusResponse.json();
        console.log(`[${requestId}] Processing status check ${attempts}/${maxAttempts}:`, statusResult.state);
        
        if (statusResult.state === 'ACTIVE') {
          processingComplete = true;
          return fileName;
        } else if (statusResult.state === 'FAILED') {
          throw new Error('File processing failed in Gemini');
        }
      }
      
      if (!processingComplete) {
        throw new Error('Timeout waiting for file processing');
      }
      
      return fileName;
      
    } catch (error) {
      lastError = error;
      console.error(`[${requestId}] Upload attempt ${attempt} failed:`, error);
      
      if (attempt < 3) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
      }
    }
  }
  
  throw lastError;
}

async function analyzeWithGemini(geminiFileName: string, requestId: string): Promise<AnalysisResult> {
  console.log(`[${requestId}] Starting Gemini analysis`);
  
  const prompt = `
Analiza este video de TikTok y proporciona la siguiente información en formato JSON:

{
    "guion_oral": "Transcripción completa de todo lo que se dice en el video",
    "hook": "Descripción del gancho inicial usado para captar atención (primeros 3 segundos)",
    "cta": "Call to Action utilizado (si existe), qué acción se pide al viewer - SOLO TEXTO",
    "estilo_edicion": "Descripción del estilo de edición: cortes, transiciones, efectos, música, ritmo, etc.",
    "tema_principal": "Una de estas opciones: Entretener, Identificar, Activar, Educar",
    "justificacion_tema": "Breve explicación de por qué clasificaste el video en esa categoría"
}

IMPORTANTE: 
- Todos los campos deben ser TEXTO PLANO, no objetos JSON anidados
- El campo "cta" debe ser una descripción en texto, no un objeto con propiedades
- Si hay un CTA complejo, descríbelo en palabras simples

Definiciones de los temas:
- Entretener: Provocar risa, incomodidad o sorpresa, contenido diseñado para enganchar y quedarse en la cabeza
- Identificar: Que la gente diga "yo soy ese" o "eso me pasa a mí", reforzando la conexión emocional
- Activar: Motivar a compartir o comentar, unirse a la comunidad o dar un paso más en el funnel, con CTAs claros
- Educar: Explicar herramientas, conceptos o procesos

Responde únicamente con el JSON válido, sin texto adicional.
`;

  try {
    const analysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              file_data: {
                mime_type: "video/mp4",
                file_uri: `https://generativelanguage.googleapis.com/v1beta/${geminiFileName}`
              }
            }
          ]
        }]
      })
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      throw new Error(`Analysis failed: ${analysisResponse.status} - ${errorText}`);
    }

    const analysisResult = await analysisResponse.json();
    console.log(`[${requestId}] Gemini analysis response received`);
    
    if (!analysisResult.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('No analysis text returned from Gemini');
    }
    
    let responseText = analysisResult.candidates[0].content.parts[0].text.trim();
    
    // Clean up response
    if (responseText.startsWith('```json')) {
      responseText = responseText.slice(7, -3);
    } else if (responseText.startsWith('```')) {
      responseText = responseText.slice(3, -3);
    }
    
    const analysis = JSON.parse(responseText);
    console.log(`[${requestId}] Analysis completed successfully`);
    
    return {
      guion_oral: String(analysis.guion_oral || ''),
      hook: String(analysis.hook || ''),
      cta: String(analysis.cta || ''),
      estilo_edicion: String(analysis.estilo_edicion || ''),
      tema_principal: String(analysis.tema_principal || 'Entretener'),
      justificacion_tema: String(analysis.justificacion_tema || '')
    };

  } catch (error) {
    console.error(`[${requestId}] Error in Gemini analysis:`, error);
    throw new Error(`Gemini analysis failed: ${error.message}`);
  }
}

async function cleanupGeminiFile(geminiFileName: string, requestId: string): Promise<void> {
  try {
    const deleteResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${geminiFileName}?key=${GEMINI_API_KEY}`, {
      method: 'DELETE'
    });
    
    if (deleteResponse.ok) {
      console.log(`[${requestId}] Gemini file cleaned up successfully`);
    } else {
      console.warn(`[${requestId}] Failed to cleanup Gemini file: ${deleteResponse.status}`);
    }
  } catch (error) {
    console.warn(`[${requestId}] Error cleaning up Gemini file:`, error);
  }
}

function mapTemaToTam(tema: string): string {
  const mapping: Record<string, string> = {
    'Entretener': 'Entretenimiento',
    'Identificar': 'Storytelling',
    'Activar': 'Ventas',
    'Educar': 'Educativo'
  };
  
  return mapping[tema] || 'Entretenimiento';
}

serve(async (req) => {
  const requestId = generateRequestId();
  console.log(`[${requestId}] New request: ${req.method} ${req.url}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body: AnalyzeRequest = await req.json();
    console.log(`[${requestId}] Request body:`, { 
      hasUrl: !!body.url, 
      hasStoragePath: !!body.storage_path,
      videoId: body.video_id 
    });

    // Validate input
    if (!body.url && !body.storage_path) {
      return new Response(
        JSON.stringify({ error: 'Either url or storage_path is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from JWT token
    const authHeader = req.headers.get('authorization');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader?.replace('Bearer ', '') || ''
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] User authenticated:`, user.id);

    let geminiFileName = null;
    let analysis: AnalysisResult;
    
    try {
      // Step 1: Download video from URL
      console.log(`[${requestId}] Downloading video from URL`, { url: body.url });
      const videoData = await fetchVideoFromUrl(body.url!, requestId);
      
      // Step 2: Upload to Gemini
      geminiFileName = await uploadToGemini(videoData, requestId);
      
      // Step 3: Analyze with Gemini
      analysis = await analyzeWithGemini(geminiFileName, requestId);
      
    } catch (analysisError) {
      console.error(`[${requestId}] Analysis pipeline failed:`, analysisError);
      
      // Fallback to basic analysis
      analysis = {
        guion_oral: "Error en análisis - no se pudo procesar el video",
        hook: "Error en análisis",
        cta: "Error en análisis",
        estilo_edicion: "Error en análisis",
        tema_principal: "Entretener",
        justificacion_tema: `Error durante el análisis: ${analysisError.message}`
      };
    } finally {
      // Always cleanup Gemini file
      if (geminiFileName) {
        await cleanupGeminiFile(geminiFileName, requestId);
      }
    }
    
    // Step 4: Extract basic metadata
    const metadata: VideoMetadata = {
      title: `TikTok Video ${Date.now()}`,
      description: "Video analyzed from TikTok",
      duration: 30,
      thumbnail_url: null,
      creator_username: null,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };
    
    // Step 5: Generate tags and TAM
    const tags_ai = ['tiktok', 'video-analizado', analysis.tema_principal.toLowerCase()];
    const tam_ai = mapTemaToTam(analysis.tema_principal);

    // Step 4: Create response payload
    const videoId = body.video_id || `video_${Date.now()}`;
    const response = {
      video_id: videoId,
      thumbnail_url: metadata.thumbnail_url,
      duration_seconds: metadata.duration,
      metrics: {
        views: metadata.views || 0,
        likes: metadata.likes || 0,
        comments: metadata.comments || 0,
        shares: metadata.shares || 0
      },
      guion_oral: analysis.guion_oral,
      hook: analysis.hook,
      cta: analysis.cta,
      estilo_edicion: analysis.estilo_edicion,
      tema_principal: analysis.tema_principal,
      justificacion_tema: analysis.justificacion_tema,
      tags_ai,
      tam_ai,
      created_at: new Date().toISOString()
    };

    // Step 5: Save to database
    try {
      const videoRecord = {
        user_id: user.id,
        tiktok_url: body.url || '',
        storage_path: body.storage_path || null,
        title: metadata.title,
        description: metadata.description,
        duration_seconds: metadata.duration,
        thumbnail_url: metadata.thumbnail_url,
        creator_username: metadata.creator_username,
        guion_oral: analysis.guion_oral,
        hook: analysis.hook,
        cta_type: analysis.cta,
        editing_style: analysis.estilo_edicion,
        video_theme: analysis.tema_principal,
        justificacion_tema: analysis.justificacion_tema,
        tags_ai: tags_ai,
        tam_ai: tam_ai,
        metrics_views: metadata.views || 0,
        metrics_likes: metadata.likes || 0,
        metrics_comments: metadata.comments || 0,
        metrics_shares: metadata.shares || 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log(`[${requestId}] Attempting to save to database`);

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('reference_videos')
        .insert(videoRecord)
        .select()
        .single();

      if (insertError) {
        console.error(`[${requestId}] Database insert failed:`, insertError);
        throw new Error(`Database error: ${insertError.message}`);
      } else {
        console.log(`[${requestId}] Saved to database successfully:`, insertData?.id);
      }
    } catch (dbError) {
      console.error(`[${requestId}] Database error:`, dbError);
      throw dbError;
    }

    console.log(`[${requestId}] Analysis completed successfully`);
    
    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error(`[${requestId}] Error:`, error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});