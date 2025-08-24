-- Update reference_videos table with standardized schema for AI analysis
-- First, add new columns if they don't exist

-- Guion and analysis fields
ALTER TABLE public.reference_videos 
ADD COLUMN IF NOT EXISTS guion_oral text,
ADD COLUMN IF NOT EXISTS justificacion_tema text,
ADD COLUMN IF NOT EXISTS tam_ai text,
ADD COLUMN IF NOT EXISTS tags_ai jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS storage_path text;

-- Metrics fields (separate columns for better querying)
ALTER TABLE public.reference_videos 
ADD COLUMN IF NOT EXISTS metrics_views bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS metrics_likes bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS metrics_comments bigint DEFAULT 0,
ADD COLUMN IF NOT EXISTS metrics_shares bigint DEFAULT 0;

-- Add constraints for tema_principal if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reference_videos_tema_principal_check' 
        AND table_name = 'reference_videos'
    ) THEN
        ALTER TABLE public.reference_videos 
        ADD CONSTRAINT reference_videos_tema_principal_check 
        CHECK (video_theme IN ('Entretener', 'Identificar', 'Activar', 'Educar'));
    END IF;
END $$;

-- Add constraints for tam_ai
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'reference_videos_tam_ai_check' 
        AND table_name = 'reference_videos'
    ) THEN
        ALTER TABLE public.reference_videos 
        ADD CONSTRAINT reference_videos_tam_ai_check 
        CHECK (tam_ai IN ('Educativo', 'Entretenimiento', 'Ventas', 'Tutorial', 'Storytelling', 'Producto'));
    END IF;
END $$;

-- Create index for performance on new fields
CREATE INDEX IF NOT EXISTS idx_reference_videos_tema_principal ON public.reference_videos(video_theme);
CREATE INDEX IF NOT EXISTS idx_reference_videos_tam_ai ON public.reference_videos(tam_ai);
CREATE INDEX IF NOT EXISTS idx_reference_videos_metrics_views ON public.reference_videos(metrics_views);

-- Add trigger for updated_at
CREATE TRIGGER update_reference_videos_updated_at
    BEFORE UPDATE ON public.reference_videos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_reference_videos_updated_at();