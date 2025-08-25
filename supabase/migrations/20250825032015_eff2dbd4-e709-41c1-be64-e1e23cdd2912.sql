-- Create storage bucket for temporary video files
INSERT INTO storage.buckets (id, name, public)
VALUES ('temp-videos', 'temp-videos', false);

-- Create RLS policies for temp-videos bucket
CREATE POLICY "Users can upload temp videos"
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'temp-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their temp videos"
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'temp-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their temp videos"
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'temp-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to clean up old temp videos (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_temp_videos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'temp-videos' 
  AND created_at < NOW() - INTERVAL '1 hour';
END;
$$;