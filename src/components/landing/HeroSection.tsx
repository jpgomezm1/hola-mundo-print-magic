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
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-bright/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-success/5 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="text-center space-y-12"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          <motion.div className="space-y-8" variants={fadeInUp}>
            <motion.div 
              className="inline-flex items-center space-x-3 bg-purple-bright/10 backdrop-blur-sm border border-purple-bright/20 rounded-full px-6 py-3 text-purple-light text-sm font-medium shadow-purple"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--purple-bright))" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span>Powered by AI • OpenAI • Gemini • Claude</span>
            </motion.div>
            
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-text-primary leading-[0.9] tracking-tight">
                Sé{' '}
                <motion.span 
                  className="bg-gradient-primary bg-clip-text text-transparent inline-block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                >
                  Viral
                </motion.span>
                <br />
                <motion.span 
                  className="text-text-secondary"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Consistentemente
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-text-secondary max-w-5xl mx-auto leading-relaxed"
                variants={fadeInUp}
              >
                En la era de la IA, la guerra es por la{' '}
                <motion.span 
                  className="text-primary font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  atención
                </motion.span>
                . Domina TikTok con inteligencia artificial y convierte cada video en una{' '}
                <motion.span 
                  className="text-primary font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  oportunidad de negocio
                </motion.span>
                .
              </motion.p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            variants={fadeInUp}
          >
            <motion.div
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
                <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform relative z-10" />
                <span className="relative z-10">Comenzar Gratis</span>
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform relative z-10" />
              </Button>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-3 text-text-muted"
              whileHover={{ scale: 1.05 }}
            >
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-lg">Sin tarjeta de crédito • Acceso inmediato</span>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto pt-16"
            variants={stagger}
          >
            {[
              { number: "10M+", label: "Videos Analizados", color: "text-primary" },
              { number: "95%", label: "Precisión en Predicciones", color: "text-success" },
              { number: "3x", label: "Aumento de Engagement", color: "text-warning" },
              { number: "24/7", label: "Análisis en Tiempo Real", color: "text-info" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center group cursor-pointer"
                variants={scaleIn}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className={`text-4xl md:text-5xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-text-secondary text-sm mt-2 group-hover:text-text-primary transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <motion.div 
              className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div 
                className="w-1 h-3 bg-text-muted rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};