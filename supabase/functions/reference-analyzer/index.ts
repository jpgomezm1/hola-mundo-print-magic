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

interface TikTokVideoData {
  url: string;
  id?: string;
  title?: string;
  description?: string;
  duration?: number;
  thumbnail?: string;
  username?: string;
  hashtags?: string[];
  videoUrl?: string;
  author?: {
    username: string;
    nickname?: string;
    followers?: number;
    verified?: boolean;
    avatar?: string;
  };
  stats?: {
    views?: number;
    likes?: number;
    shares?: number;
    comments?: number;
  };
  musicMeta?: {
    title?: string;
    author?: string;
    playUrl?: string;
  };
  createTime?: number;
}

interface AnalyzedVideo {
  hook: string;
  script: string;
  editing_style: string;
  cta_type: string;
  video_theme: string;
  tone_style: string;
  visual_elements: string[];
  audio_style: string;
  insights: any;
}

// Enhanced TikTok metadata extraction
async function extractTikTokMetadata(url: string): Promise<TikTokVideoData> {
  console.log('Extracting metadata from TikTok URL:', url);
  
  try {
    const videoId = url.match(/@[\w.]+\/video\/(\d+)/)?.[1] || 
                   url.match(/tiktok\.com\/.*\/(\d+)/)?.[1] ||
                   'unknown';
    
    const username = url.match(/@([\w.]+)\//)?.[1] || 'unknown';
    
    // Try to fetch HTML page to extract metadata
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    let metadata: TikTokVideoData = {
      url,
      id: videoId,
      username,
      title: `TikTok Video ${videoId}`,
      description: 'Video content',
      duration: 30,
      thumbnail: '',
      hashtags: [],
      videoUrl: url
    };

    try {
      console.log('Fetching TikTok page HTML...');
      const response = await fetch(url, { headers });
      
      if (response.ok) {
        const html = await response.text();
        
        // Extract JSON-LD or structured data
        const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([^<]+)<\/script>/);
        if (jsonLdMatch) {
          try {
            const jsonData = JSON.parse(jsonLdMatch[1]);
            if (jsonData.name) metadata.title = jsonData.name;
            if (jsonData.description) metadata.description = jsonData.description;
            if (jsonData.thumbnailUrl) metadata.thumbnail = jsonData.thumbnailUrl;
            if (jsonData.duration) {
              const durationMatch = jsonData.duration.match(/PT(\d+)S/);
              if (durationMatch) metadata.duration = parseInt(durationMatch[1]);
            }
          } catch (e) {
            console.log('Failed to parse JSON-LD data');
          }
        }

        // Extract from meta tags
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
        if (titleMatch && titleMatch[1]) {
          metadata.title = titleMatch[1].replace(' | TikTok', '');
        }

        const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
        if (descriptionMatch) {
          metadata.description = descriptionMatch[1];
        }

        const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
        if (imageMatch) {
          metadata.thumbnail = imageMatch[1];
        }

        // Extract hashtags from description
        const hashtagMatches = metadata.description.match(/#[\w]+/g);
        if (hashtagMatches) {
          metadata.hashtags = hashtagMatches;
        }

        // Try to extract video stats from SIGI_STATE
        const sigiMatch = html.match(/window\['SIGI_STATE'\]\s*=\s*({.+?});/);
        if (sigiMatch) {
          try {
            const sigiData = JSON.parse(sigiMatch[1]);
            const itemModule = sigiData?.ItemModule;
            
            if (itemModule) {
              const videoData = itemModule[videoId];
              if (videoData) {
                metadata.stats = {
                  views: videoData.stats?.playCount || 0,
                  likes: videoData.stats?.diggCount || 0,
                  shares: videoData.stats?.shareCount || 0,
                  comments: videoData.stats?.commentCount || 0
                };
                
                if (videoData.desc) metadata.description = videoData.desc;
                if (videoData.video?.duration) metadata.duration = Math.round(videoData.video.duration);
                
                metadata.author = {
                  username: videoData.author || username,
                  nickname: videoData.nickname,
                  verified: videoData.verified || false
                };

                if (videoData.music) {
                  metadata.musicMeta = {
                    title: videoData.music.title,
                    author: videoData.music.authorName
                  };
                }
              }
            }
          } catch (e) {
            console.log('Failed to parse SIGI_STATE data:', e);
          }
        }

        console.log('Successfully extracted metadata:', {
          title: metadata.title,
          stats: metadata.stats,
          duration: metadata.duration
        });
      }
    } catch (fetchError) {
      console.log('Failed to fetch TikTok page, using fallback data:', fetchError);
    }

    return metadata;
  } catch (error) {
    console.error('Error extracting TikTok metadata:', error);
    throw new Error('Failed to extract video metadata');
  }
}

// Advanced video analysis using Gemini with comprehensive extraction
async function analyzeVideoContent(
  videoData: TikTokVideoData, 
  accountContext?: any
): Promise<AnalyzedVideo> {
  console.log('Analyzing video content with Gemini AI');
  
  const systemPrompt = `Eres un experto analizador de contenido viral de TikTok con más de 10 años de experiencia en marketing digital y creación de contenido. Tu trabajo es extraer información extremadamente detallada de videos de TikTok para poder replicar exactamente lo que los hace virales.

CONTEXTO DE LA CUENTA DEL USUARIO:
- Misión: ${accountContext?.mission || 'No definida'}
- Temas de contenido: ${accountContext?.content_themes?.join(', ') || 'Generales'}
- Tono de marca: ${accountContext?.tone_guide || 'Profesional pero accesible'}
- Posicionamiento: ${accountContext?.positioning || 'No definido'}
- Pilares de marca: ${accountContext?.brand_pillars?.join(', ') || 'No definidos'}

ANÁLISIS REQUERIDO (EXTREMADAMENTE DETALLADO):

1. ANÁLISIS DE HOOK (Primeros 3-5 segundos):
   - Transcripción exacta de las primeras palabras
   - Técnica específica utilizada (pregunta retórica, declaración impactante, estadística, storytelling, etc.)
   - Elementos visuales que captan atención en el primer frame
   - Score de efectividad del hook (1-10) con justificación
   - Recomendaciones específicas para replicar este hook

2. GUIÓN COMPLETO Y ESTRUCTURA NARRATIVA:
   - Transcripción completa del video palabra por palabra
   - Estructura narrativa identificada (problema-solución, antes-después, lista-tips, storytelling, etc.)
   - Momentos clave de retención (qué mantiene al espectador viendo)
   - Ritmo y cadencia del habla
   - Uso de pausas estratégicas

3. ESTILO DE EDICIÓN TÉCNICO:
   - Velocidad de cortes (cuántos cortes por minuto)
   - Tipos de transiciones específicas utilizadas
   - Uso de zoom-ins, zoom-outs, cambios de ángulo
   - Efectos visuales aplicados (filtros, overlays, etc.)
   - Estilo de subtítulos (fuente, color, posición, animación)
   - Paleta de colores dominante
   - Calidad de grabación y estabilización

4. CALL TO ACTION (CTA) DETALLADO:
   - CTA principal identificado
   - Momento exacto donde aparece (timestamp)
   - Forma de presentación (verbal, visual, o ambos)
   - Efectividad estimada del CTA
   - CTAs secundarios identificados

5. ANÁLISIS DE AUDIO PROFUNDO:
   - Música de fondo utilizada (género, tempo, mood)
   - Calidad y características de la voz (tono, velocidad, inflexión)
   - Efectos de sonido utilizados
   - Sincronización audio-visual
   - Niveles de volumen relativos

6. ELEMENTOS VISUALES ESPECÍFICOS:
   - Props y objetos en pantalla
   - Vestuario y styling
   - Iluminación (natural, artificial, setup)
   - Localización y setting
   - Gesticulación y lenguaje corporal
   - Expresiones faciales clave

7. ESTRATEGIA DE CONTENIDO:
   - Formato específico (tutorial, entertainment, educational, trending, etc.)
   - Tendencia o trend identificado
   - Target audience específico
   - Timing de publicación sugerido
   - Potencial de viralidad (1-10 con justificación)

8. MÉTRICAS Y PERFORMANCE:
   - Análisis de engagement rate actual
   - Factores que contribuyen a las vistas
   - Elementos que generan saves/shares
   - Predicción de performance en diferentes nichos

9. ADAPTABILIDAD Y REPLICACIÓN:
   - Elementos universales vs específicos del nicho
   - Nivel de dificultad para replicar (1-10)
   - Recursos necesarios para recrear
   - Variaciones sugeridas para otros nichos
   - Templates de guión adaptables

10. FACTORES VIRALES IDENTIFICADOS:
    - Elementos psicológicos que enganchan
    - Triggers emocionales utilizados
    - Técnicas de storytelling aplicadas
    - Factores de sorpresa o novedad
    - Elementos que generan engagement

Responde ÚNICAMENTE con un JSON perfectamente estructurado y válido. CRÍTICO: El JSON debe ser parseable sin errores.`;

  const userMessage = `ANALIZA ESTE VIDEO DE TIKTOK EN MÁXIMO DETALLE:

INFORMACIÓN BÁSICA DEL VIDEO:
- URL: ${videoData.url}
- Título: ${videoData.title || 'No disponible'}
- Descripción: ${videoData.description || 'No disponible'}
- Creador: @${videoData.username || 'unknown'}
- Duración: ${videoData.duration || 0} segundos
- Hashtags: ${videoData.hashtags?.join(', ') || 'No disponibles'}

MÉTRICAS DE ENGAGEMENT:
- Views: ${videoData.stats?.views?.toLocaleString() || 'No disponible'}
- Likes: ${videoData.stats?.likes?.toLocaleString() || 'No disponible'}
- Comentarios: ${videoData.stats?.comments?.toLocaleString() || 'No disponible'}
- Shares: ${videoData.stats?.shares?.toLocaleString() || 'No disponible'}

INFORMACIÓN DEL CREADOR:
- Username: ${videoData.author?.username || 'No disponible'}
- Verificado: ${videoData.author?.verified ? 'Sí' : 'No'}
- Followers: ${videoData.author?.followers?.toLocaleString() || 'No disponible'}

AUDIO METADATA:
- Música: ${videoData.musicMeta?.title || 'No disponible'}
- Artista: ${videoData.musicMeta?.author || 'No disponible'}

Proporciona un análisis extremadamente detallado siguiendo EXACTAMENTE la estructura del JSON requerida. Cada campo debe contener información específica y actionable.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userMessage}\n\nRespuesta requerida en formato JSON:`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              hook: {
                type: "object",
                properties: {
                  transcripcion: { type: "string" },
                  tecnica: { type: "string" },
                  elementos_visuales: { type: "array", items: { type: "string" } },
                  efectividad_score: { type: "number" },
                  recomendaciones: { type: "array", items: { type: "string" } }
                }
              },
              script: {
                type: "object",
                properties: {
                  transcripcion_completa: { type: "string" },
                  estructura_narrativa: { type: "string" },
                  momentos_clave: { type: "array", items: { type: "string" } },
                  ritmo_cadencia: { type: "string" },
                  pausas_estrategicas: { type: "array", items: { type: "string" } }
                }
              },
              editing_style: {
                type: "object",
                properties: {
                  cortes_por_minuto: { type: "number" },
                  tipos_transiciones: { type: "array", items: { type: "string" } },
                  movimientos_camara: { type: "array", items: { type: "string" } },
                  efectos_visuales: { type: "array", items: { type: "string" } },
                  subtitulos: {
                    type: "object",
                    properties: {
                      fuente: { type: "string" },
                      color: { type: "string" },
                      posicion: { type: "string" },
                      animacion: { type: "string" }
                    }
                  },
                  paleta_colores: { type: "array", items: { type: "string" } },
                  calidad_tecnica: { type: "string" }
                }
              },
              cta_type: {
                type: "object",
                properties: {
                  cta_principal: { type: "string" },
                  timestamp: { type: "string" },
                  presentacion: { type: "string" },
                  efectividad: { type: "number" },
                  ctas_secundarios: { type: "array", items: { type: "string" } }
                }
              },
              video_theme: {
                type: "object",
                properties: {
                  tema_principal: { type: "string" },
                  subtemas: { type: "array", items: { type: "string" } },
                  categoria: { type: "string" },
                  nicho_especifico: { type: "string" }
                }
              },
              tone_style: {
                type: "object",
                properties: {
                  tono_principal: { type: "string" },
                  emociones_evocadas: { type: "array", items: { type: "string" } },
                  personalidad_creador: { type: "string" },
                  nivel_energia: { type: "string" }
                }
              },
              visual_elements: {
                type: "object",
                properties: {
                  props_objetos: { type: "array", items: { type: "string" } },
                  vestuario_styling: { type: "string" },
                  iluminacion: { type: "string" },
                  localizacion: { type: "string" },
                  gesticulacion: { type: "array", items: { type: "string" } },
                  expresiones_clave: { type: "array", items: { type: "string" } }
                }
              },
              audio_style: {
                type: "object",
                properties: {
                  musica_fondo: {
                    type: "object",
                    properties: {
                      genero: { type: "string" },
                      tempo: { type: "string" },
                      mood: { type: "string" }
                    }
                  },
                  caracteristicas_voz: {
                    type: "object",
                    properties: {
                      tono: { type: "string" },
                      velocidad: { type: "string" },
                      inflexion: { type: "string" }
                    }
                  },
                  efectos_sonido: { type: "array", items: { type: "string" } },
                  sincronizacion: { type: "string" }
                }
              },
              insights: {
                type: "object",
                properties: {
                  viral_factors: { type: "array", items: { type: "string" } },
                  target_audience: { type: "string" },
                  replication_tips: { type: "array", items: { type: "string" } },
                  adaptabilidad: {
                    type: "object",
                    properties: {
                      elementos_universales: { type: "array", items: { type: "string" } },
                      elementos_especificos: { type: "array", items: { type: "string" } },
                      dificultad_replicacion": { type: "number" },
                      recursos_necesarios": { type: "array", items: { type: "string" } }
                    }
                  },
                  performance_analysis: {
                    type: "object",
                    properties: {
                      engagement_rate: { type: "number" },
                      factores_vistas: { type: "array", items: { type: "string" } },
                      elementos_saves: { type: "array", items: { type: "string" } },
                      potencial_viral: { type: "number" }
                    }
                  }
                }
              }
            }
          }
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Gemini response received');
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const parsed = JSON.parse(aiResponse);
      console.log('Successfully parsed Gemini response');
      
      // Transform the detailed structure to the simpler format expected by the database
      return {
        hook: parsed.hook?.transcripcion || "Hook extraído por Gemini",
        script: parsed.script?.transcripcion_completa || "Script completo extraído",
        editing_style: `${parsed.editing_style?.cortes_por_minuto || 0} cortes/min, ${parsed.editing_style?.tipos_transiciones?.join(', ') || 'transiciones estándar'}`,
        cta_type: parsed.cta_type?.cta_principal || "engagement",
        video_theme: parsed.video_theme?.tema_principal || "contenido general",
        tone_style: parsed.tone_style?.tono_principal || "neutral",
        visual_elements: [
          ...(parsed.visual_elements?.props_objetos || []),
          parsed.visual_elements?.vestuario_styling || "styling básico",
          parsed.visual_elements?.iluminacion || "iluminación estándar"
        ],
        audio_style: `${parsed.audio_style?.musica_fondo?.genero || 'música'} - ${parsed.audio_style?.caracteristicas_voz?.tono || 'tono normal'}`,
        insights: {
          detailed_analysis: parsed, // Store the full detailed analysis
          viral_factors: parsed.insights?.viral_factors || ["engagement"],
          target_audience: parsed.insights?.target_audience || "audiencia general",
          replication_tips: parsed.insights?.replication_tips || ["enfocar en engagement"],
          performance_score: parsed.insights?.performance_analysis?.potencial_viral || 5
        }
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw Gemini response:', aiResponse);
      
      // Fallback with basic analysis
      return {
        hook: "Hook extraído (requiere revisión manual)",
        script: "Script extraído por Gemini (formato sin parsear)",
        editing_style: "Estilo de edición estándar",
        cta_type: "engagement",
        video_theme: "contenido general",
        tone_style: "neutral",
        visual_elements: ["elementos visuales básicos"],
        audio_style: "audio estándar",
        insights: {
          raw_response: aiResponse,
          viral_factors: ["engagement"],
          target_audience: "audiencia general",
          replication_tips: ["revisar análisis manual"],
          error: "Error al parsear respuesta estructurada"
        }
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

// Generate adapted content using Gemini
async function generateAdaptedContent(
  referenceData: any,
  userPrompt: string,
  accountContext?: any
): Promise<{ adapted_content: string }> {
  console.log('Generating adapted content with Gemini');

  const systemPrompt = `Eres un creador experto de contenido para TikTok especializado en adaptar videos exitosos. Tu trabajo es tomar elementos virales de un video de referencia y adaptarlos perfectamente al contexto y nicho específico del usuario.

CONTEXTO DE LA CUENTA DEL USUARIO:
- Misión: ${accountContext?.mission || 'No definida'}
- Temas de contenido: ${accountContext?.content_themes?.join(', ') || 'Generales'}
- Tono de marca: ${accountContext?.tone_guide || 'Profesional pero accesible'}
- Posicionamiento: ${accountContext?.positioning || 'No definido'}
- NO hacer: ${accountContext?.do_not_do?.join(', ') || 'Nada específico'}

ANÁLISIS DEL VIDEO DE REFERENCIA:
- Hook original: ${referenceData.hook}
- Script original: ${referenceData.script}
- Estilo de edición: ${referenceData.editing_style}
- Tema: ${referenceData.video_theme}
- Tono: ${referenceData.tone_style}
- Elementos virales identificados: ${referenceData.extracted_insights?.viral_factors?.join(', ') || 'engagement general'}

INSTRUCCIONES PARA ADAPTACIÓN:
1. Mantén los elementos virales pero cambia el contexto al nicho del usuario
2. Conserva la estructura narrativa que funciona
3. Adapta el hook manteniendo la técnica que captura atención
4. Modifica el contenido para que sea relevante al audience del usuario
5. Mantén la cadencia y ritmo del original
6. Adapta los elementos visuales al contexto del usuario

Proporciona una adaptación completa y específica que el usuario pueda implementar inmediatamente.`;

  const userMessage = `SOLICITUD DE ADAPTACIÓN: ${userPrompt}

Basándote en el video de referencia analizado, crea una adaptación completa que incluya:

1. HOOK ADAPTADO: Reescribe el hook manteniendo la técnica viral pero aplicándola a mi nicho
2. SCRIPT COMPLETO ADAPTADO: Guión palabra por palabra adaptado a mi contexto
3. ELEMENTOS VISUALES SUGERIDOS: Qué props, vestuario, setting necesito
4. RECOMENDACIONES DE EDICIÓN: Cómo replicar el estilo de edición viral
5. CTA ADAPTADO: Call to action específico para mi audiencia
6. TIPS DE IMPLEMENTACIÓN: Pasos específicos para ejecutar este contenido

Sé específico y actionable. Quiero poder tomar tu respuesta e implementarla inmediatamente.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userMessage}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    return {
      adapted_content: aiResponse
    };
  } catch (error) {
    console.error('Error generating adapted content with Gemini:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user');
    }

    const { action, ...params } = await req.json();

    if (action === 'analyze') {
      const { tiktok_url, tags, category, notes } = params;
      
      // Get user's account context
      const { data: accountContext } = await supabase
        .from('tiktok_account_contexts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Extract video metadata
      const videoData = await extractTikTokMetadata(tiktok_url);
      
      // Analyze with AI
      const analysis = await analyzeVideoContent(videoData, accountContext);
      
      // Save to database
      const { data: savedVideo, error: saveError } = await supabase
        .from('reference_videos')
        .insert({
          user_id: user.id,
          tiktok_url,
          title: videoData.title,
          description: videoData.description,
          hook: analysis.hook,
          script: analysis.script,
          editing_style: analysis.editing_style,
          duration_seconds: videoData.duration,
          cta_type: analysis.cta_type,
          video_theme: analysis.video_theme,
          tone_style: analysis.tone_style,
          visual_elements: analysis.visual_elements,
          audio_style: analysis.audio_style,
          extracted_insights: analysis.insights,
          thumbnail_url: videoData.thumbnail,
          creator_username: videoData.username,
          hashtags: videoData.hashtags,
          tags: tags || [],
          category: category || 'general',
          notes: notes || '',
          engagement_metrics: videoData.stats || null
        })
        .select()
        .single();

      if (saveError) throw saveError;

      return new Response(JSON.stringify({
        success: true,
        reference_video: savedVideo,
        analysis
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'adapt') {
      const { reference_id, adaptation_prompt } = params;
      
      // Get reference video
      const { data: referenceVideo } = await supabase
        .from('reference_videos')
        .select('*')
        .eq('id', reference_id)
        .eq('user_id', user.id)
        .single();

      if (!referenceVideo) {
        throw new Error('Reference video not found');
      }

      // Get user's account context
      const { data: accountContext } = await supabase
        .from('tiktok_account_contexts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Generate adapted content
      const adaptedContent = await generateAdaptedContent(
        referenceVideo,
        adaptation_prompt,
        accountContext
      );

      return new Response(JSON.stringify({
        success: true,
        adapted_content: adaptedContent.adapted_content,
        reference_video: referenceVideo
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else {
      throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in reference-analyzer function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});