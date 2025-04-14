import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js"; 
import { User, Session } from "@supabase/supabase-js";
import { useToast } from "@/components/ui/use-toast";

type AuthContextType = {
  user: User | null;
  session: Session | null;
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
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
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
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
