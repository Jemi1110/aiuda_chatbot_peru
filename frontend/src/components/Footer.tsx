
import { Github, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-aiuda-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img 
              src="/img/logo.png" 
              alt="AIUDA Logo" 
              className="h-12 mb-4" 
            />
            <p className="mb-4 text-white/70 max-w-md">
              AIUDA es un asistente médico virtual diseñado para proporcionar orientación médica inicial a estudiantes universitarios y público en general.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">Inicio</a></li>
              <li><a href="#features" className="text-white/70 hover:text-aiuda-coral transition-colors">Características</a></li>
              <li><a href="#how-it-works" className="text-white/70 hover:text-aiuda-coral transition-colors">Cómo funciona</a></li>
              <li><a href="#about" className="text-white/70 hover:text-aiuda-coral transition-colors">Acerca de</a></li>
              <li><a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">Contacto</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">Términos de uso</a></li>
              <li><a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">Política de cookies</a></li>
              <li><a href="#" className="text-white/70 hover:text-aiuda-coral transition-colors">Limitación de responsabilidad</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center md:text-left md:flex md:justify-between md:items-center">
          <p className="text-white/70">© {currentYear} AIUDA. Todos los derechos reservados.</p>
          <p className="text-white/50 mt-2 md:mt-0">
            Desarrollado por el equipo de UTP
          </p>
        </div>
      </div>
    </footer>
  );
}
