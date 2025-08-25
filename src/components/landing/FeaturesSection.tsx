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
    <section id="herramientas" className="py-20 px-6 bg-navy-light/5">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="space-y-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Clean Header */}
          <motion.div className="text-center space-y-6" variants={fadeInUp}>
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Herramientas Profesionales</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-text-primary">
              Todo lo que{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Necesitas
              </span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              Herramientas completas para{' '}
              <span className="text-primary font-semibold">dominar TikTok</span> desde el primer día
            </p>
          </motion.div>
          
          {/* Clean Features Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-card/40 border border-border/40 rounded-2xl p-6 space-y-4 hover:border-primary/30 transition-all duration-300"
                variants={scaleIn}
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-text-primary" />
                  </div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {feature.highlight}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-text-primary">
                  {feature.title}
                </h3>
                
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Results Section */}
          <motion.div 
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8"
            variants={fadeInUp}
          >
            <div className="text-center space-y-8">
              <h3 className="text-3xl font-bold text-text-primary">
                Resultados <span className="text-success">Comprobados</span>
              </h3>
              
              <div className="grid md:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div 
                    key={index}
                    className="text-center space-y-3"
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto">
                      <benefit.icon className="w-6 h-6 text-text-primary" />
                    </div>
                    
                    <div className="text-2xl font-bold text-primary">
                      {benefit.stat}
                    </div>
                    
                    <h4 className="font-semibold text-text-primary">{benefit.title}</h4>
                    <p className="text-text-secondary text-sm">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};