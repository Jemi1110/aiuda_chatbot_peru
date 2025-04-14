
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // Si el usuario ya está autenticado, redirigir a la página principal
  //if (user) {
  //  navigate("/");
    //return null;
  //}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    if (!agreed) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }
    
    setLoading(true);
    setError("");
    
    const { error: signUpError } = await signUp(email, password);
    
    if (!signUpError) {
      // se podria hacer una ventana de confirmación para más adelante
      navigate("/login");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-aiuda-blue/10 to-aiuda-coral/10 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <Link to="/" className="flex justify-center mb-6">
              <img 
                src="/img/logo.png" 
                alt="AIUDA Logo" 
                className="h-12"
              />
            </Link>
            <h1 className="text-2xl font-bold text-aiuda-navy text-center">Crear cuenta</h1>
            <p className="text-muted-foreground mt-2 text-center">
              Regístrate para acceder a la plataforma
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked === true)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Acepto los términos y condiciones
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90" 
              disabled={loading}
            >
              {loading ? "Procesando..." : "Registrarse"}
            </Button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-aiuda-coral hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </p>
            
            <Link to="/" className="text-sm text-aiuda-navy hover:underline">
              Volver al inicio
            </Link>
          </div>
        </div>
        
        {/* Right side - Image/Decorative */}
        <div className="hidden md:block bg-gradient-to-br from-aiuda-coral/30 to-aiuda-blue/30 relative">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-xs text-center">
              <h3 className="text-xl font-bold text-aiuda-navy mb-2">Únete a AIUDA</h3>
              <p className="text-muted-foreground">
                Crea tu cuenta para acceder a todas las funcionalidades de nuestro asistente médico virtual.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
