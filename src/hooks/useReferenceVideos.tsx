import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/useToast';

export interface ReferenceVideo {
  id: string;
  user_id: string;
  tiktok_url: string;
  storage_path?: string;
  title?: string;
  description?: string;
  hook?: string;
  script?: string;
  guion_oral?: string;
  editing_style?: string;
  duration_seconds?: number;
  cta_type?: string;
  video_theme?: 'Entretener' | 'Identificar' | 'Activar' | 'Educar';
  tone_style?: string;
  visual_elements?: string[];
  audio_style?: string;
  hashtags?: string[];
  extracted_insights?: any;
  thumbnail_url?: string;
  creator_username?: string;
  tags?: string[];
  tags_ai?: string[];
  tam_ai?: 'Educativo' | 'Entretenimiento' | 'Ventas' | 'Tutorial' | 'Storytelling' | 'Producto';
  justificacion_tema?: string;
  category?: string;
  notes?: string;
  is_favorite: boolean;
  engagement_metrics?: any;
  metrics_views?: number;
  metrics_likes?: number;
  metrics_comments?: number;
  metrics_shares?: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyzeVideoParams {
  url?: string;
  storage_path?: string;
  video_id?: string;
}

export interface AdaptContentParams {
  reference_id: string;
  adaptation_prompt: string;
}

export const useReferenceVideos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referenceVideos, setReferenceVideos] = useState<ReferenceVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [adapting, setAdapting] = useState(false);

  // Fetch reference videos
  const fetchReferenceVideos = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reference_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferenceVideos((data || []) as ReferenceVideo[]);
    } catch (error) {
      console.error('Error fetching reference videos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los videos de referencia",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Analyze a TikTok video using the new reference-analyzer edge function
  const analyzeVideo = async (params: AnalyzeVideoParams) => {
    if (!user) throw new Error('User not authenticated');

    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('reference-analyzer', {
        body: {
          ...params,
          video_id: params.video_id || `video_${Date.now()}`
        }
      });

      if (error) throw error;

      if (data) {
        await fetchReferenceVideos(); // Refresh the list
        toast({
          title: "¡Video analizado!",
          description: "El video se ha analizado y guardado exitosamente",
        });
        return data;
      } else {
        throw new Error('Failed to analyze video');
      }
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast({
        title: "Error",
        description: "No se pudo analizar el video. Verifica la URL e intenta de nuevo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setAnalyzing(false);
    }
  };

  // Generate adapted content
  const adaptContent = async (params: AdaptContentParams) => {
    if (!user) throw new Error('User not authenticated');

    setAdapting(true);
    try {
      const { data, error } = await supabase.functions.invoke('reference-analyzer', {
        body: {
          action: 'adapt',
          ...params
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "¡Contenido adaptado!",
          description: "Se ha generado el contenido adaptado a tu nicho",
        });
        return {
          adapted_content: data.adapted_content,
          reference_video: data.reference_video
        };
      } else {
        throw new Error(data.error || 'Failed to adapt content');
      }
    } catch (error) {
      console.error('Error adapting content:', error);
      toast({
        title: "Error",
        description: "No se pudo adaptar el contenido. Intenta de nuevo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setAdapting(false);
    }
  };

  // Update reference video
  const updateReferenceVideo = async (id: string, updates: Partial<ReferenceVideo>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('reference_videos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchReferenceVideos(); // Refresh the list
      toast({
        title: "Video actualizado",
        description: "Los cambios se han guardado exitosamente",
      });
    } catch (error) {
      console.error('Error updating reference video:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el video",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Delete reference video
  const deleteReferenceVideo = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('reference_videos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchReferenceVideos(); // Refresh the list
      toast({
        title: "Video eliminado",
        description: "El video de referencia se ha eliminado",
      });
    } catch (error) {
      console.error('Error deleting reference video:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el video",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Filter and search functions
  const filterByCategory = (category: string) => {
    return referenceVideos.filter(video => video.category === category);
  };

  const filterByTags = (tags: string[]) => {
    return referenceVideos.filter(video => 
      video.tags?.some(tag => tags.includes(tag))
    );
  };

  const searchVideos = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return referenceVideos.filter(video => 
      video.title?.toLowerCase().includes(lowercaseQuery) ||
      video.description?.toLowerCase().includes(lowercaseQuery) ||
      video.hook?.toLowerCase().includes(lowercaseQuery) ||
      video.script?.toLowerCase().includes(lowercaseQuery) ||
      video.guion_oral?.toLowerCase().includes(lowercaseQuery) ||
      video.video_theme?.toLowerCase().includes(lowercaseQuery) ||
      video.creator_username?.toLowerCase().includes(lowercaseQuery) ||
      video.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      video.tags_ai?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      video.tam_ai?.toLowerCase().includes(lowercaseQuery) ||
      video.notes?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getFavorites = () => {
    return referenceVideos.filter(video => video.is_favorite);
  };

  const getCategories = () => {
    const categories = new Set(referenceVideos.map(video => video.category).filter(Boolean));
    return Array.from(categories);
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    referenceVideos.forEach(video => {
      video.tags?.forEach(tag => tags.add(tag));
      video.tags_ai?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  useEffect(() => {
    fetchReferenceVideos();
  }, [user]);

  return {
    referenceVideos,
    loading,
    analyzing,
    adapting,
    analyzeVideo,
    adaptContent,
    updateReferenceVideo,
    deleteReferenceVideo,
    filterByCategory,
    filterByTags,
    searchVideos,
    getFavorites,
    getCategories,
    getAllTags,
    refetch: fetchReferenceVideos
  };
};