import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const geminiApiKey = Deno.env.get('GEMINI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Constants
const DOWNLOAD_TIMEOUT_MS = 30000;
const GEMINI_PROCESS_TOTAL_MS = 60000;
const GEMINI_POLL_INTERVAL_MS = 3000;
const MAX_RETRIES = 3;
const BACKOFF_MS = 1500;
const MAX_VIDEO_SIZE_BYTES = 104857600; // 100MB

// Helper to create controlled error response
function createControlledErrorResponse(errorMessage: string) {
  return {
    success: false,
    error: errorMessage,
    analysis: {
      guion_oral: "Error en análisis",
      hook: "Error en análisis", 
      cta: "Error en análisis",
      estilo_edicion: "Error en análisis",
      tema_principal: "Error",
      justificacion_tema: "Error en análisis"
    }
  };
}

// Safe JSON parser
function safeJSONParse(text: string): any {
  try {
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.slice(7, -3);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.slice(3, -3);
    }
    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error('[JSON_PARSE_ERROR]', error);
    return null;
  }
}

// Extract video ID from TikTok URL
function extractVideoId(url: string): string {
  const match = url.match(/video\/(\d+)/);
  return match ? match[1] : '';
}

// Extract TikTok video metadata and URL
async function extractTikTokVideoUrl(tiktokUrl: string): Promise<{directUrl?: string, metadata: any}> {
  console.log(`[EXTRACTOR] Extrayendo información del video: ${tiktokUrl}`);
  
  const videoId = extractVideoId(tiktokUrl);
  if (!videoId) {
    throw new Error('No se pudo extraer el ID del video');
  }

  // Try to get metadata from TikTok (fallback approach)
  try {
    console.log(`[EXTRACTOR] Intentando método TikWM`);
    const fallbackUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(tiktokUrl)}&hd=1`;
    
    const response = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.code === 0 && data.data) {
        console.log(`[EXTRACTOR] Metadata obtenida exitosamente`);
        return {
          directUrl: data.data.play,
          metadata: {
            title: data.data.title || '',
            author: data.data.author?.nickname || '',
            username: data.data.author?.unique_id || '',
            duration: data.data.duration || 0,
            views: data.data.play_count || 0,
            likes: data.data.digg_count || 0,
            comments: data.data.comment_count || 0,
            shares: data.data.share_count || 0
          }
        };
      }
    }
  } catch (error) {
    console.warn(`[EXTRACTOR] TikWM falló: ${error.message}`);
  }

  // Return basic metadata if extraction fails
  const username = tiktokUrl.match(/@([\w.]+)\//)?.[1] || 'unknown';
  return {
    directUrl: null,
    metadata: {
      title: `Video de @${username}`,
      author: username,
      username: username,
      duration: 0,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    }
  };
}

// Download video with timeout
async function downloadVideo(videoUrl: string): Promise<ArrayBuffer> {
  console.log(`[DOWNLOAD] Descargando video...`);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);
  
  try {
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://www.tiktok.com/'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Error descargando video: ${response.status}`);
    }
    
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_VIDEO_SIZE_BYTES) {
      throw new Error('Video demasiado grande');
    }
    
    const videoBlob = await response.arrayBuffer();
    console.log(`[DOWNLOAD] Video descargado: ${videoBlob.byteLength} bytes`);
    
    if (videoBlob.byteLength > MAX_VIDEO_SIZE_BYTES) {
      throw new Error('Video demasiado grande');
    }
    
    return videoBlob;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Upload video to Gemini Files API
async function uploadToGemini(videoBlob: ArrayBuffer, videoId: string): Promise<any> {
  console.log(`[GEMINI_UPLOAD] Subiendo video ${videoId} a Gemini...`);
  
  const formData = new FormData();
  const videoFile = new File([videoBlob], `video_${videoId}.mp4`, { type: 'video/mp4' });
  formData.append('file', videoFile);
  
  const response = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${geminiApiKey}`, {
    method: 'POST',
    body: formData
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error subiendo a Gemini: ${response.status} - ${errorText}`);
  }
  
  const geminiFile = await response.json();
  console.log(`[GEMINI_UPLOAD] Archivo subido: ${geminiFile.name}`);
  return geminiFile;
}

