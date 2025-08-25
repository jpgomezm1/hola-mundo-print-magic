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
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-navy-light/20">
      {/* Clean minimal background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
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
          {/* Minimal Badge */}
          <motion.div variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-primary/5 border border-primary/20 rounded-full px-4 py-2 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </motion.div>
          
          {/* Clean Typography */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[0.9] tracking-tight">
              Sé{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Viral
              </span>
              <br />
              <span className="text-text-secondary/80 text-5xl md:text-6xl lg:text-7xl">
                Consistentemente
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed font-light">
              En la era de la IA, la guerra es por la <span className="text-primary font-medium">atención</span>.
              <br />
              Domina TikTok con inteligencia artificial y convierte cada video en una{' '}
              <span className="text-primary font-medium">oportunidad de negocio</span>.
            </p>
          </motion.div>
          
          {/* Simple CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button 
              size="lg"
              onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
              className="bg-gradient-primary hover:opacity-90 transition-all px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Comenzar Gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};