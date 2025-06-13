import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);

      // cambiar sesión
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      });

      // sesión inicial
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);

      return () => subscription.unsubscribe();
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
=======
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Handle login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
>>>>>>> Stashed changes
=======
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Handle login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
>>>>>>> Stashed changes
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
<<<<<<< Updated upstream
<<<<<<< Updated upstream

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de nuevo!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "No se pudo iniciar sesión",
        variant: "destructive",
      });
      return { error };
    }
  };

  // PARA GUARDAR DATOS EN MI TABLA REGISTRATION
  const signUp = async (email: string, password: string) => {
=======
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url,
        });
      }
      
      navigate('/chat');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al iniciar sesión',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
>>>>>>> Stashed changes
=======
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
          avatar_url: data.user.user_metadata?.avatar_url,
        });
      }
      
      navigate('/chat');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al iniciar sesión',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user registration
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
>>>>>>> Stashed changes
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
<<<<<<< Updated upstream
      });
  
      if (error) throw error;
  
      if (data?.user) {
        const insertRes = await supabase.from("registration").insert({
          id: data.user.id, 
          user_id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(), 
        });
  
        if (insertRes.error) throw insertRes.error;
      }
  
      toast({
        title: "Registro exitoso",
        description:
          "Se ha enviado un enlace de confirmación a tu correo electrónico.",
      });
  
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error en el registro",
        description: error.message || "No se pudo completar el registro",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  
  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
    });
=======
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;
      
      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          name: name || data.user.email?.split('@')[0],
        });
      }
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Por favor revisa tu correo para confirmar tu cuenta.',
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al registrarse',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Error al cerrar sesión',
        variant: 'destructive',
      });
    }
>>>>>>> Stashed changes
  };

  // Handle password reset
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast({
        title: 'Correo enviado',
        description: 'Revisa tu correo para restablecer tu contraseña',
      });
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el correo de recuperación',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Check for active session on mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        setSession(session);
        
        if (session?.user) {
          try {
            // First try to get user data from the session
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
              avatar_url: session.user.user_metadata?.avatar_url,
            });
            
            // Try to get additional data from profiles table if it exists
            try {
              const { data: userData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle(); // Use maybeSingle to handle case where no rows are found
                
              if (userData && !error) {
                setUser(prev => ({
                  ...prev!,
                  name: userData.full_name || prev?.name,
                  avatar_url: userData.avatar_url || prev?.avatar_url,
                }));
              }
            } catch (profileError) {
              // Ignore errors related to missing profiles table
              if (!(profileError as any).message?.includes('relation "public.profiles" does not exist')) {
                console.error('Error fetching user profile:', profileError);
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
          }
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );
    
    // Initial session check
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          // Set basic user data from session first
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            avatar_url: session.user.user_metadata?.avatar_url,
          });
          
          // Try to get additional data from profiles table if it exists
          try {
            const { data: userData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
              
            if (userData && !error) {
              setUser(prev => ({
                ...prev!,
                name: userData.full_name || prev?.name,
                avatar_url: userData.avatar_url || prev?.avatar_url,
              }));
            }
          } catch (profileError) {
            // Ignore errors related to missing profiles table
            if (!(profileError as any).message?.includes('relation "public.profiles" does not exist')) {
              console.error('Error fetching user profile:', profileError);
            }
          }
        }
      } catch (error) {
        console.error('Error in session check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Store user in localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const value = {
    user,
    session,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
=======
    isLoading,
    login,
    register,
    logout,
    resetPassword,
  };
=======
    isLoading,
    login,
    register,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
>>>>>>> Stashed changes

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
>>>>>>> Stashed changes

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
=======
=======
>>>>>>> Stashed changes
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
