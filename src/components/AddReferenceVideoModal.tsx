import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useReferenceVideos } from '@/hooks/useReferenceVideos';
import { Plus, X, Link as LinkIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

interface AddReferenceVideoModalProps {
  trigger?: React.ReactNode;
  onVideoAdded?: () => void;
}

const VIDEO_CATEGORIES = [
  'educativo',
  'entretenimiento',
  'viral',
  'storytelling',
  'producto',
  'motivacional',
  'trending',
  'tutorial',
  'lifestyle',
  'otros'
];

const COMMON_TAGS = [
  'hook fuerte',
  'viral',
  'educativo',
  'entretenimiento',
  'storytelling',
  'transiciones',
  'texto overlay',
  'música trending',
  'engagement alto',
  'call to action',
  'problema-solución',
  'antes y después',
  'lista',
  'pregunta',
  'controversia'
];

export const AddReferenceVideoModal: React.FC<AddReferenceVideoModalProps> = ({
  trigger,
  onVideoAdded
}) => {
  const { toast } = useToast();
  const { analyzeVideo, analyzing } = useReferenceVideos();
  const [open, setOpen] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim().toLowerCase());
      setCustomTag('');
    }
  };

  const resetForm = () => {
    setTiktokUrl('');
    setCategory('');
    setNotes('');
    setSelectedTags([]);
    setCustomTag('');
  };

  const validateTikTokUrl = (url: string) => {
    const tiktokRegex = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)/;
    return tiktokRegex.test(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tiktokUrl.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa la URL del video de TikTok",
        variant: "destructive",
      });
      return;
    }

    if (!validateTikTokUrl(tiktokUrl)) {
      toast({
        title: "URL inválida",
        description: "Por favor ingresa una URL válida de TikTok",
        variant: "destructive",
      });
      return;
    }

    try {
      await analyzeVideo({
        tiktok_url: tiktokUrl,
        tags: selectedTags,
        category: category || 'otros',
        notes: notes.trim()
      });

      resetForm();
      setOpen(false);
      onVideoAdded?.();
      
    } catch (error) {
      console.error('Error analyzing video:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Referente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Agregar Video de Referencia
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TikTok URL */}
          <div className="space-y-2">
            <Label htmlFor="tiktok-url" className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              URL del Video de TikTok *
            </Label>
            <Input
              id="tiktok-url"
              type="url"
              value={tiktokUrl}
              onChange={(e) => setTiktokUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@usuario/video/1234567890"
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Pega aquí el enlace del video de TikTok que quieres analizar
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {VIDEO_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            
            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Common Tags */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Tags comunes:</p>
              <div className="flex flex-wrap gap-2">
                {COMMON_TAGS.filter(tag => !selectedTags.includes(tag)).map(tag => (
                  <Badge 
                    key={tag}
                    variant="outline" 
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Agregar tag personalizado..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addCustomTag}
                disabled={!customTag.trim()}
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="¿Por qué consideras este video como referente? ¿Qué elementos específicos te llamaron la atención?"
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={analyzing || !tiktokUrl.trim()}
              className="flex-1"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Analizando Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analizar y Guardar
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={analyzing}
            >
              Cancelar
            </Button>
          </div>
        </form>

        {analyzing && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Analizando video con IA...
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Extrayendo hook, script, estilo de edición y elementos virales. Esto puede tomar unos segundos.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};