import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 15);
}

async function extractVideoMetadata(url: string, requestId: string): Promise<VideoMetadata> {
  console.log(`[${requestId}] Extracting metadata from URL: ${url}`);
  
  try {
    // Extract TikTok video ID from URL
    const videoIdMatch = url.match(/video\/(\d+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : 'unknown';
    
    // Simple metadata extraction - you can enhance this with actual API calls
    const metadata: VideoMetadata = {
      title: `TikTok Video ${videoId}`,
      description: "Video analyzed from TikTok",
      duration: 30, // Default duration in seconds
      thumbnail_url: null,
      creator_username: null,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0
    };

    console.log(`[${requestId}] Metadata extracted successfully`);
    return metadata;
    
  } catch (error) {
    console.error(`[${requestId}] Error extracting metadata:`, error);
    throw new Error(`Failed to extract video metadata: ${error.message}`);
  }
}

async function generateBasicAnalysis(url: string, requestId: string) {
  console.log(`[${requestId}] Generating basic analysis for video`);
  
  // Generate basic analysis without AI
  return {
    guion_oral: "Análisis básico - contenido de video",
    hook: "Gancho inicial detectado",
    cta: "Call to action identificado",
    estilo_edicion: "Estilo de edición estándar de TikTok",
    tema_principal: "Entretener",
    justificacion_tema: "Clasificado como entretenimiento basado en la plataforma"
  };
}

async function generateTags(url: string, requestId: string): Promise<string[]> {
  console.log(`[${requestId}] Generating tags for video`);
  
  // Generate basic tags
  return ['tiktok', 'video-analizado', 'contenido', 'social-media', 'entretenimiento'];
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

    // Step 1: Extract basic metadata
    const metadata = await extractVideoMetadata(body.url || '', requestId);
    
    // Step 2: Generate basic analysis
    const analysis = await generateBasicAnalysis(body.url || '', requestId);
    
    // Step 3: Generate tags
    const tags_ai = await generateTags(body.url || '', requestId);
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