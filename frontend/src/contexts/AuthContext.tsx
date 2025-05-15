import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js"; 
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  token: string | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    session: Session | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Función para actualizar el token
  const updateToken = (session: Session | null) => {
    if (session?.access_token) {
      console.log('Updating token:', {
        hasToken: !!session.access_token,
        tokenLength: session.access_token.length,
        userId: session.user?.id
      });
      setToken(session.access_token);
      // Asegurarnos de que el token se actualice inmediatamente
      window.sessionStorage.setItem('authToken', session.access_token);
    } else {
      console.log('Clearing token');
      setToken(null);
      window.sessionStorage.removeItem('authToken');
    }
  };

  // Obtener token desde sessionStorage si existe
  useEffect(() => {
    const storedToken = window.sessionStorage.getItem('authToken');
    if (storedToken) {
      console.log('Restoring token from storage:', {
        hasToken: !!storedToken,
        tokenLength: storedToken.length
      });
      setToken(storedToken);
    }
  }, []);

  // Asegurarnos de que el token se actualice cuando la sesión cambie
  useEffect(() => {
    if (session?.access_token) {
      updateToken(session);
    }
  }, [session]);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);

      try {
        // Obtener sesión inicial
        const {
          data: { session: currentSession },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setSession(null);
          setUser(null);
          updateToken(null);
          setLoading(false);
          return;
        }

        if (currentSession) {
          // Establecer sesión y usuario
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Establecer token usando la función de actualización
          updateToken(currentSession);

          console.log('Initial session:', {
            hasToken: !!currentSession.access_token,
            tokenLength: currentSession.access_token?.length
          });

          // Suscribirse a cambios de sesión
          const {
            data: { subscription },
            error: subscriptionError
          } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (subscriptionError) {
              console.error('Error subscribing to auth changes:', subscriptionError);
              return;
            }

            if (currentSession) {
              setSession(currentSession);
              setUser(currentSession.user);
              updateToken(currentSession);
              console.log('Session changed:', {
                hasToken: !!currentSession.access_token,
                tokenLength: currentSession.access_token?.length
              });
            } else {
              setSession(null);
              setUser(null);
              updateToken(null);
              console.log('Session ended');
            }
            setLoading(false);
          });

          if (subscriptionError) {
            console.error('Error subscribing to auth changes:', subscriptionError);
            setLoading(false);
            return;
          }

          return () => {
            if (subscription) {
              subscription.unsubscribe();
            }
          };
        } else {
          setSession(null);
          setUser(null);
          updateToken(null);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  // Agregar un efecto para observar cambios en el token
  useEffect(() => {
    console.log('Token state changed:', {
      hasToken: !!token,
      tokenLength: token?.length
    });
  }, [token]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error, session: null };
      }

      if (data && data.session) {
        const { session } = data;
        console.log('Session received:', {
          hasSession: !!session,
          hasToken: !!session.access_token,
          tokenLength: session.access_token?.length
        });

        setSession(session);
        setUser(session.user);
        updateToken(session);

        // Esperar un poco para asegurarnos de que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 100));

        return { error: null, session };
      }

      return { error: new Error('No se recibió sesión'), session: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error: error instanceof Error ? error : new Error('Error signing in'), session: null };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            email
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error, data: null };
      }

      if (data && data.session) {
        const { session } = data;
        console.log('Session received:', {
          hasSession: !!session,
          hasToken: !!session.access_token,
          tokenLength: session.access_token?.length
        });

        setSession(session);
        setUser(session.user);
        updateToken(session);

        return { error: null, data };
      }

      return { error: new Error('No se recibió sesión'), data: null };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error: error instanceof Error ? error : new Error('Error signing up'), data: null };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }

      setSession(null);
      setUser(null);
      updateToken(null);
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
        variant: "default"
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    session,
    token,
    signIn,
    signUp,
    signOut,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
