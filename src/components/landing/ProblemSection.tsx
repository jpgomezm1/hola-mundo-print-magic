import { motion } from 'framer-motion';
import { Target, BarChart3, Brain, AlertTriangle, TrendingDown, Users } from 'lucide-react';

export const ProblemSection = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const problems = [
    {
      icon: TrendingDown,
      title: "Contenido Inconsistente",
      description: "Solo 1 de cada 10 videos logra el engagement esperado",
      stat: "90% de contenido falla",
      color: "error"
    },
    {
      icon: AlertTriangle,
      title: "Falta de Insights",
      description: "Imposible saber qué funciona sin análisis profundo",
      stat: "0 datos accionables",
      color: "warning"
    },
    {
      icon: Users,
      title: "Competencia Brutal",
      description: "Millones de videos compiten por la misma atención",
      stat: "1B+ videos diarios",
      color: "info"
    }
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-navy-light/80 to-background relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--text-primary)) 2px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-20 w-32 h-32 bg-error/10 rounded-full blur-2xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto max-w-8xl relative z-10">
        <motion.div 
          className="text-center space-y-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-150px" }}
          variants={stagger}
        >
          {/* Enhanced Header */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <motion.div 
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-error/10 to-warning/10 border border-error/30 rounded-full px-8 py-4 text-error font-bold shadow-lg"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--error))" }}
            >
              <AlertTriangle className="w-6 h-6" />
              <span className="text-lg">Problema Crítico en el Mercado</span>
            </motion.div>
            
            <h2 className="text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-tight">
              El Problema es{' '}
              <motion.span 
                className="text-error relative inline-block"
                initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              >
                Real
                <motion.div 
                  className="absolute -bottom-3 left-0 right-0 h-2 bg-error/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </motion.span>
            </h2>
            
            <p className="text-2xl md:text-3xl lg:text-4xl text-text-secondary max-w-5xl mx-auto leading-relaxed font-light">
              En un mundo donde la atención es el activo más valioso, la mayoría de creadores 
              <strong className="text-text-primary font-semibold"> luchan por mantener relevancia</strong>
            </p>
          </motion.div>
          
          {/* Enhanced Problems Grid */}
          <motion.div 
            className="grid lg:grid-cols-3 gap-10"
            variants={stagger}
          >
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={scaleIn}
                whileHover={{ 
                  y: -20,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-10 space-y-8 h-full relative overflow-hidden group-hover:border-primary/50 transition-all duration-500 shadow-xl">
                  {/* Hover effect overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />
                  
                  {/* Floating Icon Background */}
                  <motion.div 
                    className={`absolute top-6 right-6 w-24 h-24 bg-${problem.color}/5 rounded-full blur-xl`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-20 h-20 bg-gradient-to-br from-${problem.color}/20 to-${problem.color}/10 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-all duration-300 shadow-lg`}
                      whileHover={{ rotate: 10 }}
                    >
                      <problem.icon className={`w-10 h-10 text-${problem.color}`} />
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-text-primary group-hover:text-primary transition-colors text-center">
                      {problem.title}
                    </h3>
                    
                    <p className="text-lg text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors text-center">
                      {problem.description}
                    </p>
                    
                    <motion.div 
                      className={`inline-block bg-gradient-to-r from-${problem.color}/10 to-${problem.color}/20 text-${problem.color} font-bold px-6 py-3 rounded-full mx-auto text-center w-full`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      {problem.stat}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Enhanced Impact Statement */}
          <motion.div 
            className="bg-gradient-to-r from-error/10 via-warning/10 to-error/10 border border-error/30 rounded-3xl p-12 max-w-6xl mx-auto shadow-xl"
            variants={fadeInUp}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-error/20 to-warning/20 rounded-full flex items-center justify-center mx-auto">
                <TrendingDown className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-text-primary">
                Resultado: <span className="text-error">Oportunidades Perdidas</span>
              </h3>
              <p className="text-xl text-text-secondary leading-relaxed max-w-4xl mx-auto">
                Sin análisis inteligente, estás disparando a ciegas en un mercado de
                <motion.span 
                  className="text-warning font-bold text-2xl mx-2"
                  whileHover={{ scale: 1.1 }}
                > 
                  $1.8 billones
                </motion.span> 
                en marketing digital
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {[
                  { label: "Inversión Perdida", value: "70%" },
                  { label: "Tiempo Desperdiciado", value: "85%" },
                  { label: "Audiencia Sin Convertir", value: "90%" },
                  { label: "Potencial Sin Explotar", value: "95%" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="text-2xl font-bold text-error">{stat.value}</div>
                    <div className="text-sm text-text-muted">{stat.label}</div>
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