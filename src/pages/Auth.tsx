import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LandingNavbar } from '@/components/LandingNavbar';
import { AuthModal } from '@/components/AuthModal';
import { Brain, Zap, Target, TrendingUp, BarChart3, Users, Eye, Sparkles, Video, MessageSquare } from 'lucide-react';

const Auth = () => {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <LandingNavbar onSignInClick={() => setAuthModalOpen(true)} />
      
      <div className="min-h-screen bg-gradient-dark">
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold text-text-primary leading-tight">
                  Domina TikTok con
                  <br />
                  <span className="bg-gradient-primary bg-clip-text text-transparent">Inteligencia Artificial</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
                  En la era de la IA, la guerra es por la <strong className="text-text-primary">atención en el top del funnel</strong>. 
                  Nuestra herramienta te permite ser <strong className="text-text-primary">consistentemente viral</strong> en TikTok, 
                  generando awareness y conversión constante.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg"
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-4 text-lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Comenzar Ahora
                </Button>
                <p className="text-text-muted text-sm">No necesitas tarjeta de crédito</p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-16 px-4 bg-navy-light/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                El Problema que Resolvemos
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-error" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Contenido Inconsistente</h3>
                  <p className="text-text-secondary">
                    Los creadores luchan por mantener la relevancia y viralidad de manera constante
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto">
                    <BarChart3 className="w-8 h-8 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Falta de Insights</h3>
                  <p className="text-text-secondary">
                    Es difícil entender qué elementos hacen que un video se vuelva viral
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-info/20 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-info" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Competencia por Atención</h3>
                  <p className="text-text-secondary">
                    En la era de la IA, capturar y mantener la atención del usuario es crítico
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                Nuestra Solución <span className="bg-gradient-primary bg-clip-text text-transparent">Powered by AI</span>
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                    <Video className="w-8 h-8 text-text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Análisis de Videos</h3>
                  <p className="text-text-secondary text-sm">
                    <strong>Gemini</strong> procesa y analiza videos para extraer patrones virales
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Embeddings Inteligentes</h3>
                  <p className="text-text-secondary text-sm">
                    <strong>OpenAI</strong> crea representaciones semánticas para encontrar patrones
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                    <MessageSquare className="w-8 h-8 text-text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Respuestas Naturales</h3>
                  <p className="text-text-secondary text-sm">
                    <strong>Claude</strong> transforma datos en insights accionables y comprensibles
                  </p>
                </div>
                
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                    <TrendingUp className="w-8 h-8 text-text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">Viralidad Consistente</h3>
                  <p className="text-text-secondary text-sm">
                    Predicciones y recomendaciones para mantener engagement alto
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-navy-light/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                ¿Qué Puedes Hacer?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-card border-border rounded-lg p-6 space-y-4 shadow-card">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Análisis de Viralidad</h3>
                  <p className="text-text-secondary">
                    Analiza videos virales para entender qué los hace exitosos y replica esos patrones
                  </p>
                </div>
                
                <div className="bg-card border-border rounded-lg p-6 space-y-4 shadow-card">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Generación de Ideas</h3>
                  <p className="text-text-secondary">
                    Recibe sugerencias personalizadas de contenido basadas en tendencias actuales
                  </p>
                </div>
                
                <div className="bg-card border-border rounded-lg p-6 space-y-4 shadow-card">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Insights de Audiencia</h3>
                  <p className="text-text-secondary">
                    Comprende mejor a tu audiencia y optimiza tu contenido para máximo engagement
                  </p>
                </div>
                
                <div className="bg-card border-border rounded-lg p-6 space-y-4 shadow-card">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Optimización de Contenido</h3>
                  <p className="text-text-secondary">
                    Mejora tus videos existentes con recomendaciones basadas en IA
                  </p>
                </div>
                
                <div className="bg-card border-border rounded-lg p-6 space-y-4 shadow-card">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Analytics Avanzados</h3>
                  <p className="text-text-secondary">
                    Dashboards completos con métricas que realmente importan para el crecimiento
                  </p>
                </div>
                
                <div className="bg-card border-border rounded-lg p-6 space-y-4 shadow-card">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary">Predicciones de Viralidad</h3>
                  <p className="text-text-secondary">
                    Evalúa el potencial viral de tu contenido antes de publicarlo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
              Transforma tu Estrategia de TikTok Hoy
            </h2>
            <p className="text-xl text-text-secondary">
              Únete a los creadores que ya están usando IA para dominar el algoritmo de TikTok
            </p>
            <Button 
              size="lg"
              onClick={() => setAuthModalOpen(true)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity px-12 py-4 text-lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Empezar Gratis
            </Button>
          </div>
        </section>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Auth;