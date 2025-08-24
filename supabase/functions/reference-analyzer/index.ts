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

// Enhanced TikTok metadata extraction with multiple methods
async function extractTikTokMetadata(url: string): Promise<TikTokVideoData> {
  console.log('Extracting metadata from TikTok URL:', url);
  
  try {
    const videoId = url.match(/@[\w.]+\/video\/(\d+)/)?.[1] || 
                   url.match(/tiktok\.com\/.*\/(\d+)/)?.[1] ||
                   'unknown';
    
    const username = url.match(/@([\w.]+)\//)?.[1] || 'unknown';
    
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

    // Method 1: Try to extract from TikTok oEmbed API
    try {
      console.log('Trying TikTok oEmbed API...');
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const oembedResponse = await fetch(oembedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (oembedResponse.ok) {
        const oembedData = await oembedResponse.json();
        console.log('oEmbed data extracted successfully');
        
        if (oembedData.title) metadata.title = oembedData.title;
        if (oembedData.author_name) metadata.username = oembedData.author_name;
        if (oembedData.thumbnail_url) metadata.thumbnail = oembedData.thumbnail_url;
        
        // Extract description from HTML if available
        if (oembedData.html) {
          const descMatch = oembedData.html.match(/data-video-description="([^"]+)"/);
          if (descMatch) metadata.description = descMatch[1];
        }
      }
    } catch (e) {
      console.log('oEmbed method failed:', e.message);
    }

    // Method 2: Try scraping with different approach
    try {
      console.log('Trying direct page scraping...');
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const html = await response.text();
        console.log('Page HTML fetched successfully');
        
        // Extract structured data
        const scriptMatches = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json"[^>]*>([^<]+)<\/script>/);
        if (scriptMatches) {
          try {
            const jsonData = JSON.parse(scriptMatches[1]);
            const itemInfo = jsonData?.['__DEFAULT_SCOPE__']?.['webapp.video-detail']?.itemInfo?.itemStruct;
            
            if (itemInfo) {
              console.log('Structured data found in page');
              
              if (itemInfo.desc) metadata.description = itemInfo.desc;
              if (itemInfo.video?.duration) metadata.duration = Math.round(itemInfo.video.duration);
              if (itemInfo.video?.cover) metadata.thumbnail = itemInfo.video.cover;
              
              // Extract stats
              if (itemInfo.stats) {
                metadata.stats = {
                  views: itemInfo.stats.playCount || 0,
                  likes: itemInfo.stats.diggCount || 0,
                  shares: itemInfo.stats.shareCount || 0,
                  comments: itemInfo.stats.commentCount || 0
                };
              }
              
              // Extract author info
              if (itemInfo.author) {
                metadata.author = {
                  username: itemInfo.author.uniqueId || username,
                  nickname: itemInfo.author.nickname,
                  verified: itemInfo.author.verified || false,
                  followers: itemInfo.author.followerCount,
                  avatar: itemInfo.author.avatarMedium
                };
              }
              
              // Extract music info
              if (itemInfo.music) {
                metadata.musicMeta = {
                  title: itemInfo.music.title,
                  author: itemInfo.music.authorName,
                  playUrl: itemInfo.music.playUrl
                };
              }
              
              // Extract hashtags from challenges
              if (itemInfo.challenges) {
                metadata.hashtags = itemInfo.challenges.map((c: any) => `#${c.title}`);
              }
              
              // If no hashtags from challenges, extract from description
              if (!metadata.hashtags?.length && metadata.description) {
                const hashtagMatches = metadata.description.match(/#[\w]+/g);
                if (hashtagMatches) {
                  metadata.hashtags = hashtagMatches;
                }
              }
            }
          } catch (parseError) {
            console.log('Failed to parse structured data:', parseError.message);
          }
        }
        
        // Fallback: Extract from meta tags
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
        if (titleMatch && !metadata.title.includes('Video')) {
          metadata.title = titleMatch[1].replace(' | TikTok', '').trim();
        }
        
        const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/);
        if (descriptionMatch && metadata.description === 'Video content') {
          metadata.description = descriptionMatch[1];
        }
        
        const imageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
        if (imageMatch && !metadata.thumbnail) {
          metadata.thumbnail = imageMatch[1];
        }
      }
    } catch (fetchError) {
      console.log('Direct scraping failed:', fetchError.message);
    }

    // Ensure we have at least basic data
    if (!metadata.hashtags) metadata.hashtags = [];
    if (!metadata.description || metadata.description === 'Video content') {
      metadata.description = `TikTok video by @${metadata.username}`;
    }
    
    console.log('Final metadata extracted:', {
      title: metadata.title,
      description: metadata.description,
      stats: metadata.stats,
      duration: metadata.duration,
      hashtags: metadata.hashtags?.length || 0
    });

    return metadata;
  } catch (error) {
    console.error('Error extracting TikTok metadata:', error);
    throw new Error('Failed to extract video metadata');
  }
}