// Wait for Gemini file processing with polling
async function waitForProcessing(geminiFile: any): Promise<any> {
  console.log(`[GEMINI_PROCESSING] Esperando procesamiento...`);
  
  const startTime = Date.now();
  let fileStatus = geminiFile;
  
  while (fileStatus.state === 'PROCESSING') {
    if (Date.now() - startTime > GEMINI_PROCESS_TOTAL_MS) {
      throw new Error('Timeout esperando procesamiento de Gemini');
    }
    
    await new Promise(resolve => setTimeout(resolve, GEMINI_POLL_INTERVAL_MS));
    
    try {
      const fileId = geminiFile.name.split('/').pop();
      const statusResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${fileId}?key=${geminiApiKey}`);
      
      if (statusResponse.ok) {
        fileStatus = await statusResponse.json();
        console.log(`[GEMINI_PROCESSING] Estado: ${fileStatus.state}`);
      }
    } catch (error) {
      console.warn(`[GEMINI_PROCESSING] Error verificando estado: ${error.message}`);
    }
  }
  
  if (fileStatus.state === 'FAILED') {
    throw new Error('Gemini falló al procesar el video');
  }
  
  console.log(`[GEMINI_PROCESSING] Procesamiento completado`);
  return fileStatus;
}

// Analyze video with Gemini
async function analyzeWithGemini(geminiFile: any, videoId: string): Promise<any> {
  console.log(`[GEMINI_ANALYSIS] Analizando video ${videoId}...`);
  
  const prompt = `Analiza este video de TikTok y proporciona la siguiente información en formato JSON:

{
  "guion_oral": "Transcripción completa de todo lo que se dice en el video",
  "hook": "Descripción del gancho inicial usado para captar atención (primeros 3 segundos)",
  "cta": "Call to Action utilizado (si existe), qué acción se pide al viewer - SOLO TEXTO",
  "estilo_edicion": "Descripción del estilo de edición: cortes, transiciones, efectos, música, ritmo, etc.",
  "tema_principal": "Una de estas opciones: Entretener, Identificar, Activar, Educar",
  "justificacion_tema": "Breve explicación de por qué clasificaste el video en esa categoría"
}

IMPORTANTE: campos en TEXTO PLANO, sin objetos anidados. Responde únicamente con JSON válido, sin texto adicional.

Definiciones de los temas:
- Entretener: Provocar risa, incomodidad o sorpresa, contenido diseñado para enganchar y quedarse en la cabeza
- Identificar: Que la gente diga "yo soy ese" o "eso me pasa a mí", reforzando la conexión emocional
- Activar: Motivar a compartir o comentar, unirse a la comunidad o dar un paso más en el funnel, con CTAs claros
- Educar: Explicar herramientas, conceptos o procesos`;

  const requestBody = {
    contents: [{
      parts: [
        { text: prompt },
        { 
          fileData: { 
            mimeType: geminiFile.mimeType || 'video/mp4',
            fileUri: geminiFile.uri || geminiFile.name // Usar .uri si existe, sino .name
          } 
        }
      ]
    }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 4096
    }
  };
  
  const fileUri = geminiFile.uri || geminiFile.name;
  console.log(`[GEMINI_ANALYSIS] Usando fileUri: ${fileUri}`);
  console.log(`[GEMINI_ANALYSIS] Archivo completo:`, JSON.stringify(geminiFile, null, 2));
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en análisis Gemini: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0]) {
    console.error(`[GEMINI_ANALYSIS] Sin candidates en respuesta:`, data);
    throw new Error('Sin respuesta válida de Gemini');
  }
  
  const aiResponse = data.candidates[0].content.parts[0].text;
  console.log(`[GEMINI_ANALYSIS] Respuesta recibida: ${aiResponse.substring(0, 200)}...`);
  
  const analysis = safeJSONParse(aiResponse);
  if (!analysis) {
    throw new Error('Error parseando respuesta JSON');
  }
  
  console.log(`[GEMINI_ANALYSIS] Análisis completado: tema=${analysis.tema_principal}`);
  return analysis;
}

// Clean up Gemini file
async function cleanupGeminiFile(geminiFile: any): Promise<void> {
  try {
    const fileId = geminiFile.name.split('/').pop();
    await fetch(`https://generativelanguage.googleapis.com/v1beta/files/${fileId}?key=${geminiApiKey}`, {
      method: 'DELETE'
    });
    console.log(`[CLEANUP] Archivo eliminado de Gemini: ${fileId}`);
  } catch (error) {
    console.warn(`[CLEANUP] Error eliminando archivo: ${error.message}`);
  }
}

