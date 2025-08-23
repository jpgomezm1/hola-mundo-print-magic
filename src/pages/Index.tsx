import { Button } from "@/components/ui/button";

const Index = () => {
  const handlePrint = () => {
    console.log("¡Hola Mundo!");
    alert("¡Hola Mundo impreso en consola!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary rounded-full animate-float blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-secondary rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-accent rounded-full animate-float blur-xl" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="text-center z-10 px-4">
        {/* Main Title */}
        <h1 className="text-8xl md:text-9xl font-black text-gradient mb-8 animate-pulse-glow tracking-tight">
          ¡Hola Mundo!
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          Bienvenido a la página más hermosa para mostrar el clásico saludo de programación
        </p>

        {/* Interactive Button */}
        <Button 
          onClick={handlePrint}
          size="lg"
          className="bg-card/20 hover:bg-card/30 border border-primary/30 hover:border-primary/50 text-foreground hover:text-primary-glow shadow-glow hover:shadow-intense transition-all duration-500 text-lg px-8 py-6 rounded-2xl backdrop-blur-sm"
        >
          🖨️ Imprimir "Hola Mundo"
        </Button>
        
        {/* Code snippet decoration */}
        <div className="mt-16 bg-card/10 border border-primary/20 rounded-2xl p-6 backdrop-blur-sm max-w-md mx-auto">
          <code className="text-primary-glow font-mono text-sm">
            console.log("¡Hola Mundo!");
          </code>
        </div>
      </div>
    </main>
  );
};

export default Index;
