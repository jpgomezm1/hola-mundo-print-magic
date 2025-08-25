import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target } from 'lucide-react';

interface LandingNavbarProps {
  onSignInClick: () => void;
}

export const LandingNavbar = ({ onSignInClick }: LandingNavbarProps) => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-purple"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Brain className="w-7 h-7 text-text-primary" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black text-text-primary">
              TikTok<span className="bg-gradient-primary bg-clip-text text-transparent"> AI</span>
            </h1>
            <p className="text-xs text-text-muted font-medium">Analytics Platform</p>
          </div>
        </motion.div>
        
        <div className="hidden lg:flex items-center space-x-12">
          <motion.div 
            className="flex items-center space-x-3 text-text-secondary group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-semibold group-hover:text-text-primary transition-colors">Powered by AI</span>
              <p className="text-xs text-text-muted">OpenAI • Gemini • Claude</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-3 text-text-secondary group"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center group-hover:bg-success/20 transition-colors">
              <Target className="w-4 h-4 text-success" />
            </div>
            <div>
              <span className="text-sm font-semibold group-hover:text-text-primary transition-colors">Viralidad</span>
              <p className="text-xs text-text-muted">Consistente</p>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onSignInClick}
            className="bg-gradient-primary hover:opacity-90 transition-all shadow-glow px-8 py-3 font-bold text-lg group"
          >
            <span className="group-hover:scale-105 transition-transform">Iniciar Sesión</span>
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};