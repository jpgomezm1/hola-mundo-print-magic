import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Sparkles, Heart, Zap, Star, Rocket, Award, Shield, Cpu, Eye, TrendingUp } from 'lucide-react';

interface FooterProps {
  onGetStarted: () => void;
}

export const Footer = ({ onGetStarted }: FooterProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [-4, 4, -4],
      rotate: [0, 2, 0, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const testimonialStats = [
    { icon: TrendingUp, value: "+500%", label: "Engagement promedio" },
    { icon: Star, value: "10K+", label: "Creadores activos" },
    { icon: Zap, value: "2.3s", label: "Análisis instantáneo" },
    { icon: Award, value: "96%", label: "Precisión IA" }
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* Revolutionary CTA Section */}
      <section className="relative py-32 px-6">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-primary/8" />
          
          {/* CTA-focused animated elements */}
          <motion.div 
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div 
            className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-tr from-primary/6 via-primary/3 to-transparent rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />

          {/* Success particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full"
              style={{
                left: `${20 + (i * 6)}%`,
                top: `${25 + (i * 5)}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Call-to-action grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.01]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(var(--primary-rgb), 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(var(--primary-rgb), 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '150px 150px'
            }}
          />
        </div>

        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="space-y-16"
          >
            {/* Enhanced Badge */}
            <motion.div 
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20 border border-primary/40 rounded-full px-8 py-4 backdrop-blur-md shadow-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(var(--primary-rgb), 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-primary font-bold text-lg">El Momento es Ahora</span>
              <div className="w-px h-5 bg-primary/40" />
              <motion.span 
                className="text-primary/90 text-base font-medium"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Únete a la Revolución
              </motion.span>
            </motion.div>
            
            {/* Revolutionary Headline */}
            <motion.div className="space-y-8" variants={stagger}>
              <motion.h2 
                className="text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[0.9] tracking-tight"
                variants={fadeInUp}
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                Transforma tu{' '}
                <motion.span 
                  className="bg-gradient-primary bg-clip-text text-transparent relative inline-block"
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  Destino
                  <motion.div 
                    className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-primary rounded-full opacity-60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                  />
                  {/* Destiny icon */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-8 h-8 text-primary/60"
                    animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Star className="w-full h-full fill-current" />
                  </motion.div>
                </motion.span>
                <br />
                <motion.span 
                  className="text-text-secondary/80 text-5xl md:text-6xl lg:text-7xl font-light italic"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  en TikTok
                </motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-2xl md:text-3xl text-text-secondary max-w-5xl mx-auto leading-relaxed font-light"
                variants={fadeInUp}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                Más de{' '}
                <motion.span 
                  className="text-primary font-bold relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span className="relative z-10">10,000 creadores</motion.span>
                  <motion.div 
                    className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 0.8 }}
                  />
                </motion.span>
                {' '}ya están dominando con IA.{' '}
                <motion.span 
                  className="text-primary font-bold relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span className="relative z-10">¿Serás el siguiente?</motion.span>
                  <motion.div 
                    className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                  />
                </motion.span>
              </motion.p>
            </motion.div>

            {/* Stats showcase */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
              variants={stagger}
            >
              {testimonialStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center backdrop-blur-sm group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  variants={floatingAnimation}
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-2xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Revolutionary CTA Button */}
            <motion.div 
              variants={fadeInUp}
              className="space-y-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button 
                  size="lg"
                  onClick={() => window.open('https://preview--tool-tiktok.lovable.app/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired', '_blank')}
                  className="bg-gradient-primary hover:from-primary/90 hover:to-primary transition-all duration-300 px-16 py-6 text-xl font-bold rounded-3xl shadow-2xl shadow-primary/30 border border-primary/30 backdrop-blur-sm group relative overflow-hidden"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="mr-4"
                  >
                    <Brain className="w-7 h-7" />
                  </motion.div>
                  <span className="relative z-10">Comenzar Transformación</span>
                  <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
              </motion.div>
              
              {/* Trust indicators */}
              <motion.div 
                className="flex flex-wrap items-center justify-center gap-6 text-text-secondary/70 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>100% Seguro</span>
                </div>
                <div className="w-px h-4 bg-text-secondary/30" />
                <div className="flex items-center space-x-2">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span>Acceso Inmediato</span>
                </div>
                <div className="w-px h-4 bg-text-secondary/30" />
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span>Sin Compromiso</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <section className="border-t border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 py-12 px-6 relative overflow-hidden">
        {/* Footer background effects */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/3 via-transparent to-primary/3"
            animate={{ x: [-100, 100, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={stagger}
          >
            {/* Enhanced Brand */}
            <motion.div 
              className="flex items-center space-x-4"
              variants={slideInLeft}
            >
              <motion.div 
                className="relative w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                variants={floatingAnimation}
              >
                <Cpu className="w-7 h-7 text-white" />
                
                {/* Brand glow */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-30"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>
              
              <div>
                <motion.h3 
                  className="text-xl font-black text-text-primary"
                  whileHover={{ scale: 1.02 }}
                >
                  Viral<span className="bg-gradient-primary bg-clip-text text-transparent">Mind</span>
                </motion.h3>
                <div className="text-xs text-primary/80 font-medium">
                  AI-Powered Success
                </div>
              </div>
            </motion.div>
            
            {/* Enhanced Love Message */}
            <motion.div 
              className="flex items-center space-x-3 text-text-secondary text-base group"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-medium">Creado con</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-red-500 fill-current group-hover:text-red-400 transition-colors" />
              </motion.div>
              <span className="font-medium">para</span>
              <span className="text-primary font-bold">creadores visionarios</span>
            </motion.div>
            
            {/* Enhanced Copyright */}
            <motion.div 
              className="text-base text-text-secondary/80 font-medium"
              variants={slideInRight}
            >
              © 2024{' '}
              <span className="text-primary font-bold">ViralMind</span>
              . Futuro asegurado.
            </motion.div>
          </motion.div>
          
          {/* Enhanced Secret Login - Hidden but More Stylish */}
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <motion.button
              onClick={onGetStarted}
              className="relative text-text-muted/20 hover:text-primary/60 transition-all duration-500 text-lg font-black tracking-wider group"
              whileHover={{ scale: 1.1, letterSpacing: '0.3em' }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.span
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                •••
              </motion.span>
              
              {/* Hover effect */}
              <motion.div 
                className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 blur-lg rounded-lg"
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </motion.div>

          {/* Additional footer decoration */}
          <motion.div 
            className="flex items-center justify-center space-x-8 mt-8 pt-6 border-t border-primary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            {[Brain, Zap, Star, Award].map((Icon, index) => (
              <motion.div
                key={index}
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4 + index,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                <Icon className="w-4 h-4 text-primary/30" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </footer>
  );
};