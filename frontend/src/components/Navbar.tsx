
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toggleSidebar } = useSidebar();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Don't render navbar on auth pages
  if (isAuthPage) {
    return null;
  }

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {user && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <Link to="/">
            <img 
              src="/img/logo.png" 
              alt="AIUDA Logo" 
              className="h-10"
            />
          </Link>
        </div>

        {/* Navigation Links - Always show on landing page */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-aiuda-navy hover:text-aiuda-coral transition-colors font-medium">
            ¿Cómo funciona?
          </a>
          <a href="#features" className="text-aiuda-navy hover:text-aiuda-coral transition-colors font-medium">
            Características
          </a>
          <a href="#about" className="text-aiuda-navy hover:text-aiuda-coral transition-colors font-medium">
            Acerca de
          </a>
          
          {!user ? (
            <>
              <Link to="/login">
                <Button className="bg-aiuda-coral text-white hover:bg-aiuda-coral/90">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="text-aiuda-coral border-aiuda-coral hover:bg-aiuda-coral/10">
                  Registrarse
                </Button>
              </Link>
            </>
          ) : (
            <Button 
              variant="outline"
              className="flex items-center gap-2 text-aiuda-coral border-aiuda-coral hover:bg-aiuda-coral/10"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Cerrar Sesión
            </Button>
          )}
        </nav>

        {/* Profile dropdown para usuarios logueados */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full" size="icon">
                <Avatar className="h-9 w-9 border border-aiuda-coral">
                  <AvatarFallback className="bg-aiuda-coral text-white">
                    {user.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email?.split('@')[0]}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile?tab=settings#settings" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-accordion-down">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#how-it-works" className="text-aiuda-navy hover:text-aiuda-coral transition-colors font-medium py-2">
              ¿Cómo funciona?
            </a>
            <a href="#features" className="text-aiuda-navy hover:text-aiuda-coral transition-colors font-medium py-2">
              Características
            </a>
            <a href="#about" className="text-aiuda-navy hover:text-aiuda-coral transition-colors font-medium py-2">
              Acerca de
            </a>
            
            {!user ? (
              <>
                <Link to="/login" className="w-full">
                  <Button className="bg-aiuda-coral text-white hover:bg-aiuda-coral/90 w-full">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="outline" className="text-aiuda-coral border-aiuda-coral hover:bg-aiuda-coral/10 w-full">
                    Registrarse
                  </Button>
                </Link>
              </>
            ) : (
              <Button 
                variant="outline"
                className="flex items-center justify-center gap-2 text-aiuda-coral border-aiuda-coral hover:bg-aiuda-coral/10 w-full"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
