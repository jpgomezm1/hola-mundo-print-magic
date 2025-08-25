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
    <section id="problema" className="py-20 px-6 bg-navy-light/10">
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
            <div className="inline-flex items-center space-x-2 bg-error/10 border border-error/20 rounded-full px-4 py-2 text-error text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>El Problema Real</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black text-text-primary">
              La Realidad es{' '}
              <span className="text-error">Brutal</span>
            </h2>
            
            <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
              En un mundo donde millones compiten por la atención,{' '}
              <span className="text-text-primary font-semibold">90% del contenido fracasa</span> sin datos que lo respalden
            </p>
          </motion.div>
          
          {/* Clean Problems Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
          >
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                className="bg-card/50 border border-border/50 rounded-2xl p-6 space-y-4 hover:border-primary/30 transition-all duration-300"
                variants={scaleIn}
              >
                <div className={`w-12 h-12 bg-${problem.color}/10 rounded-xl flex items-center justify-center`}>
                  <problem.icon className={`w-6 h-6 text-${problem.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-text-primary">
                  {problem.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {problem.description}
                </p>
                
                <div className={`inline-block bg-${problem.color}/10 text-${problem.color} font-semibold px-3 py-1 rounded-full text-sm`}>
                  {problem.stat}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Simple Impact Statement */}
          <motion.div 
            className="bg-error/5 border border-error/20 rounded-2xl p-8 max-w-4xl mx-auto"
            variants={fadeInUp}
          >
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-text-primary">
                Sin análisis inteligente, estás <span className="text-error">perdiendo oportunidades</span>
              </h3>
              <p className="text-lg text-text-secondary">
                El mercado de marketing digital mueve $1.8 billones al año. 
                ¿Cuánto de eso estás capturando?
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};