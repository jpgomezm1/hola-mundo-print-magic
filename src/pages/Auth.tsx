import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LandingNavbar } from '@/components/LandingNavbar';
import { AuthModal } from '@/components/AuthModal';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, TrendingUp, BarChart3, Users, Eye, Sparkles, Video, MessageSquare, ArrowRight, CheckCircle, Play } from 'lucide-react';

const Auth = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

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

  return (
    <>
      <LandingNavbar onSignInClick={() => setAuthModalOpen(true)} />
      
      <div className="min-h-screen bg-gradient-dark overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-bright/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="container mx-auto max-w-7xl relative z-10">
            <motion.div 
              className="text-center space-y-8"
              initial="initial"
              animate="animate"
              variants={stagger}
            >
              <motion.div className="space-y-6" variants={fadeInUp}>
                <motion.div 
                  className="inline-flex items-center space-x-2 bg-purple-bright/10 border border-purple-bright/20 rounded-full px-6 py-2 text-purple-light text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Powered by AI • OpenAI • Gemini • Claude</span>
                </motion.div>
                
                <h1 className="text-6xl md:text-8xl font-bold text-text-primary leading-tight">
                  Sé <span className="bg-gradient-primary bg-clip-text text-transparent">Viral</span>
                  <br />
                  <motion.span 
                    className="text-text-secondary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    Consistentemente
                  </motion.span>
                </h1>
                
                <motion.p 
                  className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed"
                  variants={fadeInUp}
                >
                  En la era de la IA, la guerra es por la <strong className="text-primary">atención</strong>. 
                  Domina TikTok con inteligencia artificial y convierte cada video en una 
                  <strong className="text-primary"> oportunidad de negocio</strong>.
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                variants={fadeInUp}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg"
                    onClick={() => setAuthModalOpen(true)}
                    className="bg-gradient-primary hover:opacity-90 transition-all px-8 py-4 text-lg shadow-purple group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Comenzar Gratis
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
                <motion.p 
                  className="text-text-muted text-sm flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="w-4 h-4 mr-2 text-success" />
                  Sin tarjeta de crédito • Acceso inmediato
                </motion.p>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto pt-16"
                variants={stagger}
              >
                {[
                  { number: "10M+", label: "Videos Analizados" },
                  { number: "95%", label: "Precisión en Predicciones" },
                  { number: "3x", label: "Aumento de Engagement" },
                  { number: "24/7", label: "Análisis en Tiempo Real" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    variants={scaleIn}
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                    <div className="text-text-secondary text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 bg-navy-light/50 relative">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center space-y-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                  El Problema es <span className="text-error">Real</span>
                </h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  En un mundo donde la atención es el activo más valioso, la mayoría de creadores luchan por mantener relevancia
                </p>
              </motion.div>
              
              <motion.div 
                className="grid md:grid-cols-3 gap-8"
                variants={stagger}
              >
                {[
                  {
                    icon: Target,
                    title: "Contenido Inconsistente",
                    description: "Solo 1 de cada 10 videos logra el engagement esperado",
                    color: "error"
                  },
                  {
                    icon: BarChart3,
                    title: "Falta de Insights",
                    description: "Imposible saber qué funciona sin análisis profundo",
                    color: "warning"
                  },
                  {
                    icon: Brain,
                    title: "Competencia Brutal",
                    description: "Millones de videos compiten por la misma atención",
                    color: "info"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 space-y-6 group"
                    variants={scaleIn}
                    whileHover={{ 
                      y: -10,
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <div className={`w-16 h-16 bg-${item.color}/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform`}>
                      <item.icon className={`w-8 h-8 text-${item.color}`} />
                    </div>
                    <h3 className="text-2xl font-semibold text-text-primary">{item.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 px-4 relative">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="text-center space-y-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                  La Solución <span className="bg-gradient-primary bg-clip-text text-transparent">Inteligente</span>
                </h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  Combinamos las mejores IAs del mercado para darte ventaja competitiva real
                </p>
              </motion.div>
              
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={stagger}
              >
                {[
                  {
                    icon: Video,
                    title: "Análisis con Gemini",
                    description: "Procesamiento avanzado de videos para extraer patrones virales",
                    tech: "Google Gemini"
                  },
                  {
                    icon: Brain,
                    title: "Embeddings OpenAI",
                    description: "Representaciones semánticas para encontrar similitudes",
                    tech: "OpenAI GPT-4"
                  },
                  {
                    icon: MessageSquare,
                    title: "Insights con Claude",
                    description: "Transformación de datos en recomendaciones accionables",
                    tech: "Anthropic Claude"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-gradient-to-br from-card to-card/50 border border-border rounded-2xl p-8 space-y-6 group relative overflow-hidden"
                    variants={scaleIn}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                    />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <item.icon className="w-8 h-8 text-text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                      <div className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                        {item.tech}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 bg-navy-light/30 relative">
          <div className="container mx-auto max-w-7xl">
            <motion.div 
              className="space-y-16"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.div className="text-center" variants={fadeInUp}>
                <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                  Todo lo que Necesitas
                </h2>
                <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                  Herramientas profesionales para dominar completamente TikTok
                </p>
              </motion.div>
              
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={stagger}
              >
                {[
                  { icon: Zap, title: "Análisis de Viralidad", description: "Descubre qué hace que un video se vuelva viral" },
                  { icon: Target, title: "Generación de Ideas", description: "Sugerencias personalizadas basadas en tendencias" },
                  { icon: Users, title: "Insights de Audiencia", description: "Comprende profundamente a tu audiencia objetivo" },
                  { icon: Eye, title: "Optimización de Contenido", description: "Mejora videos existentes con IA" },
                  { icon: BarChart3, title: "Analytics Avanzados", description: "Métricas que realmente importan para crecer" },
                  { icon: Sparkles, title: "Predicción Viral", description: "Evalúa potencial antes de publicar" }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="bg-card border border-border rounded-xl p-6 space-y-4 group hover:border-primary/50 transition-all duration-300"
                    variants={scaleIn}
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">{feature.title}</h3>
                    <p className="text-text-secondary">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-primary opacity-5"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <div className="container mx-auto max-w-4xl text-center space-y-8 relative z-10">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-text-primary mb-6"
                variants={fadeInUp}
              >
                Únete a la Revolución
              </motion.h2>
              <motion.p 
                className="text-xl text-text-secondary mb-8"
                variants={fadeInUp}
              >
                Miles de creadores ya están usando IA para dominar TikTok. ¿Qué esperas?
              </motion.p>
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg"
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-gradient-primary hover:opacity-90 transition-all px-12 py-6 text-xl shadow-glow group"
                >
                  <Brain className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Empezar Ahora Gratis
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Auth;