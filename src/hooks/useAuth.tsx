import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto-login credentials for the shared account
  const AUTO_LOGIN_EMAIL = "jpgomez@stayirrelevant.com";
  const AUTO_LOGIN_PASSWORD = "123456789"; // Necesitamos la contraseña correcta

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session and auto-login if needed
    const initializeAuth = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log('Existing session check:', existingSession ? 'Found' : 'Not found');
        
        if (existingSession) {
          // User is already logged in
          setSession(existingSession);
          setUser(existingSession.user);
          setLoading(false);
          console.log('User already authenticated:', existingSession.user.email);
        } else {
          // No session, perform auto-login
          console.log('No session found, performing auto-login...');
          const { data, error } = await supabase.auth.signInWithPassword({
            email: AUTO_LOGIN_EMAIL,
            password: AUTO_LOGIN_PASSWORD
          });

          if (error) {
            console.error('Auto-login failed:', error.message);
            // If auto-login fails, still set loading to false so the app doesn't get stuck
          } else {
            console.log('Auto-login successful for:', data.user?.email);
            setSession(data.session);
            setUser(data.user);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};