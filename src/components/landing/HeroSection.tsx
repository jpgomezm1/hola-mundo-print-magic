import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

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

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-navy-dark via-background to-navy-light">
      {/* Clean Background with Subtle Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-purple-bright/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-32 relative z-10">
        <motion.div 
          className="text-center space-y-12"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp} className="pt-8">
            <motion.div 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-bright/15 to-primary/15 backdrop-blur-sm border border-purple-bright/30 rounded-full px-6 py-3 text-purple-light font-medium"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm">Powered by AI • OpenAI • Gemini • Claude</span>
            </motion.div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <div className="space-y-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-text-primary leading-[0.9] tracking-tight">
                Sé{' '}
                <motion.span 
                  className="bg-gradient-primary bg-clip-text text-transparent relative inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  Viral
                  <motion.div 
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </motion.span>
                <br />
                <motion.span 
                  className="text-text-secondary block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Consistentemente
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-5xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                En la era de la IA, la guerra es por la{' '}
                <span className="text-primary font-semibold">atención</span>
                . Domina TikTok con inteligencia artificial y convierte cada video en una{' '}
                <span className="text-primary font-semibold">oportunidad de negocio</span>.
              </motion.p>
            </div>
          </motion.div>
          
          {/* CTA Button */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg"
                onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
                className="bg-gradient-primary hover:opacity-90 transition-all px-12 py-6 text-xl font-bold rounded-xl shadow-glow"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Comenzar Gratis
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};