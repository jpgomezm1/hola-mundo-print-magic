-- Fix the database schema to align with the working version
-- Make critical fields nullable and provide defaults

ALTER TABLE public.reference_videos 
ALTER COLUMN guion_oral DROP NOT NULL,
ALTER COLUMN justificacion_tema DROP NOT NULL;

-- Add defaults for these fields
ALTER TABLE public.reference_videos 
ALTER COLUMN guion_oral SET DEFAULT 'Pendiente de análisis',
ALTER COLUMN justificacion_tema SET DEFAULT 'Pendiente de análisis';

-- Also add a cta field that might be missing
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reference_videos' AND column_name='cta') THEN
        ALTER TABLE public.reference_videos ADD COLUMN cta text DEFAULT 'Pendiente de análisis';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reference_videos' AND column_name='estilo_edicion') THEN
        ALTER TABLE public.reference_videos ADD COLUMN estilo_edicion text DEFAULT 'Pendiente de análisis';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='reference_videos' AND column_name='tema_principal') THEN
        ALTER TABLE public.reference_videos ADD COLUMN tema_principal text DEFAULT 'Entretener';
    END IF;
END $$;