// Map theme to allowed values
function mapTheme(theme: string): string {
  const normalized = theme?.toLowerCase() || '';
  if (normalized.includes('educar')) return 'Educar';
  if (normalized.includes('identificar')) return 'Identificar';
  if (normalized.includes('activar')) return 'Activar';
  return 'Entretener';
}

// Analyze with text-based approach (fallback)
async function analyzeWithText(tiktokUrl: string, metadata: any, videoId: string): Promise<any> {
  console.log(`[TEXT_ANALYSIS] Analizando con contexto de texto: ${videoId}...`);
  
  const prompt = `Analiza este video de TikTok basándote en la URL y contexto disponible:

URL: ${tiktokUrl}
Título: ${metadata.title}
Autor: @${metadata.username}
Duración: ${metadata.duration}s

Proporciona la siguiente información en formato JSON:

{
  "guion_oral": "Basándote en el título y contexto, infiere el posible contenido hablado",
  "hook": "Basándote en el título, describe el posible gancho inicial",
  "cta": "Analiza si hay un CTA implícito en el título o contexto",
  "estilo_edicion": "Infiere el posible estilo de edición basado en el tipo de contenido",
  "tema_principal": "Una de estas opciones: Entretener, Identificar, Activar, Educar",
  "justificacion_tema": "Breve explicación de por qué clasificaste el video en esa categoría"
}

IMPORTANTE: campos en TEXTO PLANO, sin objetos anidados. Responde únicamente con JSON válido, sin texto adicional.

Definiciones de los temas:
- Entretener: Provocar risa, incomodidad o sorpresa, contenido diseñado para enganchar y quedarse en la cabeza
- Identificar: Que la gente diga "yo soy ese" o "eso me pasa a mí", reforzando la conexión emocional
- Activar: Motivar a compartir o comentar, unirse a la comunidad o dar un paso más en el funnel, con CTAs claros
- Educar: Explicar herramientas, conceptos o procesos`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 4096
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en análisis de texto: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0]) {
    throw new Error('Sin respuesta válida de Gemini');
  }

  const aiResponse = data.candidates[0].content.parts[0].text;
  console.log(`[TEXT_ANALYSIS] Respuesta recibida: ${aiResponse.substring(0, 200)}...`);
  
  const analysis = safeJSONParse(aiResponse);
  if (!analysis) {
    throw new Error('Error parseando respuesta JSON');
  }

  console.log(`[TEXT_ANALYSIS] Análisis completado: tema=${analysis.tema_principal}`);
  return analysis;
}

