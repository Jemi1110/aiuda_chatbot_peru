import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa tu correo y contraseña',
        variant: 'destructive',
      });
      return;
    }
    
    // Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un correo electrónico válido',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      
      toast({
        title: '¡Bienvenido!',
        description: 'Inicio de sesión exitoso',
      });
      
      // Redirigir al dashboard o a la página principal
      navigate('/chat');
    } catch (error: any) {
      console.error('Error en inicio de sesión:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor, verifica tu correo electrónico antes de iniciar sesión.';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'Demasiados intentos. Por favor, inténtalo de nuevo más tarde.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-aiuda-muted to-white p-4">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <button onClick={() => navigate('/')}>
            <img 
              src="/img/logo.png" 
              alt="AIUDA Logo" 
              className="h-12" 
            />
            </button>
          </div>
          <h1 className="text-3xl font-bold text-aiuda-navy">Iniciar Sesión</h1>
          <p className="text-aiuda-navy/70">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-aiuda-navy/80">Correo Electrónico</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aiuda-coral focus:border-transparent transition-all duration-200"
                disabled={isLoading || authLoading}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-aiuda-navy/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-aiuda-navy/80">Contraseña</Label>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} 
                className="text-sm text-aiuda-coral hover:text-aiuda-coral/80 hover:underline focus:outline-none transition-colors"
                disabled={isLoading || authLoading}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-aiuda-coral focus:border-transparent transition-all duration-200"
                disabled={isLoading || authLoading}
                minLength={6}
                required
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-aiuda-navy/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-aiuda-coral focus:ring-aiuda-coral border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-aiuda-navy/80">
              Recordar mi cuenta
            </label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90 text-white font-medium py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aiuda-coral/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isLoading || authLoading}
          >
            {isLoading || authLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Iniciando sesión...
              </span>
            ) : 'Iniciar Sesión'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-aiuda-navy/70">
          ¿No tienes una cuenta?{' '}
          <Link 
            to="/register" 
            className="text-aiuda-coral hover:text-aiuda-coral/80 hover:underline font-medium transition-colors"
            onClick={(e) => (isLoading || authLoading) && e.preventDefault()}
          >
            Regístrate
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
