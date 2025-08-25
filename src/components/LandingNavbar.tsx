import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, CheckCircle } from 'lucide-react';

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
        
        <div className="flex items-center space-x-2">
          <motion.div 
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-bright/10 to-primary/10 backdrop-blur-sm border border-purple-bright/20 rounded-full px-4 py-2"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-purple-light" />
            </motion.div>
            <span className="text-sm text-purple-light font-medium">Powered by AI</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2 bg-success/10 backdrop-blur-sm border border-success/20 rounded-full px-4 py-2"
          >
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-sm text-success font-medium">Viralidad Consistente</span>
          </motion.div>
        </div>
        
        <div className="hidden lg:flex items-center space-x-8">
          {[
            { href: "#problema", label: "El Problema" },
            { href: "#solucion", label: "Solución" },
            { href: "#herramientas", label: "Herramientas" }
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="text-text-secondary hover:text-primary transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {item.label}
            </motion.a>
          ))}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
            className="bg-gradient-primary hover:opacity-90 transition-all shadow-glow px-6 py-2 font-bold rounded-lg"
          >
            Iniciar Sesión
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};