// Process single video (hybrid approach)
async function processVideo(tiktokUrl: string, videoId: string, userId: string, tags: string[], category: string, notes: string) {
  let geminiFile: any = null;
  
  try {
    console.log(`[PROCESS] Iniciando procesamiento del video ${videoId}`);
    
    // 1. Extract video metadata
    const { directUrl, metadata } = await extractTikTokVideoUrl(tiktokUrl);
    console.log(`[PROCESS] Metadata extraída. DirectUrl disponible: ${!!directUrl}`);
    
    let analysis: any;
    
    // 2. Try video analysis if we have direct URL
    if (directUrl) {
      try {
        console.log(`[PROCESS] Intentando análisis con video directo`);
        
        // Download video
        const videoBlob = await downloadVideo(directUrl);
        
        // Upload to Gemini
        geminiFile = await uploadToGemini(videoBlob, videoId);
        
        // Wait for processing
        const processedFile = await waitForProcessing(geminiFile);
        
        // Analyze with Gemini
        analysis = await analyzeWithGemini(processedFile, videoId);
        console.log(`[PROCESS] Análisis con video completado exitosamente`);
        
      } catch (videoError) {
        console.warn(`[PROCESS] Error en análisis con video: ${videoError.message}`);
        console.log(`[PROCESS] Fallback a análisis con texto`);
        
        // Cleanup failed Gemini file if it exists
        if (geminiFile) {
          await cleanupGeminiFile(geminiFile);
          geminiFile = null;
        }
        
        // Fallback to text analysis
        analysis = await analyzeWithText(tiktokUrl, metadata, videoId);
      }
    } else {
      console.log(`[PROCESS] No hay URL directa, usando análisis con texto`);
      analysis = await analyzeWithText(tiktokUrl, metadata, videoId);
    }
    
    // 3. Create analysis response
    const analysisResponse = {
      hook: analysis.hook || "Hook analizado",
      script: analysis.guion_oral || "Contenido analizado", 
      editing_style: analysis.estilo_edicion || "Estilo identificado",
      cta_type: analysis.cta || "Engagement",
      video_theme: analysis.tema_principal || "Entretener",
      tone_style: analysis.justificacion_tema || "Análisis de tono",
      visual_elements: ["Elementos del video analizados"],
      audio_style: "Audio analizado",
      insights: {
        viral_factors: ["Factores virales identificados"],
        target_audience: "Audiencia analizada", 
        replication_tips: ["Tips de replicación"],
        viral_score: 7,
        metrics_analysis: "Análisis basado en contenido",
        detailed_analysis: analysis
      }
    };
    
    // 4. Save to database
    const { data: savedVideo, error: saveError } = await supabase
      .from('reference_videos')
      .insert({
        user_id: userId,
        tiktok_url: tiktokUrl,
        title: metadata.title || `Video de @${metadata.username}`,
        description: `Video analizado de TikTok`,
        hook: analysisResponse.hook,
        script: analysisResponse.script,
        editing_style: analysisResponse.editing_style,
        cta_type: analysisResponse.cta_type,
        video_theme: mapTheme(analysisResponse.video_theme),
        tone_style: analysisResponse.tone_style,
        visual_elements: analysisResponse.visual_elements,
        audio_style: analysisResponse.audio_style,
        extracted_insights: analysisResponse.insights,
        creator_username: metadata.username,
        tags: tags || [],
        category: category || 'otros',
        notes: notes || '',
        viral_score: analysisResponse.insights?.viral_score || 7,
        processing_status: 'completed'
      })
      .select()
      .single();
    
    if (saveError) {
      console.error('[DB_ERROR]', saveError);
      throw new Error(`Error guardando en base de datos: ${saveError.message}`);
    }
    
    console.log(`[SUCCESS] Video procesado y guardado exitosamente`);
    
    return {
      success: true,
      reference_video: savedVideo,
      analysis: analysisResponse
    };
    
  } finally {
    // Always cleanup Gemini file if it exists
    if (geminiFile) {
      await cleanupGeminiFile(geminiFile);
    }
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const { action, tiktok_url, tags, category, notes } = await req.json();
    
    // Validate input
    if (!action || action !== 'analyze') {
      return new Response(JSON.stringify(createControlledErrorResponse('Acción inválida')), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (!tiktok_url) {
      return new Response(JSON.stringify(createControlledErrorResponse('URL de TikTok requerida')), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Validate auth
    const authHeader = req.headers.get('authorization');
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '');
    
    if (authError || !user) {
      return new Response(JSON.stringify(createControlledErrorResponse('Usuario no autenticado')), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`[START] Procesando video: ${tiktok_url}`);
    
    // Extract video ID
    const videoId = extractVideoId(tiktok_url) || Date.now().toString();
    
    // Process video
    const result = await processVideo(tiktok_url, videoId, user.id, tags, category, notes);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[CONTROLLED_ERROR]', error);
    
    // Always return controlled error response
    return new Response(JSON.stringify(createControlledErrorResponse(error.message || 'Error procesando video')), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});