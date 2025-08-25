import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Target } from 'lucide-react';

interface LandingNavbarProps {
  onSignInClick: () => void;
}

export const LandingNavbar = ({ onSignInClick }: LandingNavbarProps) => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
            whileHover={{ rotate: 10 }}
          >
            <Brain className="w-6 h-6 text-text-primary" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              TikTok<span className="bg-gradient-primary bg-clip-text text-transparent"> AI Analytics</span>
            </h1>
          </div>
        </motion.div>
        
        <div className="hidden md:flex items-center space-x-8">
          <motion.div 
            className="flex items-center space-x-2 text-text-secondary"
            whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">Powered by AI</span>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-2 text-text-secondary"
            whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
          >
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm">Viralidad Consistente</span>
          </motion.div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={onSignInClick}
            className="bg-gradient-primary hover:opacity-90 transition-all shadow-purple"
          >
            Iniciar Sesión
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};