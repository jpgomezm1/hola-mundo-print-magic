import { Button } from '@/components/ui/button';
import { Brain, Zap, Target } from 'lucide-react';

interface LandingNavbarProps {
  onSignInClick: () => void;
}

export const LandingNavbar = ({ onSignInClick }: LandingNavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              TikTok<span className="bg-gradient-primary bg-clip-text text-transparent"> AI Analytics</span>
            </h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex items-center space-x-2 text-text-secondary">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">Powered by AI</span>
          </div>
          <div className="flex items-center space-x-2 text-text-secondary">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm">Viralidad Consistente</span>
          </div>
        </div>
        
        <Button 
          onClick={onSignInClick}
          className="bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          Iniciar Sesión
        </Button>
      </div>
    </nav>
  );
};