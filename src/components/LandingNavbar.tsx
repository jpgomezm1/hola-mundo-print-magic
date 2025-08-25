import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, CheckCircle, Zap, Star, ArrowRight, Eye, Rocket } from 'lucide-react';

interface LandingNavbarProps {
  onSignInClick: () => void;
}

export const LandingNavbar = ({ onSignInClick }: LandingNavbarProps) => {
  // Animación de pulso constante para el botón
  const pulseAnimation = {
    scale: [1, 1.05, 1],
    boxShadow: [
      "0 0 20px rgba(var(--primary-rgb), 0.3)",
      "0 0 40px rgba(var(--primary-rgb), 0.6)",
      "0 0 20px rgba(var(--primary-rgb), 0.3)"
    ]
  };

  // Animación de salto para llamar la atención
  const bounceAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Animación del brillo que pasa por el botón
  const shineAnimation = {
    x: [-100, 300],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      repeatDelay: 3
    }
  };

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
        
        {/* MEGA ENHANCED CTA Button - MUST CLICK */}
        <motion.div
          className="relative"
          animate={bounceAnimation}
        >
          {/* Attention ring around button */}
          <motion.div 
            className="absolute inset-0 rounded-2xl border-2 border-primary/30"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary attention ring */}
          <motion.div 
            className="absolute inset-0 rounded-2xl border border-primary/20"
            animate={{ 
              scale: [1, 1.4, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }}
          />

          {/* Floating sparkles around button */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [-10, 10, -10],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}

          <motion.div
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.95 }}
            animate={pulseAnimation}
            transition={{ 
              scale: { duration: 1, repeat: Infinity },
              y: { type: "spring", stiffness: 300 }
            }}
          >
            <Button 
              onClick={() => window.open('https://preview--tool-tiktok.lovable.app/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired', '_blank')}
              className="relative bg-gradient-primary hover:from-primary/90 hover:to-primary transition-all duration-300 px-8 py-4 font-black text-base rounded-2xl shadow-2xl shadow-primary/40 border border-primary/30 backdrop-blur-sm group overflow-hidden"
            >
              {/* Button shine effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-8 h-full"
                animate={shineAnimation}
              />
              
              {/* Icons animation */}
              <div className="relative z-10 flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Rocket className="w-5 h-5" />
                </motion.div>
                
                <span className="font-black">¡Explorar Ahora!</span>
                
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>

              {/* Success badge */}
              <motion.div 
                className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  scale: { duration: 1, repeat: Infinity },
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                }}
              >
                <CheckCircle className="w-3 h-3 text-white" />
              </motion.div>

              {/* Urgency indicator */}
              <motion.div 
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                animate={{ 
                  y: [0, -2, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                GRATIS
              </motion.div>
            </Button>
          </motion.div>

          {/* Call-out arrow pointing to button */}
          <motion.div 
            className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-primary/80"
            animate={{ 
              x: [0, 5, 0],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="flex items-center space-x-1 text-xs font-bold">
              <span>¡Clic aquí!</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </motion.div>
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