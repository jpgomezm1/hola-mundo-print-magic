import { motion } from 'framer-motion';
import { Target, BarChart3, Brain, AlertTriangle, TrendingDown, Users, Eye, Clock, DollarSign, Zap, ArrowDown, X } from 'lucide-react';

export const ProblemSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const slideInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const slideInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
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
    transition: { duration: 0.6, ease: "backOut" }
  };

  const pulseAnimation = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const problems = [
    {
      icon: TrendingDown,
      title: "Contenido Inconsistente",
      description: "Solo 1 de cada 10 videos logra el engagement esperado",
      stat: "90% fracasa",
      detailedStat: "9/10 videos",
      color: "red",
      bgGradient: "from-red-500/10 via-red-400/5 to-transparent",
      borderColor: "red-500/30",
      textColor: "red-500",
      impact: "Pérdida de tiempo y recursos"
    },
    {
      icon: Brain,
      title: "Falta de Insights",
      description: "Imposible saber qué funciona sin análisis profundo de datos",
      stat: "0 datos útiles",
      detailedStat: "Sin analytics",
      color: "orange",
      bgGradient: "from-orange-500/10 via-orange-400/5 to-transparent",
      borderColor: "orange-500/30",
      textColor: "orange-500",
      impact: "Decisiones a ciegas"
    },
    {
      icon: Users,
      title: "Competencia Brutal",
      description: "Millones de creadores compiten por la misma audiencia limitada",
      stat: "1B+ videos/día",
      detailedStat: "Saturación total",
      color: "amber",
      bgGradient: "from-amber-500/10 via-amber-400/5 to-transparent",
      borderColor: "amber-500/30",
      textColor: "amber-500",
      impact: "Visibilidad casi nula"
    }
  ];

  const painPoints = [
    { icon: Clock, text: "Horas perdidas creando contenido que nadie ve", value: "40h/sem" },
    { icon: DollarSign, text: "Inversión en marketing sin retorno medible", value: "$5K+" },
    { icon: Eye, text: "Audiencia que no se convierte en clientes", value: "95%" },
    { icon: TrendingDown, text: "Alcance orgánico en caída libre", value: "-60%" }
  ];

  return (
    <section id="problema" className="relative py-32 px-6 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-red-950/5 to-background" />
        
        {/* Animated warning patterns */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-red-500/5 via-orange-500/3 to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Danger indicators */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400/40 rounded-full"
            style={{
              left: `${15 + (i * 7)}%`,
              top: `${20 + (i * 6)}%`,
            }}
            animate={{
              y: [-30, 30, -30],
              opacity: [0.2, 0.7, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 3 + i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}

        {/* Warning grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(239, 68, 68, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(239, 68, 68, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="space-y-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Impactful Header */}
          <motion.div variants={fadeInUp} className="text-center space-y-8">
            <motion.div
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-500/15 via-orange-500/10 to-amber-500/15 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-md shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(239, 68, 68, 0.2)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div variants={pulseAnimation}>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </motion.div>
              <span className="text-red-500 font-bold text-base">La Dura Realidad</span>
              <div className="w-px h-4 bg-red-500/30" />
              <span className="text-red-400 text-sm font-medium">Datos Reales</span>
            </motion.div>
            
            <div className="space-y-6">
              <motion.h2 
                className="text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[0.9] tracking-tight"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              >
                La Realidad es{' '}
                <motion.span 
                  className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Brutal
                  <motion.div 
                    className="absolute -bottom-3 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-500 to-red-600 rounded-full opacity-60"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                  />
                  {/* Warning icon */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 text-red-500/60"
                    animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-full h-full" />
                  </motion.div>
                </motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-2xl md:text-3xl text-text-secondary max-w-5xl mx-auto leading-relaxed font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                En un mundo donde millones compiten por la atención,{' '}
                <motion.span 
                  className="text-red-500 font-bold relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.span className="relative z-10">90% del contenido fracasa</motion.span>
                  <motion.div 
                    className="absolute inset-x-0 bottom-1 h-3 bg-red-500/20 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.3, duration: 0.8 }}
                  />
                </motion.span>
                {' '}sin datos que lo respalden
              </motion.p>
            </div>
          </motion.div>

          {/* Shocking Statistics Bar */}
          <motion.div 
            className="bg-gradient-to-r from-red-900/20 via-red-800/10 to-red-900/20 border border-red-500/20 rounded-3xl p-8 backdrop-blur-sm"
            variants={fadeInUp}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {painPoints.map((point, index) => (
                <motion.div 
                  key={index}
                  className="space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1), duration: 0.6 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                  >
                    <point.icon className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">{point.value}</div>
                    <div className="text-sm text-text-secondary font-medium">{point.text}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Enhanced Problems Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
          >
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                className={`relative bg-gradient-to-br ${problem.bgGradient} border border-${problem.borderColor} rounded-3xl p-8 space-y-6 hover:border-${problem.textColor} transition-all duration-500 group overflow-hidden`}
                variants={scaleIn}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Background decoration */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-${problem.textColor}/5 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                
                {/* Icon with enhanced styling */}
                <motion.div 
                  className={`relative w-16 h-16 bg-gradient-to-br from-${problem.textColor}/20 to-${problem.textColor}/10 rounded-2xl flex items-center justify-center shadow-lg`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <problem.icon className={`w-8 h-8 text-${problem.textColor}`} />
                  
                  {/* Warning indicator */}
                  <motion.div 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <X className="w-2 h-2 text-white" />
                  </motion.div>
                </motion.div>
                
                <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-bold text-text-primary group-hover:text-text-primary/90 transition-colors">
                    {problem.title}
                  </h3>
                  
                  <p className="text-text-secondary leading-relaxed text-base">
                    {problem.description}
                  </p>
                  
                  {/* Enhanced stats */}
                  <div className="space-y-3">
                    <div className={`inline-flex items-center space-x-2 bg-${problem.textColor}/15 text-${problem.textColor} font-bold px-4 py-2 rounded-full text-sm border border-${problem.textColor}/30`}>
                      <TrendingDown className="w-4 h-4" />
                      <span>{problem.stat}</span>
                    </div>
                    
                    <div className={`text-${problem.textColor} font-semibold text-sm opacity-80`}>
                      💥 {problem.impact}
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-t from-${problem.textColor}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Dramatic Impact Statement */}
          <motion.div 
            className="relative"
            variants={fadeInUp}
          >
            {/* Arrow pointing down */}
            <motion.div 
              className="text-center mb-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="w-12 h-12 text-red-500/60 mx-auto" />
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-red-950/40 via-red-900/20 to-red-950/40 border-2 border-red-500/30 rounded-3xl p-12 max-w-6xl mx-auto relative overflow-hidden backdrop-blur-sm"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Background effects */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5"
                  animate={{ x: [-100, 100, -100] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>

              <div className="relative z-10 text-center space-y-8">
                <motion.h3 
                  className="text-3xl md:text-4xl font-black text-text-primary leading-tight"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  Sin análisis inteligente, estás{' '}
                  <motion.span 
                    className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    perdiendo oportunidades
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5, duration: 1 }}
                    />
                  </motion.span>
                </motion.h3>
                
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <p className="text-xl text-text-secondary leading-relaxed">
                      El mercado de marketing digital mueve{' '}
                      <span className="text-green-400 font-bold text-2xl">$1.8 billones</span> al año.
                    </p>
                    <motion.div 
                      className="text-red-500 font-bold text-lg"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ⚠️ ¿Cuánto de eso estás capturando?
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-xl text-text-secondary leading-relaxed">
                      Mientras tú luchas a ciegas, otros usan{' '}
                      <span className="text-primary font-bold">datos e IA</span> para dominar.
                    </p>
                    <motion.div 
                      className="text-orange-500 font-bold text-lg"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      🔥 El tiempo se agota cada segundo
                    </motion.div>
                  </div>
                </div>

                {/* Urgency indicator */}
                <motion.div 
                  className="inline-flex items-center space-x-2 bg-red-500/20 border border-red-500/40 rounded-full px-6 py-3 text-red-400 font-bold"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Zap className="w-5 h-5" />
                  <span>Cada día perdido = Menos market share</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
};