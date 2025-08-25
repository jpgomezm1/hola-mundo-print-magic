import { motion } from 'framer-motion';
import { Video, Brain, MessageSquare, Zap, Target, Sparkles, CheckCircle, ArrowRight, Cpu, Database, Network, Lightbulb, TrendingUp, Shield, Rocket, Eye, BarChart3, Users, Clock } from 'lucide-react';

export const SolutionSection = () => {
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
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8, rotateY: -15 },
    animate: { opacity: 1, scale: 1, rotateY: 0 },
    transition: { duration: 0.8, ease: "backOut" }
  };

  const floatingAnimation = {
    animate: {
      y: [-8, 8, -8],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity
      }
    }
  };

  const aiTechnologies = [
    {
      icon: Video,
      title: "Análisis Inteligente",
      subtitle: "Computer Vision + NLP",
      description: "Nuestra IA analiza 15M+ videos exitosos en tiempo real, detectando patrones visuales, audio y engagement que garantizan viralidad",
      tech: "IA Visual Avanzada",
      features: [
        "Reconocimiento de elementos virales",
        "Análisis de tendencias en tiempo real", 
        "Predicción de timing óptimo",
        "Detección de hooks efectivos"
      ],
      stats: { accuracy: "94%", speed: "3.2s", data: "15M+" },
      color: "from-blue-500 via-cyan-500 to-blue-600",
      bgGradient: "from-blue-500/10 via-cyan-400/5 to-blue-500/10",
      iconBg: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Brain,
      title: "Conexiones Inteligentes",
      subtitle: "Deep Learning + Graph Neural Networks",
      description: "Algoritmos avanzados mapean conexiones entre contenido exitoso, identificando oportunidades ocultas que otros no ven",
      tech: "IA Predictiva Neuronal",
      features: [
        "Mapeo de contenido similar exitoso",
        "Identificación de nichos no saturados",
        "Predicción de engagement futuro",
        "Análisis de competencia inteligente"
      ],
      stats: { accuracy: "91%", speed: "1.8s", data: "50M+" },
      color: "from-green-500 via-emerald-500 to-green-600",
      bgGradient: "from-green-500/10 via-emerald-400/5 to-green-500/10",
      iconBg: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: MessageSquare,
      title: "Consejos Personalizados",
      subtitle: "GPT-4 + Custom Training",
      description: "IA conversacional entrenada específicamente en marketing de TikTok convierte datos complejos en estrategias claras y accionables",
      tech: "IA Conversacional Especializada",
      features: [
        "Explicaciones en lenguaje humano",
        "Consejos específicos por nicho",
        "Estrategias paso a paso",
        "Optimización continua personalizada"
      ],
      stats: { accuracy: "96%", speed: "0.9s", data: "2M+" },
      color: "from-purple-500 via-pink-500 to-purple-600",
      bgGradient: "from-purple-500/10 via-pink-400/5 to-purple-500/10",
      iconBg: "from-purple-500/20 to-pink-500/20"
    }
  ];

  const processSteps = [
    { 
      step: "1", 
      title: "Upload Instantáneo", 
      desc: "Pega tu link de TikTok y comienza el análisis", 
      icon: Video,
      time: "5 segundos",
      detail: "Extracción automática de metadata"
    },
    { 
      step: "2", 
      title: "Procesamiento IA", 
      desc: "15M+ videos analizados en tiempo real", 
      icon: Cpu,
      time: "3.2 segundos",
      detail: "Algoritmos de deep learning activos"
    },
    { 
      step: "3", 
      title: "Insights Accionables", 
      desc: "Estrategias específicas para tu contenido", 
      icon: Lightbulb,
      time: "Instantáneo",
      detail: "Recomendaciones personalizadas"
    }
  ];

  const capabilities = [
    { icon: Eye, label: "Análisis Visual", value: "15M+ videos", color: "blue" },
    { icon: BarChart3, label: "Predicción Engagement", value: "94% precisión", color: "green" },
    { icon: Users, label: "Audiencia Target", value: "50M+ perfiles", color: "purple" },
    { icon: TrendingUp, label: "Tendencias Live", value: "Tiempo real", color: "orange" }
  ];

  return (
    <section id="solucion" className="relative py-32 px-6 overflow-hidden">
      {/* Revolutionary Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary-50/5 to-background" />
        
        {/* AI-inspired animated elements */}
        <motion.div 
          className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-primary/8 via-cyan-500/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.8, 0.4],
            rotate: [0, 120, 240, 360]
          }}
          transition={{ 
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-green-500/8 via-emerald-400/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
            rotate: [360, 240, 120, 0]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />

        {/* Neural network pattern */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-primary/30 rounded-full"
              style={{
                left: `${10 + (i * 4)}%`,
                top: `${15 + (i * 3)}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Tech grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(var(--primary-rgb), 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(var(--primary-rgb), 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="space-y-28"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Revolutionary Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-10">
            <motion.div
              className="inline-flex items-center space-x-4 bg-gradient-to-r from-primary/15 via-cyan-500/10 to-green-500/15 border border-primary/30 rounded-full px-8 py-4 backdrop-blur-md shadow-xl"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(var(--primary-rgb), 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-primary font-bold text-lg">IA de Nueva Generación</span>
              <div className="w-px h-5 bg-primary/30" />
              <motion.span 
                className="text-primary/80 text-base font-medium"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Resultados Garantizados
              </motion.span>
            </motion.div>
            
            <div className="space-y-8">
              <motion.h2 
                className="text-7xl md:text-8xl lg:text-9xl font-black text-text-primary leading-[0.85] tracking-tighter"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                IA que{' '}
                <motion.span 
                  className="bg-gradient-to-r from-primary via-cyan-500 to-green-500 bg-clip-text text-transparent relative inline-block"
                  initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ delay: 0.7, duration: 1.2, ease: "backOut" }}
                  whileHover={{ scale: 1.05 }}
                >
                  Funciona
                  <motion.div 
                    className="absolute -bottom-4 left-0 right-0 h-2 bg-gradient-to-r from-primary via-cyan-500 to-green-500 rounded-full opacity-60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1.2 }}
                  />
                  {/* AI chip decoration */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-10 h-10 text-primary/60"
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Cpu className="w-full h-full" />
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
                  Analizamos{' '}
                  <motion.span 
                    className="text-primary font-bold relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span className="relative z-10">15 millones de videos</motion.span>
                    <motion.div 
                      className="absolute inset-x-0 bottom-1 h-4 bg-primary/20 rounded-sm -z-0"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 1.8, duration: 1 }}
                    />
                  </motion.span>
                  {' '}exitosos para darte la{' '}
                  <motion.span 
                    className="text-green-500 font-bold relative inline-block"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.span className="relative z-10">fórmula exacta del éxito</motion.span>
                    <motion.div 
                      className="absolute inset-x-0 bottom-1 h-4 bg-green-500/20 rounded-sm -z-0"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 2.2, duration: 1 }}
                    />
                  </motion.span>
                </p>
                
                {/* Live capabilities showcase */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12"
                  variants={stagger}
                >
                  {capabilities.map((capability, index) => (
                    <motion.div 
                      key={index}
                      className={`bg-gradient-to-br from-${capability.color}-500/10 to-${capability.color}-400/5 border border-${capability.color}-500/20 rounded-2xl p-4 text-center`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + (index * 0.1), duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <capability.icon className={`w-6 h-6 text-${capability.color}-500 mx-auto mb-2`} />
                      <div className={`text-sm font-bold text-${capability.color}-500`}>{capability.value}</div>
                      <div className="text-xs text-text-secondary">{capability.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Revolutionary Technology Grid */}
          <motion.div 
            className="grid lg:grid-cols-3 gap-10"
            variants={stagger}
          >
            {aiTechnologies.map((tech, index) => (
              <motion.div 
                key={index}
                className={`relative bg-gradient-to-br ${tech.bgGradient} border border-primary/20 rounded-3xl p-10 space-y-8 group overflow-hidden backdrop-blur-sm hover:border-primary/40 transition-all duration-700`}
                variants={scaleIn}
                whileHover={{ scale: 1.02, y: -8 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Advanced background effects */}
                <div className={`absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br ${tech.color} opacity-5 rounded-full blur-3xl group-hover:scale-150 group-hover:opacity-10 transition-all duration-1000`} />
                
                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-1 h-1 bg-gradient-to-r ${tech.color} rounded-full opacity-30`}
                    style={{
                      left: `${20 + (i * 15)}%`,
                      top: `${30 + (i * 10)}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      opacity: [0.2, 0.6, 0.2],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
                
                <div className="relative z-10">
                  {/* Enhanced icon with stats */}
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className={`relative w-20 h-20 bg-gradient-to-br ${tech.iconBg} rounded-3xl flex items-center justify-center shadow-2xl border border-primary/20`}
                      whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      variants={floatingAnimation}
                    >
                      <tech.icon className="w-10 h-10 text-primary" />
                      
                      {/* Tech indicator */}
                      <motion.div 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </motion.div>
                    </motion.div>

                    {/* Live stats */}
                    <div className="text-right space-y-1">
                      <div className="text-xs text-text-secondary">Precisión</div>
                      <div className="text-lg font-bold text-green-500">{tech.stats.accuracy}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-black text-text-primary group-hover:text-primary transition-colors">
                        {tech.title}
                      </h3>
                      <div className="text-sm text-primary/80 font-medium mt-1">
                        {tech.subtitle}
                      </div>
                    </div>
                    
                    <p className="text-text-secondary leading-relaxed text-base">
                      {tech.description}
                    </p>
                    
                    {/* Performance metrics */}
                    <div className="flex items-center space-x-4 text-xs text-text-muted">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span>{tech.stats.speed}</span>
                      </div>
                      <div className="w-px h-3 bg-text-muted/30" />
                      <div className="flex items-center space-x-1">
                        <Database className="w-3 h-3 text-blue-500" />
                        <span>{tech.stats.data}</span>
                      </div>
                    </div>
                    
                    {/* Enhanced features */}
                    <div className="space-y-3 pt-4 border-t border-primary/10">
                      {tech.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-3 text-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index * 0.3) + (featureIndex * 0.1) }}
                        >
                          <motion.div 
                            className="w-2 h-2 bg-gradient-to-r from-primary to-cyan-500 rounded-full flex-shrink-0"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.3 }}
                          />
                          <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Tech badge */}
                    <motion.div 
                      className={`inline-flex items-center space-x-2 bg-gradient-to-r ${tech.color} bg-opacity-10 border border-primary/20 rounded-full px-4 py-2 text-xs font-bold text-primary`}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Cpu className="w-3 h-3" />
                      <span>{tech.tech}</span>
                    </motion.div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Revolutionary Process Section */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            <motion.div 
              className="bg-gradient-to-br from-primary/10 via-primary/5 to-cyan-500/10 border-2 border-primary/20 rounded-4xl p-12 backdrop-blur-sm relative overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background tech pattern */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5"
                  animate={{ x: [-200, 200, -200] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="relative z-10 space-y-12">
                <div className="text-center">
                  <motion.h3 
                    className="text-4xl md:text-5xl font-black text-text-primary mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    Proceso{' '}
                    <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                      Ultra-Rápido
                    </span>
                  </motion.h3>
                  <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                    De video a estrategia viral en menos de{' '}
                    <span className="text-primary font-bold">10 segundos</span>
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {processSteps.map((step, index) => (
                    <motion.div 
                      key={index}
                      className="relative text-center space-y-6 group"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + (index * 0.15), duration: 0.8 }}
                    >
                      {/* Connection line */}
                      {index < processSteps.length - 1 && (
                        <motion.div 
                          className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary via-primary/50 to-transparent -translate-y-1/2 z-0"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 1 + (index * 0.3), duration: 0.8 }}
                        />
                      )}
                      
                      <div className="relative">
                        {/* Step number with enhanced styling */}
                        <motion.div 
                          className="relative w-16 h-16 bg-gradient-to-br from-primary via-primary/80 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary/30 border border-primary/20"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          variants={floatingAnimation}
                        >
                          <span className="text-white font-black text-xl">{step.step}</span>
                          
                          {/* Processing indicator */}
                          <motion.div 
                            className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>

                        {/* Tech icon */}
                        <motion.div 
                          className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mx-auto mb-4"
                          whileHover={{ scale: 1.1 }}
                        >
                          <step.icon className="w-6 h-6 text-primary" />
                        </motion.div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                          {step.title}
                        </h4>
                        <p className="text-text-secondary text-base leading-relaxed">
                          {step.desc}
                        </p>
                        
                        {/* Performance metrics */}
                        <div className="space-y-2">
                          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                            <Clock className="w-3 h-3" />
                            <span>{step.time}</span>
                          </div>
                          <div className="text-xs text-text-muted">
                            {step.detail}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Call to action hint */}
                <motion.div 
                  className="text-center pt-8 border-t border-primary/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2, duration: 0.8 }}
                >
                  <motion.div 
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-500/15 to-primary/15 border border-green-500/30 rounded-full px-6 py-3 text-green-600 font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield className="w-5 h-5" />
                    <span>100% Automatizado • 0% Esfuerzo Manual</span>
                    <Rocket className="w-5 h-5" />
                  </motion.div>
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