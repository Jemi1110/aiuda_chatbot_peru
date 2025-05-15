
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, token, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Obtener token almacenado
    const storedToken = window.sessionStorage.getItem('authToken');
    setStoredToken(storedToken);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('PrivateRoute auth check:', {
        hasUser: !!user,
        hasToken: !!token,
        storedTokenLength: storedToken?.length
      });
    }
  }, [user, token, storedToken, mounted]);

  if (!mounted) {
    return null; // Evitar renderizado inicial mientras se monta
  }

  if (loading) {
    // Puedes mostrar un spinner o un mensaje de carga
    return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
  }

  // Verificar tanto el token del estado como el almacenado
  if (!user || (!token && !storedToken)) {
    console.error('Auth check failed:', {
      hasUser: !!user,
      hasToken: !!token,
      hasStoredToken: !!storedToken,
      tokenContent: token?.substring(0, 10) + '...'
    });
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