// Simplified video analysis using Gemini with text-based approach
async function analyzeVideoContent(
  videoData: TikTokVideoData, 
  accountContext?: any
): Promise<AnalyzedVideo> {
  console.log('Analyzing video content with Gemini AI');
  
  const prompt = `Eres un experto analizador de contenido viral de TikTok con más de 10 años de experiencia. Analiza este video de TikTok basándote en la información disponible y proporciona un análisis detallado.

INFORMACIÓN DEL VIDEO:
- URL: ${videoData.url}
- Título: ${videoData.title}
- Descripción: ${videoData.description}
- Creador: @${videoData.username}
- Duración: ${videoData.duration} segundos
- Hashtags: ${videoData.hashtags?.join(', ') || 'No disponibles'}
- Views: ${videoData.stats?.views?.toLocaleString() || 'No disponible'}
- Likes: ${videoData.stats?.likes?.toLocaleString() || 'No disponible'}
- Comentarios: ${videoData.stats?.comments?.toLocaleString() || 'No disponible'}
- Shares: ${videoData.stats?.shares?.toLocaleString() || 'No disponible'}
- Música: ${videoData.musicMeta?.title || 'No disponible'} - ${videoData.musicMeta?.author || ''}

CONTEXTO DE LA CUENTA DEL USUARIO:
- Misión: ${accountContext?.mission || 'No definida'}
- Temas de contenido: ${accountContext?.content_themes?.join(', ') || 'Generales'}
- Tono: ${accountContext?.tone_guide || 'Profesional pero accesible'}

INSTRUCCIONES:
Basándote en el título, descripción, hashtags, métricas y contexto, proporciona un análisis completo en formato JSON.

Responde ÚNICAMENTE con un JSON válido:`;

  const userMessage = `{
  "guion_oral": "Basándote en la descripción y título, infiere el guión oral probable del video",
  "hook": "Analiza el título y descripción para identificar la técnica de hook utilizada",
  "cta": "Identifica el tipo de call to action basándote en los hashtags y descripción",
  "estilo_edicion": "Infiere el estilo de edición basándote en las métricas, hashtags y tipo de contenido",
  "tema_principal": "Clasifica en: Entretener, Identificar, Activar, o Educar",
  "justificacion_tema": "Explica por qué clasificaste así basándote en la evidencia disponible",
  "elementos_virales": ["Lista de elementos que hacen viral este contenido"],
  "audiencia_objetivo": "Describe la audiencia objetivo basándote en el contenido y creador",
  "tips_replicacion": ["Consejos específicos para replicar el éxito de este video"],
  "score_viral": "Puntaje de 1-10 del potencial viral basándote en las métricas",
  "analisis_metricas": "Análisis de las métricas de engagement y qué las impulsa"
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${prompt}\n\n${userMessage}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response received successfully');
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      // Clean the response
      let cleanResponse = aiResponse.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.slice(7, -3);
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.slice(3, -3);
      }
      
      const parsed = JSON.parse(cleanResponse);
      console.log('Successfully parsed Gemini response');
      
      // Transform to expected format
      return {
        hook: parsed.hook || "Hook analizado por Gemini",
        script: parsed.guion_oral || "Guión inferido por análisis",
        editing_style: parsed.estilo_edicion || "Estilo estándar",
        cta_type: parsed.cta || "engagement",
        video_theme: parsed.tema_principal || "contenido general",
        tone_style: parsed.justificacion_tema || "neutral",
        visual_elements: parsed.elementos_virales || ["elementos básicos"],
        audio_style: `Música: ${videoData.musicMeta?.title || 'No disponible'}`,
        insights: {
          viral_factors: parsed.elementos_virales || ["engagement"],
          target_audience: parsed.audiencia_objetivo || "audiencia general",
          replication_tips: parsed.tips_replicacion || ["seguir mejores prácticas"],
          viral_score: parsed.score_viral || 5,
          metrics_analysis: parsed.analisis_metricas || "Análisis basado en datos disponibles",
          detailed_analysis: parsed
        }
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', aiResponse);
      
      // Return fallback analysis
      return {
        hook: "Hook extraído de título y descripción",
        script: videoData.description || "Contenido basado en metadatos",
        editing_style: "Estilo inferido de métricas",
        cta_type: "engagement",
        video_theme: "contenido general",
        tone_style: "neutral",
        visual_elements: videoData.hashtags || ["elementos básicos"],
        audio_style: `Música: ${videoData.musicMeta?.title || 'estándar'}`,
        insights: {
          viral_factors: ["engagement"],
          target_audience: "audiencia general",
          replication_tips: ["analizar métricas disponibles"],
          parse_error: "Error en parsing de respuesta",
          raw_response: aiResponse.substring(0, 500) // Truncate for safety
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