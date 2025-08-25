import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, CheckCircle } from 'lucide-react';

interface LandingNavbarProps {
  onSignInClick: () => void;
}

export const LandingNavbar = ({ onSignInClick }: LandingNavbarProps) => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-black text-text-primary">
              TikTok<span className="bg-gradient-primary bg-clip-text text-transparent"> AI</span>
            </h1>
          </div>
        </motion.div>
        
        {/* Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { href: "#problema", label: "Problema" },
            { href: "#solucion", label: "Solución" },
            { href: "#herramientas", label: "Herramientas" }
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="text-text-secondary hover:text-primary transition-colors font-medium text-sm"
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
        
        {/* CTA Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
            className="bg-gradient-primary hover:opacity-90 transition-all px-6 py-2 font-semibold rounded-lg text-sm"
          >
            Explora la Herramienta
          </Button>
        </motion.div>
      </div>
    </motion.nav>
  );
};