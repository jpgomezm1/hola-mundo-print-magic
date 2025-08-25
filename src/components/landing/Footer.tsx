import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onGetStarted: () => void;
}

export const Footer = ({ onGetStarted }: FooterProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <footer className="relative">
      {/* Clean CTA Section */}
      <section className="py-20 px-6 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 text-success text-sm font-medium mb-6"
              variants={fadeInUp}
            >
              <Sparkles className="w-4 h-4" />
              <span>Empieza Ahora</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-black text-text-primary mb-6"
              variants={fadeInUp}
            >
              Transforma tu{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Estrategia
              </span>
              <br />
              de TikTok Hoy
            </motion.h2>
            
            <motion.p 
              className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Miles de creadores ya están usando IA para dominar TikTok.{' '}
              <span className="text-primary font-semibold">¿Qué esperas?</span>
            </motion.p>
            
            <motion.div variants={fadeInUp}>
              <Button 
                size="lg"
                onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
                className="bg-gradient-primary hover:opacity-90 transition-all px-10 py-4 text-lg font-semibold rounded-xl shadow-lg"
              >
                <Brain className="w-5 h-5 mr-2" />
                Explora la Herramienta
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <section className="border-t border-border/30 bg-navy-light/20 py-6 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary">
                  TikTok<span className="bg-gradient-primary bg-clip-text text-transparent"> AI</span>
                </h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-text-muted text-sm">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-error fill-current" />
              <span>para creadores</span>
            </div>
            
            <div className="text-sm text-text-muted">
              © 2024 TikTok AI. Todos los derechos reservados.
            </div>
          </div>
          
          {/* Secret login button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={onGetStarted}
              className="text-text-muted/30 hover:text-text-muted/60 transition-colors text-xs"
            >
              •••
            </button>
          </div>
        </div>
      </section>
    </footer>
  );
};