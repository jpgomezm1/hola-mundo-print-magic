import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { EnhancedReferenceCard } from '@/components/EnhancedReferenceCard';
import { ReferenceVideosDashboard } from '@/components/ReferenceVideosDashboard';
import { AddReferenceVideoModal } from '@/components/AddReferenceVideoModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useReferenceVideos } from '@/hooks/useReferenceVideos';
import { 
  Search, 
  Filter, 
  Heart, 
  Grid3X3, 
  List, 
  SortAsc, 
  SortDesc,
  Sparkles,
  VideoIcon,
  TrendingUp,
  Clock,
  Plus,
  X,
  Download,
  BarChart3,
  Eye,
  Target,
  Zap,
  GitCompare,
  Settings,
  RefreshCw
} from 'lucide-react';
import { NoDataState } from '@/components/empty-states/NoDataState';
import { PieChartSkeleton } from '@/components/skeletons/ChartSkeleton';

type SortOption = 'created_at' | 'title' | 'duration_seconds' | 'creator_username' | 'viral_score';
type ViewMode = 'grid' | 'list' | 'compact';
type ActiveTab = 'videos' | 'analytics' | 'compare';

export default function ReferenceVideos() {
  const { 
    referenceVideos, 
    loading, 
    searchVideos, 
    filterByCategory, 
    filterByTags, 
    getFavorites,
    getCategories,
    getAllTags,
    refetch
  } = useReferenceVideos();

  // State for filters and search
  const [activeTab, setActiveTab] = useState<ActiveTab>('videos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [adaptedContent, setAdaptedContent] = useState<string>('');
  const [showAdaptedContent, setShowAdaptedContent] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Get filter options
  const categories = getCategories();
  const allTags = getAllTags();

  // Calculate viral score for sorting
  const getViralScore = (video: any) => {
    let score = 0;
    const metrics = video.engagement_metrics;
    
    if (!metrics) return 0;
    
    const engagementRate = metrics.views ? 
      ((metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)) / metrics.views * 100 : 0;
    
    score += Math.min(engagementRate * 4, 40);
    
    if (metrics.views) {
      if (metrics.views > 1000000) score += 20;
      else if (metrics.views > 500000) score += 15;
      else if (metrics.views > 100000) score += 10;
      else if (metrics.views > 50000) score += 5;
    }
    
    if (video.hook && video.hook.length > 10) score += 15;
    if (video.duration_seconds && video.duration_seconds >= 15 && video.duration_seconds <= 60) score += 10;
    
    const viralFactors = video.extracted_insights?.viral_factors?.length || 0;
    score += Math.min(viralFactors * 3, 15);
    
    return Math.min(Math.round(score), 100);
  };

  // Filtered and sorted videos
  const filteredVideos = useMemo(() => {
    let videos = referenceVideos;

    // Apply search
    if (searchQuery.trim()) {
      videos = searchVideos(searchQuery);
    }

    // Apply category filter
    if (selectedCategory) {
      videos = videos.filter(video => video.category === selectedCategory);
    }

    // Apply tags filter
    if (selectedTags.length > 0) {
      videos = videos.filter(video => 
        selectedTags.some(tag => video.tags?.includes(tag))
      );
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      videos = videos.filter(video => video.is_favorite);
    }

    // Apply sorting
    videos.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === 'viral_score') {
        aValue = getViralScore(a);
        bValue = getViralScore(b);
      } else if (sortBy === 'created_at') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return videos;
  }, [
    referenceVideos,
    searchQuery,
    selectedCategory,
    selectedTags,
    showFavoritesOnly,
    sortBy,
    sortOrder,
    searchVideos,
    getViralScore
  ]);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedTags([]);
    setShowFavoritesOnly(false);
  };

  const handleAdaptedContent = (content: string) => {
    setAdaptedContent(content);
    setShowAdaptedContent(true);
  };

  // Quick stats for header
  const quickStats = useMemo(() => {
    const totalVideos = referenceVideos.length;
    const highPerformers = referenceVideos.filter(v => getViralScore(v) >= 70).length;
    const avgScore = totalVideos > 0 ? 
      referenceVideos.reduce((sum, v) => sum + getViralScore(v), 0) / totalVideos : 0;
    
    return {
      totalVideos,
      highPerformers,
      avgScore: Math.round(avgScore),
      favorites: getFavorites().length
    };
  }, [referenceVideos, getViralScore, getFavorites]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PieChartSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PieChartSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeader />
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <VideoIcon className="w-4 h-4" />
              <span>{quickStats.totalVideos} videos</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Score promedio: {quickStats.avgScore}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4" />
              <span>{quickStats.highPerformers} alto rendimiento</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Actualizar
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Agregar Referente
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="videos" className="gap-2">
            <VideoIcon className="w-4 h-4" />
            Videos ({referenceVideos.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="compare" className="gap-2">
            <GitCompare className="w-4 h-4" />
            Comparar
          </TabsTrigger>
        </TabsList>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros y Búsqueda
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            {showFilters && (
              <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Buscar por título, hook, script, creador, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Category Filter */}
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(category => category && category.trim() !== '').map(category => (
                        <SelectItem key={category} value={category} className="capitalize">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort Options */}
                  <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Fecha de creación</SelectItem>
                      <SelectItem value="viral_score">Score viral</SelectItem>
                      <SelectItem value="title">Título</SelectItem>
                      <SelectItem value="duration_seconds">Duración</SelectItem>
                      <SelectItem value="creator_username">Creador</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>

                  {/* Favorites Filter */}
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                    Solo Favoritos
                  </Button>

                  {/* View Mode */}
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'compact' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('compact')}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Clear Filters */}
                  {(searchQuery || selectedCategory || selectedTags.length > 0 || showFavoritesOnly) && (
                    <Button variant="outline" size="sm" onClick={clearAllFilters}>
                      <X className="w-4 h-4 mr-2" />
                      Limpiar Filtros
                    </Button>
                  )}
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tags disponibles:</p>
                    <div className="flex flex-wrap gap-2">
                      {allTags.slice(0, 10).map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => 
                            selectedTags.includes(tag) ? removeTag(tag) : addTag(tag)
                          }
                        >
                          {tag}
                          {selectedTags.includes(tag) && (
                            <X className="w-3 h-3 ml-1" />
                          )}
                        </Badge>
                      ))}
                      {allTags.length > 10 && (
                        <Badge variant="secondary">
                          +{allTags.length - 10} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Active Filters Summary */}
                {(selectedTags.length > 0 || selectedCategory || showFavoritesOnly) && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Filtros activos:</span>
                    {selectedCategory && (
                      <Badge variant="secondary">
                        Categoría: {selectedCategory}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => setSelectedCategory('')}
                        />
                      </Badge>
                    )}
                    {showFavoritesOnly && (
                      <Badge variant="secondary">
                        Solo favoritos
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => setShowFavoritesOnly(false)}
                        />
                      </Badge>
                    )}
                    {selectedTags.map(tag => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Results */}
          {filteredVideos.length === 0 ? (
            referenceVideos.length === 0 ? (
              <NoDataState
                type="ai"
                title="No tienes videos de referencia"
                subtitle="Comienza agregando videos de TikTok que te inspiren para crear contenido viral"
                actionLabel="Agregar primer referente"
                onAction={() => setShowAddModal(true)}
              />
            ) : (
              <NoDataState
                type="search"
                title="No se encontraron resultados"
                subtitle="Intenta ajustar los filtros o cambiar los términos de búsqueda"
                actionLabel="Limpiar filtros"
                onAction={clearAllFilters}
              />
            )
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : viewMode === 'compact'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}>
              {filteredVideos.map(video => (
                <EnhancedReferenceCard
                  key={video.id}
                  video={video}
                  onAdapt={handleAdaptedContent}
                  compact={viewMode === 'compact'}
                />
              ))}
            </div>
          )}

          {/* Results Summary */}
          {filteredVideos.length > 0 && (
            <div className="text-center text-sm text-muted-foreground">
              Mostrando {filteredVideos.length} de {referenceVideos.length} videos de referencia
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <ReferenceVideosDashboard videos={referenceVideos} />
        </TabsContent>

        {/* Compare Tab */}
        <TabsContent value="compare">
          <Card>
            <CardContent className="text-center py-12">
              <GitCompare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Comparación de Videos</h3>
              <p className="text-muted-foreground mb-4">
                Funcionalidad de comparación próximamente disponible
              </p>
              <p className="text-sm text-muted-foreground">
                Podrás comparar múltiples videos lado a lado, analizar diferencias en performance y extraer insights.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adapted Content Dialog */}
      <Dialog open={showAdaptedContent} onOpenChange={setShowAdaptedContent}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Contenido Adaptado a tu Nicho
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {adaptedContent}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(adaptedContent);
                  alert('Contenido copiado al portapapeles');
                }}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Copiar Contenido
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowAdaptedContent(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Reference Video Modal */}
      <AddReferenceVideoModal 
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}