import { useAuth } from '@/contexts/AuthContext';
import SimpleChatBot from '@/components/SimpleChatBot';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Profile() {
  const { user, token, session } = useAuth();
  const location = useLocation();
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
      console.log('Auth state:', {
        hasUser: !!user,
        hasToken: !!token,
        hasStoredToken: !!storedToken,
        hasSession: !!session,
        tokenLength: token?.length,
        storedTokenLength: storedToken?.length,
        tokenContent: token?.substring(0, 10) + '...',
        storedTokenContent: storedToken?.substring(0, 10) + '...'
      });
    }
  }, [user, token, session, storedToken, mounted]);

  // Manejar cambios en el hash
  useEffect(() => {
    const handleHashChange = () => {
      console.log('Hash changed:', location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [location.hash]);

  if (!mounted) {
    return null; // Evitar renderizado inicial mientras se monta
  }

  // Verificar tanto el token del estado como el almacenado
  if (!user || (!token && !storedToken) || !session) {
    console.error('Auth check failed:', {
      hasUser: !!user,
      hasToken: !!token,
      hasStoredToken: !!storedToken,
      hasSession: !!session,
      tokenContent: token?.substring(0, 10) + '...',
      storedTokenContent: storedToken?.substring(0, 10) + '...'
    });
    return (
      <div className="flex items-center justify-center h-full">
        <p>Por favor, inicia sesión para usar el chatbot</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4">
        <SimpleChatBot token={storedToken || token} />
      </div>
    </div>
  );
}
