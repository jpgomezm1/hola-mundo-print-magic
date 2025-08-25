import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: '¡Bienvenido de vuelta!',
        description: 'Has iniciado sesión exitosamente.'
      });
      onOpenChange(false);
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const displayName = formData.get('displayName') as string;

    const { error } = await signUp(email, password, displayName);
    
    if (error) {
      toast({
        title: 'Error al crear cuenta',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: '¡Cuenta creada!',
        description: 'Revisa tu email para verificar tu cuenta.'
      });
      onOpenChange(false);
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-text-primary text-center">🚀 ¡Explorar Herramienta!</DialogTitle>
          <DialogDescription className="text-text-secondary text-center">
            <span className="block text-lg font-semibold text-primary mb-2">
              👆 Solo haz click en "Iniciar Sesión"
            </span>
            Los datos ya están listos para que explores todas las funcionalidades
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm text-text-secondary">Email (ya configurado)</Label>
              <Input
                id="signin-email"
                name="email"
                type="email"
                value="jpgomez@stayirrelevant.com"
                readOnly
                className="bg-muted text-text-secondary cursor-default"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password" className="text-sm text-text-secondary">Contraseña (ya configurada)</Label>
              <Input
                id="signin-password"
                name="password"
                type="password"
                value="Nov2011*"
                readOnly
                className="bg-muted text-text-secondary cursor-default"
              />
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-sm text-primary font-medium mb-3">
                ✨ Todo está listo para explorar
              </p>
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300 text-lg py-3 font-bold shadow-lg shadow-primary/25"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    🎯 Iniciar Sesión y Explorar
                  </div>
                )}
              </Button>
            </div>
            
            <div className="text-center text-xs text-text-secondary bg-background/50 rounded-lg p-3">
              <p>🔒 Acceso demo con datos reales</p>
              <p>Explora todas las funcionalidades sin limitaciones</p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};