import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Initialize Supabase client with service role for database operations
const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

interface AnalyzeRequest {
  url?: string;
  storage_path?: string;
  video_id?: string;
  user_id?: string;
}

interface VideoAnalysis {
  guion_oral: string;
  hook: string;
  cta: string;
  estilo_edicion: string;
  tema_principal: 'Entretener' | 'Identificar' | 'Activar' | 'Educar';
  justificacion_tema: string;
}

interface VideoMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

async function fetchVideoFromUrl(url: string): Promise<Uint8Array> {
  console.log('[FETCH] Attempting to download video from URL...');
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'video/*,*/*;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

async function getVideoFromStorage(storagePath: string): Promise<Uint8Array> {
  console.log('[STORAGE] Fetching video from Supabase Storage...');
  
  const { data, error } = await supabaseAdmin.storage
    .from('videos')
    .download(storagePath);

  if (error) {
    throw new Error(`Failed to fetch from storage: ${error.message}`);
  }

  return new Uint8Array(await data.arrayBuffer());
}

async function uploadToGemini(videoData: Uint8Array, requestId: string): Promise<any> {
  console.log(`[${requestId}] Uploading video to Gemini Files API...`);
  
  // Step 1: Start resumable upload
  const startResponse = await fetch('https://generativelanguage.googleapis.com/upload/v1beta/files?key=' + GOOGLE_API_KEY, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': videoData.length.toString(),
      'X-Goog-Upload-Header-Content-Type': 'video/mp4',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: {
        display_name: `tiktok_video_${requestId}`,
      }
    }),
  });

  if (!startResponse.ok) {
    const errorText = await startResponse.text();
    console.error(`[${requestId}] Gemini upload start error:`, errorText);
    throw new Error(`Failed to start upload to Gemini: ${startResponse.statusText}`);
  }

  const uploadUrl = startResponse.headers.get('X-Goog-Upload-URL');
  if (!uploadUrl) {
    throw new Error('No upload URL received from Gemini');
  }

  console.log(`[${requestId}] Upload URL received, uploading file...`);

  // Step 2: Upload the actual file data
  const uploadResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Length': videoData.length.toString(),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: videoData,
  });

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text();
    console.error(`[${requestId}] Gemini file upload error:`, errorText);
    throw new Error(`Failed to upload file to Gemini: ${uploadResponse.statusText}`);
  }

  const uploadResult = await uploadResponse.json();
  console.log(`[${requestId}] File uploaded to Gemini successfully:`, uploadResult.file?.name);

  // Step 3: Wait for processing
  let file = uploadResult.file;
  while (file.state === 'PROCESSING') {
    console.log(`[${requestId}] File is processing, waiting...`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const statusResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${file.name}?key=${GOOGLE_API_KEY}`);
    if (statusResponse.ok) {
      const statusResult = await statusResponse.json();
      file = statusResult;
    } else {
      break;
    }
  }

  if (file.state === 'FAILED') {
    throw new Error(`File processing failed in Gemini`);
  }

  console.log(`[${requestId}] File processed successfully, state: ${file.state}`);
  return file;
}

async function analyzeWithGemini(geminiFile: any, requestId: string): Promise<VideoAnalysis> {
  console.log(`[${requestId}] Analyzing video content with Gemini 1.5 Pro...`);

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
    const analysisResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  fileData: {
                    mimeType: geminiFile.mimeType,
                    fileUri: geminiFile.uri
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error(`[${requestId}] Gemini API error response:`, errorText);
      throw new Error(`Gemini analysis failed: ${analysisResponse.status} ${analysisResponse.statusText} - ${errorText}`);
    }

    const result = await analysisResponse.json();
    console.log(`[${requestId}] Gemini API response:`, JSON.stringify(result, null, 2));
    
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error(`[${requestId}] Invalid Gemini response structure:`, result);
      throw new Error('No analysis text returned from Gemini');
    }

    let analysisText = result.candidates[0].content.parts[0].text.trim();
    console.log(`[${requestId}] Raw analysis text:`, analysisText);
    
    // Clean JSON fences if present
    if (analysisText.startsWith('```json')) {
      analysisText = analysisText.slice(7, -3);
    } else if (analysisText.startsWith('```')) {
      analysisText = analysisText.slice(3, -3);
    }

    try {
      const analysis = JSON.parse(analysisText);
      console.log(`[${requestId}] Analysis completed - Topic: ${analysis.tema_principal}`);
      return analysis;
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse analysis JSON:`, parseError);
      console.error(`[${requestId}] Analysis text that failed to parse:`, analysisText);
      throw new Error(`Failed to parse analysis response: ${parseError.message}`);
    }
  } catch (error) {
    console.error(`[${requestId}] Error in analyzeWithGemini:`, error);
    throw error;
  }
}

async function generateTags(analysis: VideoAnalysis, requestId: string): Promise<string[]> {
  console.log(`[${requestId}] Generating AI tags...`);

  const tagPrompt = `
Basándote en este análisis de video de TikTok, genera entre 5-10 tags relevantes que describan el contenido:

Guión: ${analysis.guion_oral}
Hook: ${analysis.hook}
Estilo: ${analysis.estilo_edicion}
Tema: ${analysis.tema_principal}
CTA: ${analysis.cta}

Devuelve solo los tags separados por comas, sin numeración ni texto adicional.
Ejemplo: marketing digital, storytelling, engagement, viral content, emprendimiento
  `;

  const tagResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: tagPrompt }] }]
      })
    }
  );

  if (!tagResponse.ok) {
    console.warn(`[${requestId}] Failed to generate tags, using defaults`);
    return ['video-analizado', 'tiktok', 'contenido'];
  }

  const tagResult = await tagResponse.json();
  const tagText = tagResult.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
  
  const tags = tagText
    .split(',')
    .map((tag: string) => tag.trim().toLowerCase())
    .filter((tag: string) => tag.length > 0)
    .slice(0, 10);

  return tags.length > 0 ? tags : ['video-analizado', 'tiktok', 'contenido'];
}

function mapTemaToTam(tema: string, analysis: VideoAnalysis): string {
  // Basic mapping
  const basicMapping: Record<string, string> = {
    'Entretener': 'Entretenimiento',
    'Identificar': 'Storytelling',
    'Activar': 'Ventas',
    'Educar': 'Educativo'
  };

  let tam = basicMapping[tema] || 'Entretenimiento';

  // Heuristic refinement
  const guionLower = analysis.guion_oral.toLowerCase();
  const hookLower = analysis.hook.toLowerCase();
  const ctaLower = analysis.cta.toLowerCase();

  // Check for tutorial keywords
  if (guionLower.includes('paso') || guionLower.includes('cómo') || 
      guionLower.includes('tutorial') || guionLower.includes('enseñar') ||
      hookLower.includes('aprende') || hookLower.includes('tutorial')) {
    tam = 'Tutorial';
  }
  
  // Check for product keywords
  else if (guionLower.includes('producto') || guionLower.includes('comprar') ||
           guionLower.includes('precio') || guionLower.includes('descuento') ||
           ctaLower.includes('compra') || ctaLower.includes('link')) {
    tam = 'Producto';
  }

  return tam;
}

async function cleanupGeminiFile(geminiFile: any, requestId: string): Promise<void> {
  try {
    await fetch(
      `https://generativelanguage.googleapis.com/v1beta/${geminiFile.name}?key=${GOOGLE_API_KEY}`,
      { method: 'DELETE' }
    );
    console.log(`[${requestId}] Cleaned up Gemini file`);
  } catch (error) {
    console.warn(`[${requestId}] Failed to cleanup Gemini file:`, error);
  }
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

    // Step 1: Get video binary data
    let videoData: Uint8Array;
    
    try {
      if (body.storage_path) {
        console.log(`[${requestId}] Using storage path: ${body.storage_path}`);
        videoData = await getVideoFromStorage(body.storage_path);
      } else {
        console.log(`[${requestId}] Using URL: ${body.url}`);
        videoData = await fetchVideoFromUrl(body.url!);
      }
    } catch (fetchError) {
      if (body.url && !body.storage_path) {
        console.error(`[${requestId}] URL fetch blocked:`, fetchError);
        return new Response(
          JSON.stringify({ 
            error: 'URL fetch blocked', 
            message: 'Please upload the video to storage first',
            code: 'FETCH_BLOCKED'
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw fetchError;
    }

    // Step 2: Upload to Gemini
    const geminiFile = await uploadToGemini(videoData, requestId);

    // Step 3: Analyze with Gemini
    let analysis: VideoAnalysis;
    try {
      analysis = await analyzeWithGemini(geminiFile, requestId);
    } catch (analysisError) {
      console.error(`[${requestId}] Analysis failed:`, analysisError);
      analysis = {
        guion_oral: "Error en análisis",
        hook: "Error en análisis", 
        cta: "Error en análisis",
        estilo_edicion: "Error en análisis",
        tema_principal: "Entretener",
        justificacion_tema: `Error: ${analysisError}`
      };
    }

    // Step 4: Generate derived values
    const tags_ai = await generateTags(analysis, requestId);
    const tam_ai = mapTemaToTam(analysis.tema_principal, analysis);

    // Step 5: Create response payload
    const videoId = body.video_id || `video_${Date.now()}`;
    const response = {
      video_id: videoId,
      thumbnail_url: null, // TODO: Could extract frame from video
      duration_seconds: null, // TODO: Could analyze video metadata
      metrics: {
        views: 0,
        likes: 0,
        comments: 0,
        shares: 0
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

    // Step 6: Save to database
    try {
      const videoRecord = {
        user_id: user.id,
        tiktok_url: body.url || '',
        storage_path: body.storage_path || null,
        guion_oral: analysis.guion_oral,
        hook: analysis.hook,
        cta_type: analysis.cta,
        editing_style: analysis.estilo_edicion,
        video_theme: analysis.tema_principal,
        justificacion_tema: analysis.justificacion_tema,
        tags_ai: tags_ai,
        tam_ai: tam_ai,
        metrics_views: 0,
        metrics_likes: 0,
        metrics_comments: 0,
        metrics_shares: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log(`[${requestId}] Attempting to save to database:`, videoRecord);

      const { data: insertData, error: insertError } = await supabaseAdmin
        .from('reference_videos')
        .insert(videoRecord)
        .select();

      if (insertError) {
        console.error(`[${requestId}] Database insert failed:`, insertError);
        console.error(`[${requestId}] Insert error details:`, {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
      } else {
        console.log(`[${requestId}] Saved to database successfully:`, insertData);
      }
    } catch (dbError) {
      console.error(`[${requestId}] Database error:`, dbError);
    }

    // Step 7: Cleanup
    await cleanupGeminiFile(geminiFile, requestId);

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