
import { 
  Home, 
  MessageCircle, 
  History, 
  Settings, 
  LogOut
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "./Navbar";

const DashboardSidebar = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .substring(0, 2)
      .toUpperCase();
  };
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {user && (
          <Sidebar side="left" variant="sidebar" collapsible="icon">
            <SidebarHeader className="flex flex-col items-center justify-center p-4">
              <Avatar className="h-16 w-16 border-2 border-aiuda-coral mb-2">
                <AvatarFallback className="bg-aiuda-coral text-white">
                  {user.email ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-medium text-center truncate max-w-full">
                {user.email?.split('@')[0] || 'Usuario'}
              </p>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive("/")}
                    tooltip="Inicio"
                  >
                    <Link to="/">
                      <Home size={20} />
                      <span>Inicio</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === "/profile" && location.hash === "#chat"}
                    tooltip="Chat Médico"
                  >
                    <Link to="/profile?tab=chat#chat">
                      <MessageCircle size={20} />
                      <span>Chat Médico</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === "/profile" && location.hash === "#history"}
                    tooltip="Historial"
                  >
                    <Link to="/profile?tab=history#history">
                      <History size={20} />
                      <span>Historial</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === "/profile" && location.hash === "#settings"}
                    tooltip="Configuración"
                  >
                    <Link to="/profile?tab=settings#settings">
                      <Settings size={20} />
                      <span>Configuración</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="p-4">
              <SidebarMenuButton 
                onClick={handleLogout}
                tooltip="Cerrar Sesión"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </SidebarFooter>
          </Sidebar>
        )}
        
        <SidebarInset>
          <div className="flex flex-col min-h-full">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
