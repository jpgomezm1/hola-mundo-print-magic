import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';
import { ReferenceVideo, useReferenceVideos } from '@/hooks/useReferenceVideos';
import { 
  Play, 
  Heart, 
  HeartOff, 
  Clock, 
  User, 
  Tag, 
  ExternalLink,
  Sparkles,
  Edit,
  Trash2,
  Copy,
  Eye,
  FileText,
  Zap,
  Palette,
  Volume2,
  Camera,
  Target,
  BarChart3,
  Hash,
  MessageCircle,
  Maximize2,
  Music,
  Layers,
  TrendingUp,
  Users,
  Share2,
  ThumbsUp
} from 'lucide-react';

interface ReferenceVideoCardProps {
  video: ReferenceVideo;
  onAdapt?: (adaptedContent: string) => void;
}

export const ReferenceVideoCard: React.FC<ReferenceVideoCardProps> = ({ 
  video, 
  onAdapt 
}) => {
  const { toast } = useToast();
  const { updateReferenceVideo, deleteReferenceVideo, adaptContent, adapting } = useReferenceVideos();
  const [adaptationPrompt, setAdaptationPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editedNotes, setEditedNotes] = useState(video.notes || '');
  const [editedTags, setEditedTags] = useState(video.tags?.join(', ') || '');

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

  const handleSaveEdit = async () => {
    try {
      const tags = editedTags.split(',').map(tag => tag.trim()).filter(Boolean);
      await updateReferenceVideo(video.id, { 
        notes: editedNotes,
        tags 
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving edits:', error);
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

  const formatEngagementMetrics = (metrics: any) => {
    if (!metrics) return null;
    return (
      <div className="grid grid-cols-2 gap-3">
        {metrics.views && (
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{metrics.views.toLocaleString()} views</span>
          </div>
        )}
        {metrics.likes && (
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-red-500" />
            <span className="text-sm">{metrics.likes.toLocaleString()}</span>
          </div>
        )}
        {metrics.comments && (
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">{metrics.comments.toLocaleString()}</span>
          </div>
        )}
        {metrics.shares && (
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-purple-500" />
            <span className="text-sm">{metrics.shares.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-primary/30 hover:scale-[1.02] overflow-hidden">
        {/* Thumbnail Hero Section */}
        {video.thumbnail_url && (
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={video.thumbnail_url} 
              alt="Video thumbnail"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              {video.is_favorite && (
                <Badge className="bg-red-500/90 text-white">
                  <Heart className="w-3 h-3 mr-1 fill-current" />
                  Favorito
                </Badge>
              )}
              {video.category && (
                <Badge className="bg-primary/90 text-white">
                  {video.category}
                </Badge>
              )}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  {video.creator_username && (
                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full text-sm">
                      <User className="w-3 h-3" />
                      @{video.creator_username}
                    </div>
                  )}
                  {video.duration_seconds && (
                    <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full text-sm">
                      <Clock className="w-3 h-3" />
                      {video.duration_seconds}s
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(video.tiktok_url, '_blank')}
                  className="text-white hover:bg-white/20"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg leading-tight line-clamp-2">
              {video.title || 'Video sin título'}
            </CardTitle>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavoriteToggle}
                className="h-8 w-8 p-0"
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
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {video.tags?.slice(0, 4).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {video.tags && video.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{video.tags.length - 4}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Hook Preview */}
          {video.hook && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <Label className="text-sm font-semibold">Hook</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(video.hook!, 'Hook')}
                  className="h-6 w-6 p-0 ml-auto"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg border-l-4 border-yellow-400 line-clamp-2 italic">
                "{video.hook}"
              </p>
            </div>
          )}

          {/* Quick Insights */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {video.video_theme && (
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span className="text-muted-foreground">Tema:</span>
                <Badge variant="secondary" className="text-xs">{video.video_theme}</Badge>
              </div>
            )}
            {video.tone_style && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span className="text-muted-foreground">Tono:</span>
                <Badge variant="outline" className="text-xs">{video.tone_style}</Badge>
              </div>
            )}
          </div>

          {/* Engagement Metrics Preview */}
          {video.engagement_metrics && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-500" />
                <Label className="text-sm font-semibold">Métricas</Label>
              </div>
              {formatEngagementMetrics(video.engagement_metrics)}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetailModal(true)}
              className="w-full"
            >
              <Maximize2 className="w-4 h-4 mr-2" />
              Ver Detalles
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Adaptar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Adaptar Contenido a tu Nicho</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="adaptation-prompt">
                      ¿Cómo quieres adaptar este video a tu contenido?
                    </Label>
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
                        Adaptando...
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

          {/* Edit Dialog */}
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Video de Referencia</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-notes">Notas</Label>
                  <Textarea
                    id="edit-notes"
                    value={editedNotes}
                    onChange={(e) => setEditedNotes(e.target.value)}
                    placeholder="Añade notas sobre este video..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tags">Tags (separados por comas)</Label>
                  <Input
                    id="edit-tags"
                    value={editedTags}
                    onChange={(e) => setEditedTags(e.target.value)}
                    placeholder="viral, educativo, hook fuerte..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} className="flex-1">
                    Guardar Cambios
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Detailed Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Play className="w-6 h-6 text-primary" />
              {video.title || 'Video de Referencia'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Media & Basic Info */}
            <div className="space-y-4">
              {/* Video Thumbnail */}
              {video.thumbnail_url && (
                <div className="aspect-video relative overflow-hidden rounded-lg">
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
                    <Play className="w-12 h-12" />
                  </Button>
                </div>
              )}

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Básica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {video.creator_username && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">@{video.creator_username}</span>
                    </div>
                  )}
                  {video.duration_seconds && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{video.duration_seconds} segundos</span>
                    </div>
                  )}
                  {video.category && (
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <Badge>{video.category}</Badge>
                    </div>
                  )}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={() => window.open(video.tiktok_url, '_blank')}
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver en TikTok
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Metrics */}
              {video.engagement_metrics && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Métricas de Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formatEngagementMetrics(video.engagement_metrics)}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Middle & Right Columns - Detailed Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="script">Guión</TabsTrigger>
                  <TabsTrigger value="analysis">Análisis</TabsTrigger>
                  <TabsTrigger value="elements">Elementos</TabsTrigger>
                  <TabsTrigger value="notes">Notas</TabsTrigger>
                </TabsList>

                <TabsContent value="script" className="space-y-4">
                  {/* Hook */}
                  {video.hook && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          Hook
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(video.hook!, 'Hook')}
                            className="ml-auto"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                          <p className="text-lg italic font-medium">"{video.hook}"</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Full Script */}
                  {video.script && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-500" />
                          Guión Completo
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(video.script!, 'Guión completo')}
                            className="ml-auto"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                            {video.script}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Description */}
                  {video.description && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Descripción</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-4">
                  {video.extracted_insights && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-green-500" />
                          Insights Extraídos por IA
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {typeof video.extracted_insights === 'object' ? (
                            Object.entries(video.extracted_insights).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <Label className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</Label>
                                <p className="text-sm bg-muted/30 p-2 rounded">{String(value)}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm">{video.extracted_insights}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Content Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {video.video_theme && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            Tema del Video
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="text-sm">{video.video_theme}</Badge>
                        </CardContent>
                      </Card>
                    )}

                    {video.tone_style && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Estilo de Tono
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="outline" className="text-sm">{video.tone_style}</Badge>
                        </CardContent>
                      </Card>
                    )}

                    {video.cta_type && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Tipo de CTA
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge className="text-sm">{video.cta_type}</Badge>
                        </CardContent>
                      </Card>
                    )}

                    {video.editing_style && (
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Estilo de Edición
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Badge variant="secondary" className="text-sm">{video.editing_style}</Badge>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="elements" className="space-y-4">
                  {/* Audio Style */}
                  {video.audio_style && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Volume2 className="w-5 h-5 text-purple-500" />
                          Estilo de Audio
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="outline">{video.audio_style}</Badge>
                      </CardContent>
                    </Card>
                  )}

                  {/* Visual Elements */}
                  {video.visual_elements && video.visual_elements.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Layers className="w-5 h-5 text-blue-500" />
                          Elementos Visuales
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {video.visual_elements.map((element, index) => (
                            <Badge key={index} variant="secondary">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Hashtags */}
                  {video.hashtags && video.hashtags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Hash className="w-5 h-5 text-cyan-500" />
                          Hashtags
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {video.hashtags.map((hashtag, index) => (
                            <Badge key={index} variant="outline" className="text-cyan-600">
                              #{hashtag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Tag className="w-5 h-5 text-green-500" />
                          Tags de Análisis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {video.tags.map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notas Personales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {video.notes ? (
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <p className="text-sm leading-relaxed">{video.notes}</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm italic">
                          No hay notas añadidas para este video.
                        </p>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="mt-4"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar Notas
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Adaptation Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Generar Adaptación
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea
                        placeholder="Describe cómo quieres adaptar este contenido a tu nicho..."
                        value={adaptationPrompt}
                        onChange={(e) => setAdaptationPrompt(e.target.value)}
                        rows={4}
                      />
                      <Button 
                        onClick={handleAdaptContent}
                        disabled={adapting || !adaptationPrompt.trim()}
                        className="w-full"
                      >
                        {adapting ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Generando Adaptación...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Generar Contenido Adaptado
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};