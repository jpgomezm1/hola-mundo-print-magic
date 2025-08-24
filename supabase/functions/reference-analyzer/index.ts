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

interface VideoAnalysis {
  guion_oral: string;
  hook: string;
  cta: string;
  estilo_edicion: string;
  tema_principal: string;
  justificacion_tema: string;
}

interface AnalyzeRequest {
  url: string;
  video_id?: string;
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

class TikTokAnalyzer {
  private geminiApiKey: string;
  
  constructor(geminiApiKey: string) {
    this.geminiApiKey = geminiApiKey;
  }

  private log(level: string, message: string, videoId?: string) {
    const timestamp = new Date().toISOString();
    const logMessage = videoId 
      ? `[${timestamp}] [${level}] [${videoId}] ${message}`
      : `[${timestamp}] [${level}] ${message}`;
    
    console.log(logMessage);
  }

  private safeConvertToString(value: any): string {
    if (value === null || value === undefined) {
      return "";
    } else if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    } else if (Array.isArray(value)) {
      try {
        return value.map(item => String(item)).join(", ");
      } catch {
        return String(value);
      }
    } else {
      return String(value);
    }
  }

  private async downloadTikTokVideo(url: string, videoId: string): Promise<Uint8Array> {
    this.log("INFO", `Descargando video: ${url}`, videoId);
    
    try {
      // Intentar descargar directamente del video
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      this.log("INFO", "Video descargado exitosamente", videoId);
      
      return new Uint8Array(buffer);
      
    } catch (error) {
      this.log("ERROR", `Error descargando video: ${error.message}`, videoId);
      throw error;
    }
  }

  private async uploadVideoToGemini(videoData: Uint8Array, videoId: string): Promise<any> {
    this.log("INFO", "Subiendo video a Gemini", videoId);
    
    try {
      // Use the resumable upload protocol for Gemini Files API
      const metadata = {
        file: {
          display_name: `video_${videoId}`,
          mime_type: 'video/mp4'
        }
      };
      
      // Step 1: Start resumable upload
      const startResponse = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'X-Goog-Upload-Protocol': 'resumable',
          'X-Goog-Upload-Command': 'start',
          'X-Goog-Upload-Header-Content-Length': videoData.length.toString(),
          'X-Goog-Upload-Header-Content-Type': 'video/mp4',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      });
      
      if (!startResponse.ok) {
        const errorText = await startResponse.text();
        throw new Error(`Start upload failed: ${startResponse.status} - ${errorText}`);
      }
      
      const uploadUrl = startResponse.headers.get('X-Goog-Upload-URL');
      if (!uploadUrl) {
        throw new Error('No upload URL received');
      }
      
