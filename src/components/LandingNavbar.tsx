import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, CheckCircle, Zap, Star, ArrowRight, Eye, Rocket } from 'lucide-react';

interface LandingNavbarProps {
  onSignInClick: () => void;
}

export const LandingNavbar = ({ onSignInClick }: LandingNavbarProps) => {

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Enhanced Logo */}
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div 
            className="relative w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Brain className="w-7 h-7 text-white" />
            
            {/* Logo glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-50"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-2xl font-black text-text-primary"
              whileHover={{ scale: 1.02 }}
            >
              Viral<span className="bg-gradient-primary bg-clip-text text-transparent">Mind</span>
            </motion.h1>
            <motion.div 
              className="text-xs text-primary/80 font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI Revolution
            </motion.div>
          </div>
        </motion.div>
        
        {/* Enhanced Navigation */}
        <div className="hidden md:flex items-center space-x-10">
          {[
            { href: "#problema", label: "Problema", icon: Eye },
            { href: "#solucion", label: "Solución", icon: Brain },
            { href: "#herramientas", label: "Herramientas", icon: Zap }
          ].map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              className="relative flex items-center space-x-2 text-text-secondary hover:text-primary transition-all font-semibold text-base group"
              whileHover={{ scale: 1.1, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <item.icon className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span>{item.label}</span>
              
              {/* Hover underline */}
              <motion.div 
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full opacity-0 group-hover:opacity-100"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>
        
        {/* Enhanced CTA Button */}
        <motion.div
          className="relative"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Button 
            onClick={() => window.open('https://tool-tiktok.lovable.app/dashboard', '_blank')}
            className="relative bg-gradient-primary hover:bg-primary/90 transition-all duration-300 px-8 py-3 font-bold text-base rounded-xl shadow-lg shadow-primary/20 border border-primary/20 group"
          >
            <div className="flex items-center space-x-2">
              <Rocket className="w-5 h-5" />
              <span>¡Explorar Ahora!</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Button>
        </motion.div>

        {/* Mobile menu hint */}
        <div className="md:hidden">
          <motion.div 
            className="text-primary/60 text-xs font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ← ¡Toca el botón!
          </motion.div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.nav>
  );
};