import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Copy
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

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
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

        {/* Creator and Duration */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {video.creator_username && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              @{video.creator_username}
            </div>
          )}
          {video.duration_seconds && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {video.duration_seconds}s
            </div>
          )}
        </div>

        {/* Tags and Category */}
        <div className="flex flex-wrap gap-2">
          {video.category && (
            <Badge variant="secondary" className="text-xs">
              {video.category}
            </Badge>
          )}
          {video.tags?.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
          {video.tags && video.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{video.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Thumbnail */}
        {video.thumbnail_url && (
          <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
            <img 
              src={video.thumbnail_url} 
              alt="Video thumbnail"
              className="max-h-full max-w-full rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-center p-4">
              <Play className="w-12 h-12 mx-auto mb-2 text-primary/60" />
              <p className="text-sm text-muted-foreground">Vista previa del video</p>
            </div>
          </div>
        )}

        {/* Key Information */}
        <div className="space-y-3">
          {video.hook && (
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Hook
              </Label>
              <div className="flex items-start gap-2">
                <p className="text-sm bg-gradient-to-r from-primary/10 to-secondary/10 p-2 rounded-lg flex-1">
                  "{video.hook}"
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(video.hook!, 'Hook')}
                  className="h-8 w-8 p-0"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          )}

          {video.video_theme && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Tema:</span>
              <Badge variant="secondary">{video.video_theme}</Badge>
            </div>
          )}

          {video.tone_style && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Tono:</span>
              <Badge variant="outline">{video.tone_style}</Badge>
            </div>
          )}

          {video.cta_type && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">CTA:</span>
              <Badge variant="outline">{video.cta_type}</Badge>
            </div>
          )}
        </div>

        {/* Notes */}
        {video.notes && (
          <div className="space-y-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Notas
            </Label>
            <p className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
              {video.notes}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(video.tiktok_url, '_blank')}
            className="flex-1"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Original
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1">
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
  );
};