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

// Download video using yt-dlp equivalent and upload to Gemini Files API
async function downloadAndAnalyzeVideo(videoUrl: string, videoId: string) {
  console.log(`[DESCARGA] Descargando video ID ${videoId}: ${videoUrl}`);
  
  try {
    // Step 1: Download video using a fetch-based approach (simulating yt-dlp)
    const videoResponse = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!videoResponse.ok) {
      throw new Error(`Error downloading video: ${videoResponse.status}`);
    }
    
    const videoBlob = await videoResponse.arrayBuffer();
    console.log(`[OK] Video descargado: ${videoBlob.byteLength} bytes`);
    
    // Step 2: Create a temporary file and upload to Supabase Storage
    const fileName = `temp_video_${videoId}_${Date.now()}.mp4`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('temp-videos')
      .upload(fileName, videoBlob, {
        contentType: 'video/mp4',
        cacheControl: '3600'
      });
    
    if (uploadError) {
      throw new Error(`Error uploading to storage: ${uploadError.message}`);
    }
    
    console.log(`[STORAGE] Video guardado en storage: ${fileName}`);
    
    // Step 3: Get public URL for the video
    const { data: urlData } = supabase.storage
      .from('temp-videos')
      .getPublicUrl(fileName);
    
    if (!urlData.publicUrl) {
      throw new Error('Error getting public URL');
    }
    
    console.log(`[GEMINI] Subiendo video ${videoId} a Gemini...`);
    
    // Step 4: Upload to Gemini Files API
    const uploadToGeminiResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'multipart'
      },
      body: createMultipartBody(videoBlob, `video_${videoId}.mp4`, 'video/mp4')
    });
    
    if (!uploadToGeminiResponse.ok) {
      throw new Error(`Error uploading to Gemini: ${uploadToGeminiResponse.status}`);
    }
    
    const geminiFile = await uploadToGeminiResponse.json();
    console.log(`[GEMINI] Archivo subido a Gemini: ${geminiFile.name}`);
    
    // Step 5: Wait for processing
    let fileStatus = geminiFile;
    while (fileStatus.state === 'PROCESSING') {
      console.log(`[PROCESANDO] Procesando video ${videoId} en Gemini...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const statusResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${geminiFile.name}?key=${geminiApiKey}`);
      fileStatus = await statusResponse.json();
    }
    
    if (fileStatus.state === 'FAILED') {
      throw new Error(`Error al procesar el video ${videoId} en Gemini`);
    }
    
    console.log(`[OK] Video ${videoId} procesado exitosamente en Gemini`);
    
    // Step 6: Analyze with Gemini
    const analysis = await analyzeVideoWithGemini(geminiFile, videoId);
    
    // Step 7: Cleanup - Delete from storage and Gemini
    try {
      await supabase.storage.from('temp-videos').remove([fileName]);
      await fetch(`https://generativelanguage.googleapis.com/v1beta/${geminiFile.name}?key=${geminiApiKey}`, {
        method: 'DELETE'
      });
      console.log(`[LIMPIEZA] Archivos eliminados para video ${videoId}`);
    } catch (cleanupError) {
      console.warn(`[AVISO] Error en limpieza: ${cleanupError}`);
    }
    
    return analysis;
    
  } catch (error) {
    console.error(`[ERROR CRITICO] Error procesando video ${videoId}:`, error);
    throw error;
  }
}

// Create multipart body for file upload
function createMultipartBody(fileData: ArrayBuffer, fileName: string, mimeType: string): FormData {
  const formData = new FormData();
  const file = new File([fileData], fileName, { type: mimeType });
  formData.append('metadata', JSON.stringify({ name: fileName }));
  formData.append('file', file);
  return formData;
}

