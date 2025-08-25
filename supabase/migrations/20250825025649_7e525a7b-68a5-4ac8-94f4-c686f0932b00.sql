-- Agregar campos mejorados a la tabla reference_videos para análisis más completo
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS author_info JSONB DEFAULT '{}';
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS music_info JSONB DEFAULT '{}';
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS visual_analysis JSONB DEFAULT '{}';
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS performance_metrics JSONB DEFAULT '{}';
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS creation_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS viral_score INTEGER DEFAULT 0;
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending';
ALTER TABLE reference_videos ADD COLUMN IF NOT EXISTS error_details TEXT;

-- Crear índices para mejor performance en búsquedas
CREATE INDEX IF NOT EXISTS idx_reference_videos_viral_score ON reference_videos(viral_score DESC);
CREATE INDEX IF NOT EXISTS idx_reference_videos_processing_status ON reference_videos(processing_status);
CREATE INDEX IF NOT EXISTS idx_reference_videos_creation_date ON reference_videos(creation_date DESC);

-- Actualizar el trigger existente para incluir los nuevos campos
CREATE OR REPLACE FUNCTION public.update_reference_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;