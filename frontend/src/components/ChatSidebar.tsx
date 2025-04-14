
import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Plus,
  Trash2,
  Calendar,
  History,
  ArrowLeftFromLine
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatHistory {
  id: number;
  title: string;
  date: string;
}

const ChatSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de historiales de chat
    setTimeout(() => {
      setChatHistories([
        {
          id: 1,
          title: "Consulta sobre dolor de cabeza",
          date: "12/04/2025"
        },
        {
          id: 2,
          title: "Información sobre medicamentos",
          date: "10/04/2025"
        },
        {
          id: 3,
          title: "Síntomas de gripe",
          date: "08/04/2025"
        }
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const isActive = (chatId: number) => {
    // Lógica para determinar si este chat está activo
    return location.search === `?chat=${chatId}`;
  };
  
  const handleNewChat = () => {
    navigate('/profile#chat');
    toast({
      title: "Nueva consulta",
      description: "Iniciando una nueva consulta médica"
    });
  };
  
  const handleDeleteChat = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setChatHistories(prev => prev.filter(chat => chat.id !== id));
    toast({
      title: "Conversación eliminada",
      description: "La conversación ha sido eliminada correctamente"
    });
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r bg-muted/10">
      <SidebarHeader className="p-3">
        <Button className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90 flex items-center gap-2" onClick={handleNewChat}>
          <Plus size={16} />
          <span>Nueva consulta</span>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="mb-2 px-3 py-2">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CONSULTAS RECIENTES</h3>
          </div>
          
          <SidebarMenu>
            {isLoading ? (
              <div className="px-4 py-2 text-sm text-muted-foreground">Cargando historiales...</div>
            ) : chatHistories.length > 0 ? (
              <>
                {chatHistories.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive(chat.id)}
                      className="group transition-all hover:bg-muted/50 rounded-md px-3 py-2"
                    >
                      <Link to={`/profile?chat=${chat.id}#chat`} className="flex items-start gap-2">
                        <MessageSquare size={16} className="mt-1 shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="truncate font-medium">{chat.title}</span>
                          <span className="text-xs text-muted-foreground">{chat.date}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuAction
                            onClick={(e) => handleDeleteChat(chat.id, e)}
                            showOnHover
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 size={14} />
                          </SidebarMenuAction>
                        </TooltipTrigger>
                        <TooltipContent>
                          Eliminar conversación
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                ))}
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.hash === "#history"}
                    className="mt-2 hover:bg-muted/50 rounded-md px-3 py-2"
                  >
                    <Link to="/profile?tab=history#history">
                      <Calendar size={16} />
                      <span>Ver historial completo</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            ) : (
              <div className="px-4 py-2 text-sm text-muted-foreground">No hay conversaciones previas</div>
            )}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};

export default ChatSidebar;
