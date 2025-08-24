-- Primero, agregar las nuevas columnas necesarias si no existen
ALTER TABLE public.reference_videos 
ADD COLUMN IF NOT EXISTS guion_oral TEXT,
ADD COLUMN IF NOT EXISTS justificacion_tema TEXT;

-- Simplificar la tabla manteniendo solo los campos esenciales y los de la análisis
-- Actualizar los campos existentes para que coincidan con la nueva estructura
UPDATE public.reference_videos SET 
  guion_oral = COALESCE(guion_oral, 'Pendiente de análisis'),
  justificacion_tema = COALESCE(justificacion_tema, 'Pendiente de análisis')
WHERE guion_oral IS NULL OR justificacion_tema IS NULL;

-- Hacer NOT NULL los campos requeridos
ALTER TABLE public.reference_videos 
ALTER COLUMN guion_oral SET NOT NULL,
ALTER COLUMN hook SET DEFAULT 'Pendiente de análisis',
ALTER COLUMN editing_style SET DEFAULT 'Pendiente de análisis', 
ALTER COLUMN cta_type SET DEFAULT 'Pendiente de análisis',
ALTER COLUMN video_theme SET DEFAULT 'Entretener',
ALTER COLUMN justificacion_tema SET NOT NULL;

-- Limpiar campos que ya no necesitamos o renombrar para consistencia
-- Estos campos pueden mantenerse para compatibilidad pero no son esenciales para el análisis principal