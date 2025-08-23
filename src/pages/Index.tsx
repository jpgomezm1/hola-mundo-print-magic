const Index = () => {
  const handlePrint = () => {
    console.log("¡Hola Mundo!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center relative overflow-hidden">
      {/* Floating elements background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary rounded-full opacity-20 animate-float-slow"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-secondary rounded-full opacity-15 animate-float-delayed"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-accent rounded-full opacity-10 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-primary rounded-full opacity-25 animate-float-slow"></div>
      </div>

      {/* Main content */}
      <div className="text-center z-10 space-y-8 px-6">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
            ¡Hola Mundo!
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary animate-fade-in-delayed">
            Bienvenido a tu primera aplicación con Lovable
          </p>
        </div>
        
        <button
          onClick={handlePrint}
          className="group relative px-8 py-4 bg-gradient-primary hover:shadow-glow transition-all duration-300 rounded-2xl font-semibold text-white transform hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">🖨️ Imprimir Saludo</span>
          <div className="absolute inset-0 bg-gradient-secondary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
        
        <div className="mt-12 text-text-muted animate-fade-in-slow">
          <p>Abre la consola del navegador para ver el mensaje</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
