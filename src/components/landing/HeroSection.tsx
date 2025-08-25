import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, PlayCircle, TrendingUp, Zap } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const fadeInScale = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-navy-light/5">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Main gradient orbs */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-primary/8 via-primary/4 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-primary/6 via-primary/3 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
            rotate: [360, 180, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary-rgb), 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary-rgb), 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-20 relative z-10">
        <motion.div 
          className="text-center space-y-20"
          initial="initial"
          animate="animate"
          variants={stagger}
        >
          {/* Enhanced Badge with metrics */}
          <motion.div variants={fadeInUp}>
            <div className="flex flex-col items-center space-y-4">
              <motion.div 
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary/10 via-primary/8 to-primary/10 border border-primary/30 rounded-full px-6 py-3 backdrop-blur-md shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(var(--primary-rgb), 0.2)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="text-primary font-semibold text-base">Powered by AI</span>

              </motion.div>
              
              {/* Social proof indicators */}
              
            </div>
          </motion.div>
          
          {/* Revolutionary Typography */}
          <motion.div className="space-y-10" variants={fadeInUp}>
            <div className="relative">
              <motion.h1 
                className="text-6xl md:text-8xl lg:text-9xl font-black text-text-primary leading-[0.85] tracking-tighter"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                Sé{' '}
                <motion.span 
                  className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent relative inline-block"
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.5, duration: 1, ease: "backOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  Viral
                  <motion.div 
                    className="absolute -bottom-3 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 0.8 }}
                    transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                  />
                  {/* Sparkle effects */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 text-primary/60"
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Sparkles className="w-full h-full" />
                  </motion.div>
                </motion.span>
                <br />
                <motion.span 
                  className="text-text-secondary/70 text-5xl md:text-7xl lg:text-8xl font-light italic"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Consistentemente
                </motion.span>
              </motion.h1>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -top-10 left-1/4 w-20 h-20 border-2 border-primary/20 rounded-full"
                variants={floatingAnimation}
              />
              <motion.div 
                className="absolute -bottom-10 right-1/4 w-16 h-16 border border-primary/30 rounded-lg rotate-45"
                variants={floatingAnimation}
                transition={{ delay: 2 }}
              />
            </div>
            
            <motion.div 
              className="relative max-w-5xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-text-secondary/90 leading-relaxed font-light">
                En la era de la IA, la guerra es por la{' '}
                <motion.span 
                  className="text-primary font-semibold relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span
                    className="relative z-10"
                    initial={{ color: "rgb(var(--text-secondary-rgb))" }}
                    animate={{ color: "rgb(var(--primary-rgb))" }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    atención
                  </motion.span>
                  <motion.div 
                    className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.7, duration: 0.8 }}
                  />
                </motion.span>
                .
              </p>
              <br />
              <p className="text-xl md:text-2xl lg:text-3xl text-text-secondary/90 leading-relaxed font-light">
                Domina TikTok con inteligencia artificial y convierte cada video en una{' '}
                <motion.span 
                  className="text-primary font-semibold relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span
                    className="relative z-10"
                    initial={{ color: "rgb(var(--text-secondary-rgb))" }}
                    animate={{ color: "rgb(var(--primary-rgb))" }}
                    transition={{ delay: 2, duration: 0.5 }}
                  >
                    oportunidad de negocio
                  </motion.span>
                  <motion.div 
                    className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 2.2, duration: 0.8 }}
                  />
                </motion.span>
                .
              </p>
            </motion.div>
          </motion.div>
          
          {/* Revolutionary CTA Section */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {/* Main CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button 
                  size="lg"
                  onClick={() => window.open('https://tool-tiktok.lovable.app/dashboard#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IitZSVR2VzJQMGw0aldDRFoiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x2ZGltdGllZmJqZ2x5d29rbmNyLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhNTg3ZmM4OC01MjI5LTRlZGEtYTA4Zi1kMTEzMzdmNjIyMzEiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzU2MjIwMDAxLCJpYXQiOjE3NTYxMzMwMDEsImVtYWlsIjoianBnb21lekBzdGF5aXJyZWxldmFudC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImRpc3BsYXlfbmFtZSI6ImlycmVsZXZhbnQgY2x1YiIsImVtYWlsIjoianBnb21lekBzdGF5aXJyZWxldmFudC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJhNTg3ZmM4OC01MjI5LTRlZGEtYTA4Zi1kMTEzMzdmNjIyMzEifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvdHAiLCJ0aW1lc3RhbXAiOjE3NTYxMzMwMDF9XSwic2Vzc2lvbl9pZCI6IjNjYmNiYmJlLWRlOGItNDFmOC1iMGM3LTZiYmU5NGU4OGI1YSIsImlzX2Fub255bW91cyI6ZmFsc2V9.qNnuRI4oczhULVstfVyHt9qc3XpkcIhiCNK6UTvbRko&expires_at=1756220001&expires_in=86400&refresh_token=crxt6abqlrj5&token_type=bearer&type=magiclink', '_blank')}
                  className="bg-gradient-to-r from-primary via-primary/90 to-primary hover:from-primary/90 hover:to-primary transition-all duration-300 px-12 py-5 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/25 border border-primary/30 backdrop-blur-sm group relative overflow-hidden"
                >
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                  <span className="relative z-10">Explora la Herramienta</span>
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >

              </motion.div>
            </div>
            
            
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
};