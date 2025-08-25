import { motion } from 'framer-motion';
import { Zap, Target, Users, Eye, BarChart3, Sparkles, TrendingUp, Brain, Video, MessageSquare } from 'lucide-react';

export const FeaturesSection = () => {
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

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const features = [
    { 
      icon: Zap, 
      title: "Análisis de Viralidad", 
      description: "Descubre qué hace que un video se vuelva viral con análisis profundo de patrones",
      highlight: "IA Avanzada"
    },
    { 
      icon: Target, 
      title: "Generación de Ideas", 
      description: "Sugerencias personalizadas basadas en tendencias actuales y tu audiencia",
      highlight: "Personalizado"
    },
    { 
      icon: Users, 
      title: "Insights de Audiencia", 
      description: "Comprende profundamente a tu audiencia objetivo y sus preferencias",
      highlight: "Data-Driven"
    },
    { 
      icon: Eye, 
      title: "Optimización de Contenido", 
      description: "Mejora videos existentes con recomendaciones precisas basadas en IA",
      highlight: "Mejora Continua"
    },
    { 
      icon: BarChart3, 
      title: "Analytics Avanzados", 
      description: "Dashboards completos con métricas que realmente importan para el crecimiento",
      highlight: "ROI Medible"
    },
    { 
      icon: Sparkles, 
      title: "Predicción Viral", 
      description: "Evalúa el potencial viral de tu contenido antes de publicarlo",
      highlight: "Prevención"
    }
  ];

  const benefits = [
    { 
      icon: TrendingUp, 
      title: "3x Más Engagement", 
      description: "Aumenta el engagement promedio de tus videos",
      stat: "+300%"
    },
    { 
      icon: Brain, 
      title: "95% Precisión", 
      description: "Predicciones precisas sobre el potencial viral",
      stat: "95%"
    },
    { 
      icon: Video, 
      title: "10M+ Videos", 
      description: "Base de datos masiva para análisis comparativo",
      stat: "10M+"
    },
    { 
      icon: MessageSquare, 
      title: "24/7 Análisis", 
      description: "Monitoreo y análisis continuo en tiempo real",
      stat: "24/7"
    }
  ];

  return (
    <section className="py-24 px-4 bg-navy-light/30 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, 100, 0]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="space-y-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          {/* Header */}
          <motion.div className="text-center space-y-6" variants={fadeInUp}>
            <motion.div 
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Herramientas Profesionales</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              Todo lo que{' '}
              <motion.span 
                className="bg-gradient-primary bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Necesitas
              </motion.span>
            </h2>
            
            <p className="text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              Herramientas profesionales para <strong className="text-primary">dominar completamente TikTok</strong> y 
              convertir tu contenido en un motor de crecimiento
            </p>
          </motion.div>
          
          {/* Features Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={stagger}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={scaleIn}
                whileHover={{ y: -10 }}
              >
                <div className="bg-card border border-border rounded-2xl p-8 space-y-6 h-full group-hover:border-primary/50 transition-all duration-300 relative overflow-hidden">
                  {/* Hover gradient */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <motion.div 
                        className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        whileHover={{ rotate: 10 }}
                      >
                        <feature.icon className="w-7 h-7 text-text-primary" />
                      </motion.div>
                      
                      <motion.span 
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                      >
                        {feature.highlight}
                      </motion.span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-text-primary group-hover:text-primary transition-colors mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Section */}
          <motion.div 
            className="bg-gradient-to-br from-card/80 to-primary/5 border border-primary/20 rounded-3xl p-12"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center space-y-12">
              <h3 className="text-3xl md:text-4xl font-bold text-text-primary">
                Resultados <span className="text-success">Comprobados</span>
              </h3>
              
              <motion.div 
                className="grid md:grid-cols-4 gap-8"
                variants={stagger}
              >
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="text-center space-y-4 group"
                    variants={scaleIn}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div 
                      className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 15 }}
                    >
                      <benefit.icon className="w-8 h-8 text-text-primary" />
                    </motion.div>
                    
                    <motion.div 
                      className="text-3xl font-bold text-primary"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5, type: "spring" }}
                    >
                      {benefit.stat}
                    </motion.div>
                    
                    <h4 className="text-lg font-semibold text-text-primary">{benefit.title}</h4>
                    <p className="text-text-secondary text-sm">{benefit.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};