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
    <footer className="relative overflow-hidden">
      {/* CTA Section */}
      <section className="py-24 px-4 relative">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-primary opacity-5"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto max-w-5xl text-center space-y-12 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div 
              className="inline-flex items-center space-x-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 text-success text-sm font-medium mb-8"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Únete a la Revolución</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-text-primary mb-8 leading-tight"
              variants={fadeInUp}
            >
              Transforma tu{' '}
              <motion.span 
                className="bg-gradient-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Estrategia
              </motion.span>
              <br />
              de TikTok Hoy
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Miles de creadores ya están usando IA para dominar TikTok. 
              <strong className="text-primary"> ¿Qué esperas?</strong>
            </motion.p>
            
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-primary hover:opacity-90 transition-all px-12 py-6 text-xl font-semibold shadow-glow group relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-md"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Brain className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform relative z-10" />
                <span className="relative z-10">Empezar Ahora Gratis</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center space-x-6 pt-8 text-text-muted"
              variants={fadeInUp}
            >
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Sin compromiso</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Acceso inmediato</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Soporte 24/7</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Bottom */}
      <section className="border-t border-border bg-navy-light/30 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <Brain className="w-6 h-6 text-text-primary" />
              </motion.div>
              <div>
                <h3 className="text-lg font-bold text-text-primary">
                  TikTok<span className="bg-gradient-primary bg-clip-text text-transparent"> AI Analytics</span>
                </h3>
                <p className="text-sm text-text-muted">Powered by AI • Built for Growth</p>
              </div>
            </div>
            
            <motion.div 
              className="flex items-center space-x-2 text-text-muted"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm">Hecho con</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  color: ["#ef4444", "#f97316", "#ef4444"]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
              <span className="text-sm">para creadores</span>
            </motion.div>
            
            <div className="text-sm text-text-muted">
              © 2024 TikTok AI Analytics. Todos los derechos reservados.
            </div>
          </motion.div>
        </div>
      </section>
    </footer>
  );
};