      // Step 2: Upload the file data
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Length': videoData.length.toString(),
          'X-Goog-Upload-Offset': '0',
          'X-Goog-Upload-Command': 'upload, finalize'
        },
        body: videoData
      });
      
      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} - ${errorText}`);
      }
      
      const uploadResult = await uploadResponse.json();
      this.log("INFO", "Video subido, esperando procesamiento", videoId);
      
      // Wait for processing
      const fileName = uploadResult.file?.name;
      if (!fileName) {
        throw new Error('No filename returned from upload');
      }

      let processingAttempts = 0;
      const maxAttempts = 20;
      
      while (processingAttempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const statusResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${this.geminiApiKey}`);
        
        if (!statusResponse.ok) {
          throw new Error(`Status check failed with ${statusResponse.status}`);
        }
        
        const statusResult = await statusResponse.json();
        this.log("INFO", `Estado de procesamiento: ${statusResult.state} (${processingAttempts + 1}/${maxAttempts})`, videoId);
        
        if (statusResult.state === 'ACTIVE') {
          this.log("INFO", "Video procesado exitosamente en Gemini", videoId);
          return statusResult;
        } else if (statusResult.state === 'FAILED') {
          throw new Error('Error procesando video en Gemini');
        }
        
        processingAttempts++;
      }
      
      throw new Error('Timeout esperando procesamiento en Gemini');
      
    } catch (error) {
      this.log("ERROR", `Error subiendo a Gemini: ${error.message}`, videoId);
      throw error;
    }
  }

  private async analyzeVideoContent(videoFile: any, videoId: string): Promise<VideoAnalysis> {
    this.log("INFO", "Analizando contenido del video con Gemini", videoId);
    
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
      const analysisResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${this.geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  file_data: {
                    mime_type: videoFile.mimeType,
                    file_uri: videoFile.uri
                  }
                },
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        throw new Error(`Error analyzing video: ${analysisResponse.status} - ${errorText}`);
      }

      const analysisData = await analysisResponse.json();
      
      if (!analysisData.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('No analysis text returned from Gemini');
      }
      
      let responseText = analysisData.candidates[0].content.parts[0].text.trim();
      
      // Limpiar respuesta
      if (responseText.startsWith('```json')) {
        responseText = responseText.slice(7, -3);
      } else if (responseText.startsWith('```')) {
        responseText = responseText.slice(3, -3);
      }
      
      const analysis = JSON.parse(responseText);
      
      // Convertir todos los valores a string de forma segura
      const safeAnalysis: VideoAnalysis = {
        guion_oral: this.safeConvertToString(analysis.guion_oral),
        hook: this.safeConvertToString(analysis.hook),
        cta: this.safeConvertToString(analysis.cta),
        estilo_edicion: this.safeConvertToString(analysis.estilo_edicion),
        tema_principal: this.safeConvertToString(analysis.tema_principal),
        justificacion_tema: this.safeConvertToString(analysis.justificacion_tema)
      };
      
      this.log("INFO", `Análisis completado. Tema: ${safeAnalysis.tema_principal}`, videoId);
      return safeAnalysis;
      
    } catch (error) {
      this.log("ERROR", `Error analizando video: ${error.message}`, videoId);
      return {
        guion_oral: "Error en análisis",
        hook: "Error en análisis",
        cta: "Error en análisis",
        estilo_edicion: "Error en análisis",
        tema_principal: "Error",
        justificacion_tema: `Error: ${error.message}`
      };
    }
  }

  private async deleteGeminiFile(fileName: string, videoId: string): Promise<void> {
    try {
      const deleteResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${this.geminiApiKey}`, {
        method: 'DELETE'
      });
      
      if (deleteResponse.ok) {
        this.log("INFO", "Archivo eliminado de Gemini", videoId);
      } else {
        this.log("WARN", `Error eliminando archivo de Gemini: ${deleteResponse.status}`, videoId);
      }
    } catch (error) {
      this.log("WARN", `Error eliminando archivo de Gemini: ${error.message}`, videoId);
    }
  }

  async processSingleVideo(url: string, videoId: string): Promise<VideoAnalysis> {
    let geminiFile: any = null;
    
    try {
      this.log("INFO", "Iniciando procesamiento del video", videoId);
      
      // 1. Descargar video
      const videoData = await this.downloadTikTokVideo(url, videoId);
      
      // 2. Subir a Gemini
      geminiFile = await this.uploadVideoToGemini(videoData, videoId);
      
      // 3. Analizar contenido
      const analysis = await this.analyzeVideoContent(geminiFile, videoId);
      
      this.log("INFO", "Video procesado completamente", videoId);
      return analysis;
      
    } catch (error) {
      this.log("ERROR", `Error procesando video: ${error.message}`, videoId);
      return {
        guion_oral: "Error en procesamiento",
        hook: "Error en procesamiento",
        cta: "Error en procesamiento",
        estilo_edicion: "Error en procesamiento",
        tema_principal: "Error",
        justificacion_tema: `Error: ${error.message}`
      };
    } finally {
      // Limpiar archivo de Gemini
      if (geminiFile && geminiFile.name) {
        await this.deleteGeminiFile(geminiFile.name, videoId);
      }
    }
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
    console.log(`[${requestId}] Request body received`, { 
      hasUrl: !!body.url, 
      videoId: body.video_id 
    });

    // Validate input
    if (!body.url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
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

    const videoId = body.video_id || `video_${Date.now()}`;
    
    // Create analyzer and process video
    const analyzer = new TikTokAnalyzer(GEMINI_API_KEY!);
    const analysis = await analyzer.processSingleVideo(body.url, videoId);
    
    // Generate tags and TAM
    const tags_ai = ['tiktok', 'video-analizado', analysis.tema_principal.toLowerCase()];
    const tam_ai = mapTemaToTam(analysis.tema_principal);

    // Extract TikTok video ID for better metadata
    const tiktokVideoIdMatch = body.url.match(/video\/(\d+)/);
    const tiktokVideoId = tiktokVideoIdMatch ? tiktokVideoIdMatch[1] : 'unknown';

    // Create response payload first
    const response = {
      video_id: videoId,
      thumbnail_url: null,
      duration_seconds: 30,
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

    // Save to database
    try {
      const videoRecord = {
        user_id: user.id,
        tiktok_url: body.url,
        title: `TikTok Video ${tiktokVideoId}`,
        description: "Video analyzed from TikTok",
        duration_seconds: 30,
        thumbnail_url: null,
        creator_username: null,
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
      // Continue with response even if DB save fails
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