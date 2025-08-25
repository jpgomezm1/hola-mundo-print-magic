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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-dark via-background to-navy-light" />
        <motion.div 
          className="absolute top-20 left-20 w-72 h-72 bg-purple-bright/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-primary/15 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -80, 0],
            y: [0, 30, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-success/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--text-primary)) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-24 relative z-10">
        <motion.div 
          className="text-center space-y-16"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <motion.div 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-bright/10 to-primary/10 backdrop-blur-sm border border-purple-bright/30 rounded-full px-8 py-4 text-purple-light font-medium shadow-glow"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--purple-bright))" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span className="text-lg">Powered by AI • OpenAI • Gemini • Claude</span>
            </motion.div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.div className="space-y-8" variants={fadeInUp}>
            <div className="space-y-6">
              <h1 className="text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black text-text-primary leading-[0.85] tracking-tighter">
                Sé{' '}
                <motion.span 
                  className="bg-gradient-primary bg-clip-text text-transparent inline-block relative"
                  initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, duration: 1, type: "spring" }}
                >
                  Viral
                  <motion.div 
                    className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-primary rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  />
                </motion.span>
                <br />
                <motion.span 
                  className="text-text-secondary block mt-4"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                >
                  Consistentemente
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-2xl md:text-3xl lg:text-4xl text-text-secondary max-w-6xl mx-auto leading-relaxed font-light"
                variants={fadeInUp}
              >
                En la era de la IA, la guerra es por la{' '}
                <motion.span 
                  className="text-primary font-semibold relative"
                  whileHover={{ scale: 1.05 }}
                >
                  atención
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 0.6 }}
                  />
                </motion.span>
                . Domina TikTok con inteligencia artificial y convierte cada video en una{' '}
                <motion.span 
                  className="text-primary font-semibold relative"
                  whileHover={{ scale: 1.05 }}
                >
                  oportunidad de negocio
                  <motion.div 
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ delay: 2, duration: 0.6 }}
                  />
                </motion.span>
                .
              </motion.p>
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            variants={fadeInUp}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={() => window.open('https://preview--tool-tiktok.lovable.app/', '_blank')}
                className="bg-gradient-primary hover:opacity-90 transition-all px-16 py-8 text-2xl font-bold shadow-glow group relative overflow-hidden rounded-2xl"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <Sparkles className="w-7 h-7 mr-4 group-hover:rotate-12 transition-transform relative z-10" />
                <span className="relative z-10">Conoce la Herramienta</span>
                <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform relative z-10" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto pt-20"
            variants={stagger}
          >
            {[
              { number: "10M+", label: "Videos Analizados", color: "text-primary", icon: "📊" },
              { number: "95%", label: "Precisión en Predicciones", color: "text-success", icon: "🎯" },
              { number: "3x", label: "Aumento de Engagement", color: "text-warning", icon: "📈" },
              { number: "24/7", label: "Análisis en Tiempo Real", color: "text-info", icon: "⚡" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center group cursor-pointer bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-8 hover:border-primary/50 transition-all duration-300"
                variants={scaleIn}
                whileHover={{ 
                  y: -15,
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <motion.div 
                  className={`text-5xl md:text-6xl font-black ${stat.color} group-hover:scale-110 transition-transform mb-2`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.5, type: "spring" }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-text-secondary font-medium group-hover:text-text-primary transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
          >
            <motion.div 
              className="w-8 h-12 border-2 border-text-muted/50 rounded-full flex justify-center cursor-pointer group"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="w-1.5 h-4 bg-text-muted/70 rounded-full mt-3 group-hover:bg-primary transition-colors"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <p className="text-text-muted text-sm mt-2 font-medium">Scroll para más</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};