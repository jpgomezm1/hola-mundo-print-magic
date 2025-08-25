import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ViralScoreCard } from './ViralScoreCard';
import { useToast } from '@/hooks/useToast';
import { ReferenceVideo, useReferenceVideos } from '@/hooks/useReferenceVideos';
import { 
  Play, 
  Heart, 
  HeartOff, 
  Clock, 
  User, 
  ExternalLink,
  Sparkles,
  Edit,
  Trash2,
  Copy,
  Eye,
  Zap,
  Target,
  BarChart3,
  TrendingUp,
  Maximize2,
  Star,
  Hash,
  Music,
  Camera,
  Palette,
  MessageCircle,
  Share2,
  ThumbsUp,
  Volume2,
  Award,
  Flame,
  Activity
} from 'lucide-react';

interface EnhancedReferenceCardProps {
  video: ReferenceVideo;
  onAdapt?: (adaptedContent: string) => void;
  compact?: boolean;
}

export const EnhancedReferenceCard: React.FC<EnhancedReferenceCardProps> = ({ 
  video, 
  onAdapt,
  compact = false 
}) => {
  const { toast } = useToast();
  const { updateReferenceVideo, deleteReferenceVideo, adaptContent, adapting } = useReferenceVideos();
  const [adaptationPrompt, setAdaptationPrompt] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleFavoriteToggle = async () => {
    try {
      await updateReferenceVideo(video.id, { is_favorite: !video.is_favorite });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleAdaptContent = async () => {
    if (!adaptationPrompt.trim()) {
      toast({
        title: "Error",
        description: "Por favor describe cómo quieres adaptar el contenido",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await adaptContent({
        reference_id: video.id,
        adaptation_prompt: adaptationPrompt
      });
      
      if (onAdapt) {
        onAdapt(result.adapted_content);
      }
      
      setAdaptationPrompt('');
    } catch (error) {
      console.error('Error adapting content:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este video de referencia?')) {
      try {
        await deleteReferenceVideo(video.id);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: `${label} copiado al portapapeles`,
    });
  };

  // Calculate engagement rate for display
  const engagementRate = video.engagement_metrics?.views ? 
    (((video.engagement_metrics.likes || 0) + (video.engagement_metrics.comments || 0) + (video.engagement_metrics.shares || 0)) 
    / video.engagement_metrics.views * 100) : 0;

  return (
    <>
      <Card className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] 
        ${video.is_favorite ? 'ring-2 ring-red-200 bg-gradient-to-br from-red-50/50 to-background' : 'hover:shadow-primary/10'}
        ${compact ? 'h-auto' : 'h-full'}`}>
        
        {/* Favorite Star Indicator */}
        {video.is_favorite && (
          <div className="absolute top-2 left-2 z-10">
            <div className="bg-red-500 text-white p-1 rounded-full animate-pulse">
              <Star className="w-3 h-3 fill-current" />
            </div>
          </div>
        )}

        {/* Hero Thumbnail Section */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          {video.thumbnail_url ? (
            <>
              <img 
                src={video.thumbnail_url} 
                alt="Video thumbnail"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
              <Camera className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}
          
          {/* Overlay Content */}
          <div className="absolute inset-0 p-4 flex flex-col justify-between">
            {/* Top Row - Category & Duration */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-2">
                {video.category && (
                  <Badge className="bg-black/50 text-white border-white/20 backdrop-blur-sm">
                    {video.category}
                  </Badge>
                )}
                {engagementRate > 5 && (
                  <Badge className="bg-green-500/90 text-white flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    Viral
                  </Badge>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                {video.duration_seconds && (
                  <Badge className="bg-black/50 text-white border-white/20 backdrop-blur-sm">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration_seconds}s
                  </Badge>
                )}
              </div>
            </div>

            {/* Bottom Row - Creator & Play Button */}
            <div className="flex items-end justify-between">
              {video.creator_username && (
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">@{video.creator_username}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="lg"
                onClick={() => window.open(video.tiktok_url, '_blank')}
                className="text-white hover:bg-white/20 backdrop-blur-sm rounded-full p-3 opacity-80 hover:opacity-100 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
              </Button>
            </div>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-lg leading-tight line-clamp-2 flex-1">
              {video.title || 'Video sin título'}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-500"
              >
                {video.is_favorite ? (
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                ) : (
                  <HeartOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Hook Section */}
          {video.hook && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-yellow-100 text-yellow-600">
                  <Zap className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold text-muted-foreground">Hook</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(video.hook!, 'Hook')}
                  className="h-6 w-6 p-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 p-3 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm italic line-clamp-2 text-yellow-800 dark:text-yellow-200">
                  "{video.hook}"
                </p>
              </div>
            </div>
          )}

          {/* Viral Score Component */}
          <ViralScoreCard video={video} />

          {/* Quick Stats Grid */}
          {video.engagement_metrics && (
            <div className="grid grid-cols-2 gap-3">
              {video.engagement_metrics.views && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600 font-medium">Views</p>
                    <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                      {(video.engagement_metrics.views / 1000).toFixed(0)}K
                    </p>
                  </div>
                </div>
              )}
              {video.engagement_metrics.likes && (
                <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <ThumbsUp className="w-4 h-4 text-red-600" />
                  <div>
                    <p className="text-xs text-red-600 font-medium">Likes</p>
                    <p className="text-sm font-bold text-red-800 dark:text-red-200">
                      {(video.engagement_metrics.likes / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags Preview */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {video.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  <Hash className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
              {video.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{video.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailModal(true)}
              className="w-full hover:bg-primary/5 transition-colors"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Analizar
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Adaptar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Adaptar Contenido a tu Nicho
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Video de referencia:</p>
                    <p className="font-medium">{video.title}</p>
                    {video.hook && (
                      <p className="text-sm text-muted-foreground mt-1 italic">"{video.hook}"</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="adaptation-prompt" className="text-sm font-medium">
                      ¿Cómo quieres adaptar este video a tu contenido?
                    </label>
                    <Textarea
                      id="adaptation-prompt"
                      placeholder="Ej: Quiero adaptar este hook para mi nicho de fitness, enfocándome en principiantes que quieren perder peso en casa..."
                      value={adaptationPrompt}
                      onChange={(e) => setAdaptationPrompt(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <Button 
                    onClick={handleAdaptContent}
                    disabled={adapting || !adaptationPrompt.trim()}
                    className="w-full"
                  >
                    {adapting ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Adaptando con IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generar Adaptación
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="w-6 h-6 text-primary" />
              Análisis Detallado - {video.title || 'Video de Referencia'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Visual & Basic */}
            <div className="space-y-4">
              {/* Video Preview */}
              {video.thumbnail_url && (
                <div className="aspect-video relative overflow-hidden rounded-lg bg-muted">
                  <img 
                    src={video.thumbnail_url} 
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => window.open(video.tiktok_url, '_blank')}
                    className="absolute inset-0 text-white hover:bg-white/20"
                  >
                    <Play className="w-16 h-16" />
                  </Button>
                </div>
              )}

              {/* Viral Score Analysis */}
              <ViralScoreCard video={video} />

              {/* Creator Info */}
              <Card>
                <CardHeader>
                  <h4 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Información del Creador
                  </h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Author Info */}
                  {video.author_info?.username && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                      {video.author_info.avatar && (
                        <img 
                          src={video.author_info.avatar} 
                          alt="Creator avatar"
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">@{video.author_info.username}</p>
                          {video.author_info.verified && (
                            <Badge className="bg-blue-500 text-white text-xs px-1 py-0">
                              <Star className="w-2 h-2 mr-1" />
                              Verificado
                            </Badge>
                          )}
                        </div>
                        {video.author_info.nickname && (
                          <p className="text-sm text-muted-foreground">{video.author_info.nickname}</p>
                        )}
                        {video.author_info.followers && (
                          <p className="text-xs text-blue-600 font-medium">
                            {(video.author_info.followers / 1000).toFixed(0)}K seguidores
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Duración</p>
                      <p className="font-medium">{video.duration_seconds || 'N/A'}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Categoría</p>
                      <Badge variant="outline" className="text-xs">{video.category || 'General'}</Badge>
                    </div>
                  </div>

                  {/* Music Info */}
                  {video.music_info?.title && (
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Music className="w-4 h-4 text-purple-600" />
                        <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Música</p>
                      </div>
                      <p className="text-sm font-semibold">{video.music_info.title}</p>
                      {video.music_info.author && (
                        <p className="text-xs text-muted-foreground">por {video.music_info.author}</p>
                      )}
                    </div>
                  )}

                  {/* Performance Metrics Summary */}
                  {video.performance_metrics?.engagement_rate && (
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800 dark:text-green-200">Engagement Rate</span>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {video.performance_metrics.engagement_rate.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(video.tiktok_url, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver en TikTok
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Analysis */}
            <div className="space-y-4">
              {/* Hook Analysis */}
              {video.hook && (
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Análisis del Hook
                    </h4>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                      <p className="italic text-sm">"{video.hook}"</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(video.hook!, 'Hook')}
                      className="w-full mt-3"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Hook
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Content Analysis */}
              <Card>
                <CardHeader>
                  <h4 className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    Análisis de Contenido
                  </h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Tema</p>
                      <Badge variant="secondary">{video.video_theme || 'General'}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tono</p>
                      <Badge variant="outline">{video.tone_style || 'Neutral'}</Badge>
                    </div>
                  </div>
                  {video.script && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Script/Guión</p>
                      <div className="bg-muted/50 p-3 rounded-lg max-h-32 overflow-y-auto">
                        <p className="text-sm">{video.script}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              {video.engagement_metrics && (
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-green-500" />
                      Métricas de Engagement
                    </h4>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    {video.engagement_metrics.views && (
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Eye className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-blue-800 dark:text-blue-200">
                          {video.engagement_metrics.views.toLocaleString()}
                        </p>
                        <p className="text-xs text-blue-600">Views</p>
                      </div>
                    )}
                    {video.engagement_metrics.likes && (
                      <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <ThumbsUp className="w-6 h-6 text-red-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-red-800 dark:text-red-200">
                          {video.engagement_metrics.likes.toLocaleString()}
                        </p>
                        <p className="text-xs text-red-600">Likes</p>
                      </div>
                    )}
                    {video.engagement_metrics.comments && (
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-green-800 dark:text-green-200">
                          {video.engagement_metrics.comments.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600">Comentarios</p>
                      </div>
                    )}
                    {video.engagement_metrics.shares && (
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Share2 className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <p className="text-xl font-bold text-purple-800 dark:text-purple-200">
                          {video.engagement_metrics.shares.toLocaleString()}
                        </p>
                        <p className="text-xs text-purple-600">Shares</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tags & Insights */}
              {(video.tags?.length || video.extracted_insights?.viral_factors?.length) && (
                <Card>
                  <CardHeader>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Hash className="w-4 h-4 text-purple-500" />
                      Tags e Insights
                    </h4>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {video.tags && video.tags.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Tags</p>
                        <div className="flex flex-wrap gap-1">
                          {video.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {video.extracted_insights?.viral_factors && video.extracted_insights.viral_factors.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Factores Virales</p>
                        <div className="flex flex-wrap gap-1">
                          {video.extracted_insights.viral_factors.map((factor, index) => (
                            <Badge key={index} variant="default" className="text-xs">
                              <Star className="w-2 h-2 mr-1" />
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};