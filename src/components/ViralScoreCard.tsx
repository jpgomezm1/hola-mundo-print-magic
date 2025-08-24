import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Zap, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Star,
  Target,
  Gauge
} from 'lucide-react';

interface ViralScoreCardProps {
  video: {
    engagement_metrics?: {
      views?: number;
      likes?: number;
      comments?: number;
      shares?: number;
    };
    duration_seconds?: number;
    hook?: string;
    extracted_insights?: {
      viral_factors?: string[];
      performance_score?: number;
    };
  };
}

export const ViralScoreCard: React.FC<ViralScoreCardProps> = ({ video }) => {
  // Calculate viral score based on multiple factors
  const calculateViralScore = () => {
    let score = 0;
    const metrics = video.engagement_metrics;
    
    if (!metrics) return 0;
    
    // Engagement rate calculation
    const engagementRate = metrics.views ? 
      ((metrics.likes || 0) + (metrics.comments || 0) + (metrics.shares || 0)) / metrics.views * 100 : 0;
    
    // Base score from engagement rate (0-40 points)
    score += Math.min(engagementRate * 4, 40);
    
    // Views impact (0-20 points)
    if (metrics.views) {
      if (metrics.views > 1000000) score += 20;
      else if (metrics.views > 500000) score += 15;
      else if (metrics.views > 100000) score += 10;
      else if (metrics.views > 50000) score += 5;
    }
    
    // Hook quality (0-15 points)
    if (video.hook && video.hook.length > 10) {
      score += 15;
    }
    
    // Duration sweet spot (0-10 points)
    if (video.duration_seconds) {
      if (video.duration_seconds >= 15 && video.duration_seconds <= 60) {
        score += 10;
      } else if (video.duration_seconds <= 90) {
        score += 5;
      }
    }
    
    // Viral factors bonus (0-15 points)
    const viralFactors = video.extracted_insights?.viral_factors?.length || 0;
    score += Math.min(viralFactors * 3, 15);
    
    return Math.min(Math.round(score), 100);
  };

  const viralScore = calculateViralScore();
  const metrics = video.engagement_metrics;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Viral';
    if (score >= 60) return 'Alto Potencial';
    if (score >= 40) return 'Moderado';
    return 'Bajo';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/30">
      <CardContent className="p-4 space-y-4">
        {/* Viral Score Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-background ${getScoreColor(viralScore)}`}>
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Viral Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(viralScore)}`}>
                {viralScore}/100
              </p>
            </div>
          </div>
          <Badge variant={getScoreBadgeVariant(viralScore)} className="text-xs">
            {getScoreLabel(viralScore)}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress value={viralScore} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Puntuación basada en engagement, hook, duración y factores virales
          </p>
        </div>

        {/* Metrics Breakdown */}
        {metrics && (
          <div className="grid grid-cols-2 gap-3">
            {metrics.views && (
              <div className="flex items-center gap-2 text-xs">
                <Eye className="w-3 h-3 text-blue-500" />
                <span className="text-muted-foreground">Views:</span>
                <span className="font-medium">{(metrics.views / 1000).toFixed(0)}K</span>
              </div>
            )}
            {metrics.likes && (
              <div className="flex items-center gap-2 text-xs">
                <Heart className="w-3 h-3 text-red-500" />
                <span className="text-muted-foreground">Likes:</span>
                <span className="font-medium">{(metrics.likes / 1000).toFixed(1)}K</span>
              </div>
            )}
            {metrics.comments && (
              <div className="flex items-center gap-2 text-xs">
                <MessageCircle className="w-3 h-3 text-green-500" />
                <span className="text-muted-foreground">Comentarios:</span>
                <span className="font-medium">{metrics.comments}</span>
              </div>
            )}
            {metrics.shares && (
              <div className="flex items-center gap-2 text-xs">
                <Share2 className="w-3 h-3 text-purple-500" />
                <span className="text-muted-foreground">Shares:</span>
                <span className="font-medium">{metrics.shares}</span>
              </div>
            )}
          </div>
        )}

        {/* Viral Factors */}
        {video.extracted_insights?.viral_factors && video.extracted_insights.viral_factors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-500" />
              <span className="text-xs font-medium text-muted-foreground">Factores Virales:</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {video.extracted_insights.viral_factors.slice(0, 3).map((factor, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                  {factor}
                </Badge>
              ))}
              {video.extracted_insights.viral_factors.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0">
                  +{video.extracted_insights.viral_factors.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Insights */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Target className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {metrics?.views && metrics.views > 100000 ? 'Alto Alcance' : 
               metrics?.views && metrics.views > 10000 ? 'Medio Alcance' : 'Nicho'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">
              {viralScore >= 60 ? 'Replicable' : 'Estudiar'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};