import { motion } from 'framer-motion';
import { Zap, Target, Users, Eye, BarChart3, Sparkles, TrendingUp, Brain, Video, MessageSquare, Star, Award, CheckCircle, ArrowRight, Cpu, Database, Shield, Rocket, Clock, LineChart } from 'lucide-react';

export const FeaturesSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -80 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 80 },
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

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8, rotateY: -15 },
    animate: { opacity: 1, scale: 1, rotateY: 0 },
    transition: { duration: 0.7, ease: "backOut" }
  };

  const floatingAnimation = {
    animate: {
      y: [-6, 6, -6],
      rotate: [0, 3, 0, -3, 0],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    { 
      icon: Zap, 
      title: "Análisis de Viralidad", 
      description: "IA avanzada decodifica elementos virales analizando millones de videos exitosos en tiempo real para identificar patrones únicos",
      highlight: "IA Avanzada",
      metrics: { accuracy: "96%", speed: "2.1s", data: "15M+" },
      color: "from-primary/20 to-primary/10"
    },
    { 
      icon: Target, 
      title: "Generación de Ideas", 
      description: "Algoritmos predictivos crean sugerencias ultra-personalizadas basadas en tu nicho, audiencia y tendencias emergentes",
      highlight: "Personalizado",
      metrics: { accuracy: "91%", speed: "1.8s", data: "5M+" },
      color: "from-primary/20 to-primary/10"
    },
    { 
      icon: Users, 
      title: "Insights de Audiencia", 
      description: "Deep learning mapea comportamientos de tu audiencia objetivo revelando preferencias ocultas y momentos de engagement",
      highlight: "Data-Driven",
      metrics: { accuracy: "94%", speed: "3.2s", data: "50M+" },
      color: "from-primary/20 to-primary/10"
    },
    { 
      icon: Eye, 
      title: "Optimización de Contenido", 
      description: "Computer vision analiza cada frame para sugerir mejoras específicas que maximizan retención y engagement",
      highlight: "Mejora Continua",
      metrics: { accuracy: "89%", speed: "4.1s", data: "2M+" },
      color: "from-primary/20 to-primary/10"
    },
    { 
      icon: BarChart3, 
      title: "Analytics Avanzados", 
      description: "Dashboards inteligentes con métricas predictivas que revelan oportunidades de crecimiento antes que la competencia",
      highlight: "ROI Medible",
      metrics: { accuracy: "97%", speed: "0.9s", data: "100M+" },
      color: "from-primary/20 to-primary/10"
    },
    { 
      icon: Sparkles, 
      title: "Predicción Viral", 
      description: "Neural networks evalúan potencial viral con precisión científica antes de publicar, ahorrando tiempo y recursos",
      highlight: "Prevención",
      metrics: { accuracy: "93%", speed: "1.2s", data: "25M+" },
      color: "from-primary/20 to-primary/10"
    }
  ];

  const benefits = [
    { 
      icon: TrendingUp, 
      title: "Engagement Explosivo", 
      description: "Incremento promedio del engagement orgánico",
      stat: "+500%",
      detail: "vs. métodos tradicionales",
      trend: "↗️ +47% este mes"
    },
    { 
      icon: Brain, 
      title: "Precisión IA", 
      description: "Predicciones verificadas sobre potencial viral",
      stat: "96.2%",
      detail: "precisión comprobada",
      trend: "🎯 Top 1% industria"
    },
    { 
      icon: Video, 
      title: "Base de Datos", 
      description: "Videos analizados para insights comparativos",
      stat: "15M+",
      detail: "actualizados diariamente",
      trend: "📈 +50K diarios"
    },
    { 
      icon: Clock, 
      title: "Velocidad IA", 
      description: "Análisis completo en tiempo récord",
      stat: "2.3s",
      detail: "promedio de procesamiento",
      trend: "⚡ 10x más rápido"
    }
  ];

  const proFeatures = [
    { icon: Shield, label: "Análisis Competencia", status: "Exclusivo" },
    { icon: Rocket, label: "Predicción Tendencias", status: "IA Avanzada" },
    { icon: Database, label: "Datos en Tiempo Real", status: "Live" },
    { icon: Award, label: "Insights Personalizados", status: "Pro" }
  ];

  return (
    <section id="herramientas" className="relative py-32 px-6 overflow-hidden">
      {/* Advanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-background to-primary/3" />
        
        {/* Feature-focused animated elements */}
        <motion.div 
          className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-br from-primary/6 via-primary/3 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 180, 270, 360]
          }}
          transition={{ 
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-primary/4 via-primary/2 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [360, 270, 180, 90, 0]
          }}
          transition={{ 
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />

        {/* Feature connection lines */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-primary/20 rounded-full"
              style={{
                left: `${15 + (i * 5)}%`,
                top: `${20 + (i * 4)}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Tech grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary-rgb), 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary-rgb), 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '120px 120px'
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="space-y-32"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Revolutionary Header */}
          <motion.div className="text-center space-y-12" variants={fadeInUp}>
            <motion.div
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/15 border border-primary/30 rounded-full px-8 py-4 backdrop-blur-md shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(var(--primary-rgb), 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-primary font-bold text-lg">Arsenal Completo</span>
              <div className="w-px h-5 bg-primary/30" />
              <motion.span 
                className="text-primary/80 text-base font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Herramientas Pro
              </motion.span>
            </motion.div>
            
            <div className="space-y-8">
              <motion.h2 
                className="text-7xl md:text-8xl lg:text-9xl font-black text-text-primary leading-[0.85] tracking-tighter"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                Todo lo que{' '}
                <motion.span 
                  className="bg-gradient-primary bg-clip-text text-transparent relative inline-block"
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.7, duration: 1.2, ease: "backOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  Necesitas
                  <motion.div 
                    className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-primary rounded-full opacity-60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1.2 }}
                  />
                  {/* Tools icon decoration */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-10 h-10 text-primary/60"
                    animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                  >
                    <Award className="w-full h-full" />
                  </motion.div>
                </motion.span>
              </motion.h2>
              
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <p className="text-2xl md:text-3xl lg:text-4xl text-text-secondary max-w-6xl mx-auto leading-relaxed font-light">
                  Suite completa de herramientas para{' '}
                  <motion.span 
                    className="text-primary font-bold relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span className="relative z-10">dominar TikTok</motion.span>
                    <motion.div 
                      className="absolute inset-x-0 bottom-1 h-4 bg-primary/20 rounded-sm -z-0"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.8, duration: 1 }}
                    />
                  </motion.span>
                  {' '}desde el{' '}
                  <motion.span 
                    className="text-primary font-bold relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span className="relative z-10">primer día</motion.span>
                    <motion.div 
                      className="absolute inset-x-0 bottom-1 h-4 bg-primary/20 rounded-sm -z-0"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 2.2, duration: 1 }}
                    />
                  </motion.span>
                </p>

                {/* Pro features showcase */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
                  variants={stagger}
                >
                  {proFeatures.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 text-center backdrop-blur-sm group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + (index * 0.1), duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <feature.icon className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <div className="text-xs font-bold text-primary mb-1">{feature.status}</div>
                      <div className="text-xs text-text-secondary">{feature.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Revolutionary Features Grid */}
          <motion.div 
            className="grid md:grid-cols-2 xl:grid-cols-3 gap-10"
            variants={stagger}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`relative bg-gradient-to-br ${feature.color} border border-primary/20 rounded-3xl p-8 space-y-6 group overflow-hidden backdrop-blur-sm hover:border-primary/40 transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10`}
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Advanced background effects */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-primary opacity-5 rounded-full blur-3xl group-hover:scale-150 group-hover:opacity-10 transition-all duration-1000" />
                
                {/* Floating particles */}
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-gradient-primary rounded-full opacity-30"
                    style={{
                      left: `${25 + (i * 20)}%`,
                      top: `${35 + (i * 15)}%`,
                    }}
                    animate={{
                      y: [-8, 8, -8],
                      opacity: [0.2, 0.5, 0.2],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.4
                    }}
                  />
                ))}
                
                <div className="relative z-10">
                  {/* Enhanced header */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className="relative w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-xl border border-primary/20"
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      variants={floatingAnimation}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                      
                      {/* Status indicator */}
                      <motion.div 
                        className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-2 h-2 text-white" />
                      </motion.div>
                    </motion.div>

                    {/* Highlight badge */}
                    <motion.div 
                      className="bg-gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      {feature.highlight}
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-text-primary group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-text-secondary leading-relaxed text-base">
                      {feature.description}
                    </p>
                    
                    {/* Performance metrics */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary/10">
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary">{feature.metrics.accuracy}</div>
                        <div className="text-xs text-text-muted">Precisión</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary">{feature.metrics.speed}</div>
                        <div className="text-xs text-text-muted">Velocidad</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary">{feature.metrics.data}</div>
                        <div className="text-xs text-text-muted">Datos</div>
                      </div>
                    </div>

                    {/* Action hint */}
                    <motion.div 
                      className="flex items-center space-x-2 text-primary/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                    >
                      <span>Explorar función</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Revolutionary Results Section */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            <motion.div 
              className="bg-gradient-to-br from-primary/15 via-primary/8 to-primary/15 border-2 border-primary/30 rounded-4xl p-16 backdrop-blur-sm relative overflow-hidden"
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background tech effects */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
                  animate={{ x: [-300, 300, -300] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Success particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary/30 rounded-full"
                    style={{
                      left: `${10 + (i * 10)}%`,
                      top: `${20 + (i * 8)}%`,
                    }}
                    animate={{
                      y: [-15, 15, -15],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.5, 1.2, 0.5]
                    }}
                    transition={{
                      duration: 4 + i * 0.3,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 space-y-16">
                {/* Header */}
                <div className="text-center space-y-6">
                  <motion.h3 
                    className="text-5xl md:text-6xl font-black text-text-primary mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    Resultados{' '}
                    <motion.span 
                      className="bg-gradient-primary bg-clip-text text-transparent relative"
                      whileHover={{ scale: 1.05 }}
                    >
                      Verificados
                      <motion.div 
                        className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-primary rounded-full opacity-60"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                      />
                    </motion.span>
                  </motion.h3>
                  
                  <motion.p 
                    className="text-xl text-text-secondary max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Datos reales de{' '}
                    <span className="text-primary font-bold">miles de creadores</span>{' '}
                    que ya dominan TikTok
                  </motion.p>
                </div>
                
                {/* Enhanced benefits grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      className="relative text-center space-y-4 bg-gradient-to-br from-white/5 to-white/2 rounded-2xl p-6 border border-primary/20 group hover:border-primary/40 transition-all duration-500"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.8 }}
                      whileHover={{ scale: 1.03, y: -5 }}
                    >
                      {/* Icon with enhanced styling */}
                      <motion.div 
                        className="relative w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-xl"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.8 }}
                        variants={floatingAnimation}
                      >
                        <benefit.icon className="w-8 h-8 text-white" />
                        
                        {/* Glow effect */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-primary rounded-2xl blur-lg opacity-30"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />
                      </motion.div>
                      
                      <div className="space-y-3">
                        {/* Main stat with animation */}
                        <motion.div 
                          className="text-4xl md:text-5xl font-black text-primary"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        >
                          {benefit.stat}
                        </motion.div>
                        
                        <h4 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                          {benefit.title}
                        </h4>
                        
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                        
                        {/* Additional metrics */}
                        <div className="space-y-2 pt-3 border-t border-primary/10">
                          <div className="text-xs text-primary/80 font-medium">
                            {benefit.detail}
                          </div>
                          <div className="text-xs text-primary font-bold">
                            {benefit.trend}
                          </div>
                        </div>
                      </div>

                      {/* Background decoration */}
                      <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-primary opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    </motion.div>
                  ))}
                </div>

                {/* Trust indicators */}
                <motion.div 
                  className="text-center pt-8 border-t border-primary/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                >
                  <div className="flex flex-wrap items-center justify-center gap-6 text-text-secondary/80 text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-primary fill-current" />
                      <span>Verificado por +10K creadores</span>
                    </div>
                    <div className="w-px h-4 bg-text-secondary/30" />
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span>Datos 100% reales</span>
                    </div>
                    <div className="w-px h-4 bg-text-secondary/30" />
                    <div className="flex items-center space-x-2">
                      <LineChart className="w-4 h-4 text-primary" />
                      <span>Actualizado en tiempo real</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none" />
    </section>
  );
};