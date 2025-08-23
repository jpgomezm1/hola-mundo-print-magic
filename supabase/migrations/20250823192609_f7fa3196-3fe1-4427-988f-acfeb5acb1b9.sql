-- Create table for reference videos
CREATE TABLE public.reference_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tiktok_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  hook TEXT,
  script TEXT,
  editing_style TEXT,
  duration_seconds INTEGER,
  cta_type TEXT,
  video_theme TEXT,
  tone_style TEXT,
  visual_elements TEXT[],
  audio_style TEXT,
  hashtags TEXT[],
  engagement_metrics JSONB,
  extracted_insights JSONB,
  thumbnail_url TEXT,
  creator_username TEXT,
  tags TEXT[],
  category TEXT,
  notes TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reference_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own reference videos" 
ON public.reference_videos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reference videos" 
ON public.reference_videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reference videos" 
ON public.reference_videos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reference videos" 
ON public.reference_videos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_reference_videos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reference_videos_updated_at
BEFORE UPDATE ON public.reference_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_reference_videos_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_reference_videos_user_id ON public.reference_videos(user_id);
CREATE INDEX idx_reference_videos_tags ON public.reference_videos USING GIN(tags);
CREATE INDEX idx_reference_videos_category ON public.reference_videos(category);
CREATE INDEX idx_reference_videos_created_at ON public.reference_videos(created_at DESC);