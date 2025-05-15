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
import { supabase } from "@/lib/supabase";
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

interface Chat {
  id: string;
  title: string;
  created_at: string;
  user_id: string;
}

const ChatSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setChats(data || []);
    } catch (error) {
      console.error('Error loading chats:', error);
      toast({
        title: "Error",
        description: "Error al cargar el historial de chats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isActive = (chatId: string) => {
    return location.search === `?chat=${chatId}`;
  };
  
  const handleNewChat = () => {
    navigate('/profile#chat');
    toast({
      title: "Nueva consulta",
      description: "Iniciando una nueva consulta médica"
    });
  };
  
  const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // First delete all messages associated with this chat
      const { error: messagesError } = await supabase
        .from('chat_history')
        .delete()
        .eq('chat_id', id);

      if (messagesError) throw messagesError;

      // Then delete the chat
      const { error: chatError } = await supabase
        .from('chats')
        .delete()
        .eq('id', id);

      if (chatError) throw chatError;

      setChats(prev => prev.filter(chat => chat.id !== id));
      
      // If the deleted chat was the current one, redirect to new chat
      if (location.search === `?chat=${id}`) {
        navigate('/profile#chat');
      }

      toast({
        title: "Conversación eliminada",
        description: "La conversación y sus mensajes han sido eliminados correctamente"
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la conversación",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <Button className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90 flex items-center gap-2" onClick={handleNewChat}>
          <Plus size={16} />
          <span>Nueva consulta</span>
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="mb-2 px-3 py-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CONSULTAS RECIENTES</h3>
        </div>
        
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="px-3">
            {isLoading ? (
              <div className="py-2 text-sm text-muted-foreground">Cargando historiales...</div>
            ) : chats.length === 0 ? (
              <div className="py-2 text-sm text-muted-foreground">No hay consultas recientes</div>
            ) : (
              chats.map((chat) => (
                <div key={chat.id} className="group relative">
                  <Link 
                    to={`/profile?chat=${chat.id}#chat`} 
                    className={`flex items-start gap-2 p-2 rounded-md transition-colors ${
                      isActive(chat.id) 
                        ? 'bg-aiuda-coral/10 text-aiuda-coral' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <MessageSquare size={16} className="mt-1 shrink-0" />
                    <div className="flex flex-col overflow-hidden flex-1">
                      <span className="truncate font-medium">{chat.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Eliminar conversación
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChatSidebar;
