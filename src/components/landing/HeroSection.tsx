import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-navy-light/10">
      {/* Elegant minimal background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-primary/2 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.08, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-6 py-20 relative z-10">
        <motion.div 
          className="text-center space-y-16"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Refined Badge */}
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-primary/8 border border-primary/30 rounded-full px-5 py-2 text-primary text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </motion.div>
          
          {/* Enhanced Typography */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[0.9] tracking-tight">
              Sé{' '}
              <motion.span 
                className="bg-gradient-primary bg-clip-text text-transparent relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Viral
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary rounded-full opacity-60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.span>
              <br />
              <span className="text-text-secondary/80 text-5xl md:text-6xl lg:text-7xl">
                Consistentemente
              </span>
            </h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              En la era de la IA, la guerra es por la{' '}
              <span className="text-primary font-semibold relative">
                atención
                <motion.div 
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                />
              </span>.
              <br />
              Domina TikTok con inteligencia artificial y convierte cada video en una{' '}
              <span className="text-primary font-semibold relative">
                oportunidad de negocio
                <motion.div 
                  className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary/60"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                />
              </span>.
            </motion.p>
          </motion.div>
          
          {/* Elegant CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button 
              size="lg"
              onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
              className="bg-gradient-primary hover:opacity-90 transition-all px-10 py-4 text-lg font-semibold rounded-xl shadow-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Explora la Herramienta
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};