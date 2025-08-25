import { motion } from 'framer-motion';
import { Video, Brain, MessageSquare, Zap, Target, Sparkles } from 'lucide-react';

export const SolutionSection = () => {
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

  const aiTechnologies = [
    {
      icon: Video,
      title: "Análisis Inteligente",
      description: "Descubrimos qué hace que un video funcione analizando automáticamente patrones de éxito",
      tech: "IA Visual",
      features: ["Detecta elementos populares", "Identifica tendencias", "Analiza el timing perfecto"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Conexiones Inteligentes",
      description: "Encontramos videos similares que funcionaron para darte ideas precisas y probadas",
      tech: "IA Predictiva",
      features: ["Encuentra inspiración", "Conecta ideas ganadoras", "Predice el engagement"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageSquare,
      title: "Consejos Personalizados",
      description: "Convertimos toda la información en recomendaciones fáciles de entender y aplicar",
      tech: "IA Conversacional",
      features: ["Explicaciones simples", "Consejos específicos", "Estrategias claras"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section id="solucion" className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          className="text-center space-y-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
        >
          {/* Clean Header */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 text-success text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>La Solución</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-text-primary">
              IA que{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Funciona
              </span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              Analizamos millones de videos exitosos para darte la{' '}
              <span className="text-primary font-semibold">fórmula exacta del éxito</span>
            </p>
          </motion.div>
          
          {/* Clean Technology Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
          >
            {aiTechnologies.map((tech, index) => (
              <motion.div 
                key={index}
                className="bg-card/30 border border-border/30 rounded-2xl p-6 space-y-4 hover:border-primary/30 transition-all duration-300"
                variants={scaleIn}
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <tech.icon className="w-6 h-6 text-text-primary" />
                </div>
                
                <h3 className="text-xl font-bold text-text-primary">
                  {tech.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {tech.description}
                </p>
                
                <div className="space-y-2">
                  {tech.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="flex items-center space-x-2 text-sm text-text-muted"
                    >
                      <div className="w-1 h-1 bg-primary rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Simple Process */}
          <motion.div 
            className="bg-primary/5 border border-primary/20 rounded-2xl p-8 max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
              Cómo Funciona
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Sube tu Video", desc: "Comparte el enlace de TikTok" },
                { step: "2", title: "IA Analiza", desc: "Procesamos automáticamente" },
                { step: "3", title: "Recibe Insights", desc: "Consejos claros y precisos" }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="text-center space-y-3"
                >
                  <div className="w-8 h-8 bg-primary text-text-primary rounded-full flex items-center justify-center mx-auto font-bold">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-text-primary">{step.title}</h4>
                  <p className="text-text-secondary text-sm">{step.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};