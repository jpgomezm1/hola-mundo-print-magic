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
      title: "Análisis con Gemini",
      description: "Procesamiento avanzado de videos para extraer patrones virales y elementos de éxito",
      tech: "Google Gemini",
      features: ["Análisis de audio", "Detección de objetos", "Reconocimiento de patrones"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Embeddings OpenAI",
      description: "Representaciones semánticas para encontrar similitudes entre contenidos exitosos",
      tech: "OpenAI GPT-4",
      features: ["Vectorización semántica", "Análisis de contexto", "Patrones de engagement"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageSquare,
      title: "Insights con Claude",
      description: "Transformación de datos complejos en recomendaciones accionables y comprensibles",
      tech: "Anthropic Claude",
      features: ["Análisis de sentimientos", "Recomendaciones personalizadas", "Predicciones precisas"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/10 to-success/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div 
          className="text-center space-y-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="space-y-6">
            <motion.div 
              className="inline-flex items-center space-x-2 bg-success/10 border border-success/20 rounded-full px-4 py-2 text-success text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Solución Innovadora</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              La Solución{' '}
              <motion.span 
                className="bg-gradient-primary bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Inteligente
              </motion.span>
            </h2>
            
            <p className="text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              Combinamos las <strong className="text-primary">mejores IAs del mercado</strong> para 
              darte ventaja competitiva real en TikTok
            </p>
          </motion.div>
          
          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            variants={stagger}
          >
            {aiTechnologies.map((tech, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={scaleIn}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="bg-gradient-to-br from-card to-card/50 border border-border rounded-3xl p-8 space-y-6 h-full relative overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                  {/* Animated gradient overlay */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    initial={false}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: 15 }}
                    >
                      <tech.icon className="w-8 h-8 text-text-primary" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {tech.title}
                    </h3>
                    
                    <p className="text-text-secondary leading-relaxed">
                      {tech.description}
                    </p>
                    
                    <motion.div 
                      className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                    >
                      {tech.tech}
                    </motion.div>
                    
                    {/* Features List */}
                    <div className="space-y-2 pt-4">
                      {tech.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-2 text-sm text-text-muted"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + featureIndex * 0.1, duration: 0.3 }}
                        >
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* How it Works */}
          <motion.div 
            className="bg-gradient-to-r from-primary/5 to-success/5 border border-primary/20 rounded-3xl p-12 max-w-5xl mx-auto"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center space-y-8">
              <h3 className="text-3xl font-bold text-text-primary">
                Cómo Funciona la Magia
              </h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { step: "01", title: "Analiza", desc: "Subimos tu video a nuestras IAs" },
                  { step: "02", title: "Procesa", desc: "Extraemos patrones y elementos virales" },
                  { step: "03", title: "Optimiza", desc: "Recibes insights accionables" }
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="text-center space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="text-4xl font-bold text-primary">{step.step}</div>
                    <h4 className="text-xl font-semibold text-text-primary">{step.title}</h4>
                    <p className="text-text-secondary">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};