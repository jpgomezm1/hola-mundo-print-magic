import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ReferenceVideo } from '@/hooks/useReferenceVideos';
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Video,
  Star,
  Clock,
  Target,
  BarChart3,
  Zap,
  Award,
  Flame,
  Users,
  Calendar,
  Hash
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ReferenceVideosDashboardProps {
  videos: ReferenceVideo[];
}

export const ReferenceVideosDashboard: React.FC<ReferenceVideosDashboardProps> = ({ videos }) => {
  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    if (videos.length === 0) return null;

    // Basic counts
    const totalVideos = videos.length;
    const favoritesCount = videos.filter(v => v.is_favorite).length;
    const categoriesCount = new Set(videos.map(v => v.category).filter(Boolean)).size;
    const uniqueTags = new Set(videos.flatMap(v => v.tags || [])).size;

    // Engagement metrics
    const videosWithMetrics = videos.filter(v => v.engagement_metrics);
    const totalViews = videosWithMetrics.reduce((sum, v) => sum + (v.engagement_metrics?.views || 0), 0);
    const totalLikes = videosWithMetrics.reduce((sum, v) => sum + (v.engagement_metrics?.likes || 0), 0);
    const totalComments = videosWithMetrics.reduce((sum, v) => sum + (v.engagement_metrics?.comments || 0), 0);
    const totalShares = videosWithMetrics.reduce((sum, v) => sum + (v.engagement_metrics?.shares || 0), 0);

    // Average engagement rate
    const avgEngagementRate = videosWithMetrics.length > 0 ? 
      videosWithMetrics.reduce((sum, v) => {
        const engagement = (v.engagement_metrics?.likes || 0) + (v.engagement_metrics?.comments || 0) + (v.engagement_metrics?.shares || 0);
        const views = v.engagement_metrics?.views || 1;
        return sum + (engagement / views * 100);
      }, 0) / videosWithMetrics.length : 0;

    // Viral score calculation
    const getViralScore = (video: ReferenceVideo) => {
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

    const viralScores = videos.map(getViralScore);
    const avgViralScore = viralScores.length > 0 ? viralScores.reduce((a, b) => a + b, 0) / viralScores.length : 0;
    const highPerformers = viralScores.filter(score => score >= 70).length;

    // Category distribution
    const categoryData = Array.from(
      videos.reduce((acc, video) => {
        const category = video.category || 'Sin categoría';
        acc.set(category, (acc.get(category) || 0) + 1);
        return acc;
      }, new Map())
    ).map(([name, value]) => ({ name, value }));

    // Performance distribution
    const performanceData = [
      { name: 'Viral (80-100)', value: viralScores.filter(s => s >= 80).length, fill: '#22c55e' },
      { name: 'Alto (60-79)', value: viralScores.filter(s => s >= 60 && s < 80).length, fill: '#eab308' },
      { name: 'Medio (40-59)', value: viralScores.filter(s => s >= 40 && s < 60).length, fill: '#f97316' },
      { name: 'Bajo (0-39)', value: viralScores.filter(s => s < 40).length, fill: '#ef4444' }
    ];

    // Duration analysis
    const durationData = [
      { range: '0-15s', count: videos.filter(v => v.duration_seconds && v.duration_seconds <= 15).length },
      { range: '16-30s', count: videos.filter(v => v.duration_seconds && v.duration_seconds > 15 && v.duration_seconds <= 30).length },
      { range: '31-60s', count: videos.filter(v => v.duration_seconds && v.duration_seconds > 30 && v.duration_seconds <= 60).length },
      { range: '60s+', count: videos.filter(v => v.duration_seconds && v.duration_seconds > 60).length }
    ];

    // Top performing videos
    const topVideos = videos
      .filter(v => v.engagement_metrics)
      .sort((a, b) => getViralScore(b) - getViralScore(a))
      .slice(0, 5);

    return {
      totalVideos,
      favoritesCount,
      categoriesCount,
      uniqueTags,
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagementRate,
      avgViralScore,
      highPerformers,
      categoryData,
      performanceData,
      durationData,
      topVideos,
      getViralScore
    };
  }, [videos]);

  if (!analytics) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No hay datos disponibles</h3>
          <p className="text-muted-foreground">Agrega algunos videos de referencia para ver el análisis</p>
        </CardContent>
      </Card>
    );
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Videos</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{analytics.totalVideos}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-800/30 rounded-full">
                <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Score Viral Promedio</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{analytics.avgViralScore.toFixed(0)}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-800/30 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-2">
              <Progress value={analytics.avgViralScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Alto Rendimiento</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{analytics.highPerformers}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">Score ≥ 70</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-800/30 rounded-full">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Engagement Rate</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{analytics.avgEngagementRate.toFixed(1)}%</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-800/30 rounded-full">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{(analytics.totalViews / 1000000).toFixed(1)}M</p>
            <p className="text-sm text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{(analytics.totalLikes / 1000).toFixed(0)}K</p>
            <p className="text-sm text-muted-foreground">Total Likes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analytics.totalComments.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Comentarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Share2 className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{analytics.totalShares.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Shares</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Distribución de Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {analytics.performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Duration Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Análisis de Duración
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.durationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      {analytics.topVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top 5 Videos de Mayor Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topVideos.map((video, index) => {
                const viralScore = analytics.getViralScore(video);
                return (
                  <div key={video.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge variant={index < 3 ? "default" : "secondary"} className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    
                    {video.thumbnail_url && (
                      <div className="w-16 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={video.thumbnail_url} 
                          alt="thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{video.title || 'Sin título'}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>@{video.creator_username || 'Unknown'}</span>
                        {video.engagement_metrics?.views && (
                          <span>{(video.engagement_metrics.views / 1000).toFixed(0)}K views</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 text-right">
                      <div className={`text-lg font-bold ${
                        viralScore >= 80 ? 'text-green-600' : 
                        viralScore >= 60 ? 'text-yellow-600' : 'text-orange-600'
                      }`}>
                        {viralScore}
                      </div>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Category Distribution */}
      {analytics.categoryData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Distribución por Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <Badge variant="outline">{category.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};