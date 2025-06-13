import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, MessageSquare, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Hide navbar on login and register pages
  if (['/login', '/register', '/chat'].includes(location.pathname)) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const navItems = [
    { name: 'Inicio', path: '/', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: 'Características', path: '#features', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: 'Cómo Funciona', path: '#how-it-works', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith('#')) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(sectionId);
    }
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/img/logo.png" 
              alt="AIUDA Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => scrollToSection(item.path)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                  location.pathname === item.path 
                    ? 'text-aiuda-coral bg-aiuda-blue/5' 
                    : 'text-aiuda-navy hover:bg-aiuda-blue/5 hover:text-aiuda-coral'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center space-x-2 border-aiuda-blue/30 text-aiuda-navy hover:bg-aiuda-blue/5 hover:border-aiuda-coral hover:text-aiuda-coral"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
              <Button 
                className="bg-aiuda-coral hover:bg-aiuda-coral/90 text-white flex items-center space-x-2"
                onClick={() => navigate('/register')}
              >
                <UserPlus className="h-4 w-4" />
                <span>Regístrate</span>
              </Button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-aiuda-navy hover:bg-aiuda-blue/10 hover:text-aiuda-coral focus:outline-none transition-colors"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-in">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => scrollToSection(item.path)}
                  className={`w-full px-4 py-3 rounded-lg font-medium flex items-center text-left ${
                    location.pathname === item.path
                      ? 'bg-aiuda-blue/10 text-aiuda-coral'
                      : 'text-aiuda-navy hover:bg-aiuda-blue/5'
                  }`}
                >
                  {React.cloneElement(item.icon, { className: 'h-5 w-5 mr-3' })}
                  {item.name}
                </button>
              ))}
              <div className="border-t border-gray-100 my-2"></div>
              <Button 
                variant="outline" 
                className="w-full justify-start h-12 text-base"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                <LogIn className="h-5 w-5 mr-3" />
                Iniciar Sesión
              </Button>
              <Button 
                className="w-full justify-start h-12 text-base bg-aiuda-coral hover:bg-aiuda-coral/90"
                onClick={() => {
                  navigate('/register');
                  setIsMenuOpen(false);
                }}
              >
                <UserPlus className="h-5 w-5 mr-3" />
                Crear Cuenta
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