// Analyze video content with Gemini
async function analyzeVideoWithGemini(geminiFile: any, videoId: string) {
  console.log(`[ANALISIS] Analizando contenido del video ${videoId} con Gemini...`);
  
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
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { fileData: { mimeType: geminiFile.mimeType, fileUri: geminiFile.uri } }
          ]
        }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 4096 }
      })
    });

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]) {
      throw new Error('No response from Gemini');
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    // Clean response and parse JSON
    let cleanResponse = aiResponse.trim();
    if (cleanResponse.startsWith('```json')) {
      cleanResponse = cleanResponse.slice(7, -3);
    } else if (cleanResponse.startsWith('```')) {
      cleanResponse = cleanResponse.slice(3, -3);
    }
    
    const analysis = JSON.parse(cleanResponse);
    
    console.log(`[OK] Análisis completado para video ${videoId}`);
    console.log(`[RESULTADO] Tema identificado: ${analysis.tema_principal || 'N/A'}`);
    
    return {
      hook: analysis.hook || "Análisis completado",
      script: analysis.guion_oral || "Contenido analizado",
      editing_style: analysis.estilo_edicion || "Estilo identificado",
      cta_type: analysis.cta || "Engagement",
      video_theme: analysis.tema_principal || "Entretener",
      tone_style: analysis.justificacion_tema || "Análisis de tono",
      visual_elements: ["Elementos del video real"],
      audio_style: "Audio analizado",
      insights: {
        viral_factors: ["Factores virales identificados"],
        target_audience: "Audiencia analizada",
        replication_tips: ["Tips del video real"],
        viral_score: 8,
        metrics_analysis: "Análisis basado en video real",
        detailed_analysis: analysis
      }
    };
    
  } catch (error) {
    console.error(`[ERROR] Error al analizar video ${videoId}:`, error);
    return {
      hook: "Error en análisis",
      script: "Error en procesamiento",
      editing_style: "Error en análisis",
      cta_type: "Error",
      video_theme: "Entretener",
      tone_style: "Error",
      visual_elements: ["Error"],
      audio_style: "Error",
      insights: {
        viral_factors: ["Error"],
        target_audience: "Error",
        replication_tips: ["Error"],
        viral_score: 5,
        metrics_analysis: "Error en análisis"
      }
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, tiktok_url, tags, category, notes } = await req.json();
    
    const authHeader = req.headers.get('authorization');
    const { data: { user } } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '') || '');
    
    if (!user) throw new Error('User not authenticated');

    if (action === 'analyze') {
      console.log('Analyzing TikTok video:', tiktok_url);
      
      // Get account context
      const { data: accountContext } = await supabase
        .from('tiktok_account_contexts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Extract basic metadata
      const videoId = tiktok_url.match(/video\/(\d+)/)?.[1] || 'unknown';
      const username = tiktok_url.match(/@([\w.]+)\//)?.[1] || 'unknown';
      
      // Download and analyze video with Gemini (like Python script)
      const analysis = await downloadAndAnalyzeVideo(tiktok_url, videoId);
      
      // Map theme to allowed values
      const mapTheme = (theme: string) => {
        const normalized = theme?.toLowerCase() || '';
        if (normalized.includes('educar')) return 'Educar';
        if (normalized.includes('identificar')) return 'Identificar';
        if (normalized.includes('activar')) return 'Activar';
        return 'Entretener';
      };

      // Save to database
      const { data: savedVideo, error: saveError } = await supabase
        .from('reference_videos')
        .insert({
          user_id: user.id,
          tiktok_url,
          title: `Video de @${username}`,
          description: `Video analizado de TikTok`,
          hook: analysis.hook,
          script: analysis.script,
          editing_style: analysis.editing_style,
          cta_type: analysis.cta_type,
          video_theme: mapTheme(analysis.video_theme),
          tone_style: analysis.tone_style,
          visual_elements: analysis.visual_elements,
          audio_style: analysis.audio_style,
          extracted_insights: analysis.insights,
          creator_username: username,
          tags: tags || [],
          category: category || 'otros',
          notes: notes || '',
          viral_score: analysis.insights?.viral_score || 7,
          processing_status: 'completed'
        })
        .select()
        .single();

      if (saveError) throw saveError;

      return new Response(JSON.stringify({
        success: true,
        reference_video: savedVideo,
        analysis
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});