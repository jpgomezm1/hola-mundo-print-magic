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
    <section className="py-24 px-4 bg-navy-light/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--text-primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
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
              className="inline-flex items-center space-x-2 bg-error/10 border border-error/20 rounded-full px-4 py-2 text-error text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Problema Crítico</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              El Problema es{' '}
              <motion.span 
                className="text-error"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Real
              </motion.span>
            </h2>
            
            <p className="text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              En un mundo donde la atención es el activo más valioso, la mayoría de creadores 
              <strong className="text-text-primary"> luchan por mantener relevancia</strong>
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
          >
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                className="group relative"
                variants={scaleIn}
                whileHover={{ 
                  y: -15,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="bg-card/70 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 h-full relative overflow-hidden group-hover:border-primary/50 transition-all duration-300">
                  {/* Hover effect overlay */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-16 h-16 bg-${problem.color}/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 10 }}
                    >
                      <problem.icon className={`w-8 h-8 text-${problem.color}`} />
                    </motion.div>
                    
                    <h3 className="text-2xl font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {problem.title}
                    </h3>
                    
                    <p className="text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors">
                      {problem.description}
                    </p>
                    
                    <motion.div 
                      className={`inline-block bg-${problem.color}/10 text-${problem.color} text-sm font-bold px-4 py-2 rounded-full`}
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

          {/* Impact Statement */}
          <motion.div 
            className="bg-gradient-to-r from-error/10 to-warning/10 border border-error/20 rounded-2xl p-8 max-w-4xl mx-auto"
            variants={fadeInUp}
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-text-primary">
                Resultado: Oportunidades Perdidas
              </h3>
              <p className="text-lg text-text-secondary">
                Sin análisis inteligente, estás disparando a ciegas en un mercado de
                <strong className="text-warning"> $1.8 billones</strong> en marketing digital
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};