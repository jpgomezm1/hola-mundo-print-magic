import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

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

// Analyze video content using OpenAI
async function analyzeVideoContent(
  videoData: TikTokVideoData, 
  accountContext?: any
): Promise<AnalyzedVideo> {
  console.log('Analyzing video content with AI');
  
  const systemPrompt = `Eres un experto analizador de videos virales de TikTok. Tu trabajo es extraer información detallada de videos para crear contenido similar.

Contexto de la cuenta del usuario:
- Misión: ${accountContext?.mission || 'No definida'}
- Temas de contenido: ${accountContext?.content_themes?.join(', ') || 'Generales'}
- Tono: ${accountContext?.tone_guide || 'Profesional pero accesible'}

Analiza el siguiente video de TikTok y extrae:

1. HOOK: Las primeras palabras/frase que captura atención (primeros 3-5 segundos)
2. SCRIPT: El guión completo o narrativa del video
3. EDITING_STYLE: Estilo de edición (rápido, lento, transiciones, efectos)
4. CTA_TYPE: Tipo de llamada a la acción (save, share, comment, follow)
5. VIDEO_THEME: Tema principal del contenido
6. TONE_STYLE: Tono emocional (divertido, educativo, motivacional, etc.)
7. VISUAL_ELEMENTS: Elementos visuales clave (texto, gráficos, colores)
8. AUDIO_STYLE: Estilo de audio (música, voz en off, sonidos)

Responde SOLO con un JSON válido en este formato:
{
  "hook": "Frase exacta del hook",
  "script": "Guión completo del video",
  "editing_style": "Descripción del estilo de edición",
  "cta_type": "Tipo de CTA identificado",
  "video_theme": "Tema principal",
  "tone_style": "Tono emocional",
  "visual_elements": ["elemento1", "elemento2"],
  "audio_style": "Descripción del audio",
  "insights": {
    "viral_factors": ["factor1", "factor2"],
    "target_audience": "Audiencia objetivo",
    "replication_tips": ["tip1", "tip2"]
  }
}`;

  const userMessage = `Analiza este video de TikTok:
URL: ${videoData.url}
Título: ${videoData.title}
Descripción: ${videoData.description}
Usuario: @${videoData.username}
Duración: ${videoData.duration}s
Hashtags: ${videoData.hashtags?.join(', ')}

Extrae toda la información solicitada para poder replicar el éxito de este video.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 2000,
        temperature: 0.3
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      const parsed = JSON.parse(aiResponse);
      return parsed;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Return default structure if parsing fails
      return {
        hook: "Hook to be analyzed",
        script: "Script to be extracted",
        editing_style: "Standard editing",
        cta_type: "engagement",
        video_theme: "General content",
        tone_style: "Neutral",
        visual_elements: ["Basic visuals"],
        audio_style: "Standard audio",
        insights: {
          viral_factors: ["Engagement"],
          target_audience: "General audience",
          replication_tips: ["Focus on engagement"]
        }
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// Generate adapted content based on reference
async function generateAdaptedContent(
  referenceData: any,
  userPrompt: string,
  accountContext?: any
): Promise<{ adapted_content: string }> {
  console.log('Generating adapted content');

  const systemPrompt = `Eres un creador experto de contenido para TikTok. Tu trabajo es adaptar videos exitosos al contexto específico del usuario.

Contexto de la cuenta del usuario:
- Misión: ${accountContext?.mission || 'No definida'}
- Temas de contenido: ${accountContext?.content_themes?.join(', ') || 'Generales'}
- Tono: ${accountContext?.tone_guide || 'Profesional pero accesible'}
- NO hacer: ${accountContext?.do_not_do?.join(', ') || 'Nada específico'}

Video de referencia analizado:
- Hook original: ${referenceData.hook}
- Script original: ${referenceData.script}
- Estilo de edición: ${referenceData.editing_style}
- Tema: ${referenceData.video_theme}
- Tono: ${referenceData.tone_style}
- Elementos virales: ${referenceData.insights?.viral_factors?.join(', ')}

Adapta este contenido exitoso manteniendo los elementos virales pero cambiando el contexto para que sea relevante para la cuenta del usuario.

Responde con un JSON válido:
{
  "adapted_content": "Contenido adaptado completo con hook, script y recomendaciones"
}`;

  const userMessage = `Adaptación solicitada: ${userPrompt}

Mantén la estructura viral del video original pero adáptalo a mi nicho y contexto. Incluye:
1. Hook adaptado
2. Script completo adaptado
3. Recomendaciones de implementación
4. Elementos clave a conservar del original`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 1500,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      return JSON.parse(aiResponse);
    } catch (parseError) {
      return {
        adapted_content: aiResponse
      };
    }
  } catch (error) {
    console.error('Error generating adapted content:', error);
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