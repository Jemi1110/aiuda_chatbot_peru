import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './AuthContext';
import axios from 'axios';

// Función para obtener el token de sesión de Supabase
export const getSessionToken = async (): Promise<string> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error obteniendo sesión:', error);
      throw error;
    }

    if (!session || !session.access_token) {
      throw new Error('No hay sesión activa o token no disponible');
    }

    console.log('Sesión obtenida:', {
      hasSession: !!session,
      hasToken: !!session.access_token,
      tokenLength: session.access_token.length
    });

    return session.access_token;
  } catch (error) {
    console.error('Error en getSessionToken:', error);
    throw error;
  }
};

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  chat_id: string;
}

interface Chat {
  id: string;
  title: string;
  user_id: string;
  created_at: string;
}

export interface ChatbotContextType {
  messages: Message[];
  chat: Chat | null;
  isLoading: boolean;
  isChatLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  startNewChat: (title: string) => Promise<void>;
  loadChat: (chatId: string) => Promise<void>;
  saveChat: (chatId: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  setChatRetentionDays: (days: number) => Promise<void>;
}

export const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const { user: authUser } = useAuth();
  const [retentionDays, setRetentionDays] = useState<number>(30);

  // Función para manejar estados de carga
  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
    setIsChatLoading(loading);
  };

  // Resetear estados de carga cuando el componente se monta
  useEffect(() => {
    setIsLoading(false);
    setIsChatLoading(false);
  }, []);

  // Función para obtener el token de sesión
  const getSessionToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session found');
    return session.access_token;
  };

  // Función para enviar mensajes al chatbot
  const sendMessage = async (content: string) => {
    console.log('Using API URL:', import.meta.env.VITE_BACKEND_URL);
    if (!import.meta.env.VITE_BACKEND_URL) {
      throw new Error('Backend URL not configured');
    }
    if (!authUser) {
      toast({
        title: "No autenticado",
        description: "Por favor, inicia sesión para usar el chatbot",
        variant: "destructive",
      });
      return;
    }

    try {
      handleLoading(true);
      console.log('Starting sendMessage with content:', content);

      // Si no hay chat activo, crear uno nuevo
      if (!chat) {
        console.log('No active chat, creating new one...');
        const newChatTitle = content.substring(0, 30) + '...';
        const { data: newChat, error: newChatError } = await supabase
          .from('chats')
          .insert({
            title: newChatTitle,
            user_id: authUser.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (newChatError) {
          console.error('Error creating new chat:', newChatError);
          throw newChatError;
        }
        setChat(newChat);
        console.log('New chat created:', newChat);
      }

      // Obtener el token de sesión usando la función exportada
      const token = await getSessionToken(authUser);
      console.log('Obtenido token de sesión:', token.substring(0, 10) + '...');
      console.log('Detalles del token de sesión:', {
        token: token.substring(0, 20) + '...',
        tipo: typeof token,
        longitud: token.length
      });

      // Preparar el payload para Stack AI
      const payload = {
        "in-1": content
      };
      console.log('Payload para Stack AI:', {
        in1: payload['in-1']
      });

      // Configurar el header para la API
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 segundos de timeout
      };
      console.log('Configuración de headers:', {
        'Authorization': config.headers.Authorization.substring(0, 20) + '...',
        'Content-Type': config.headers['Content-Type']
      });

      // Llamar a la API con el payload correcto
      try {
        const response = await axios.post('http://localhost:4000/api/stack-ai', payload, config);
        console.log('Respuesta recibida del backend:', {
          status: response.status,
          data: response.data
        });

        // Procesar la respuesta
        const botContent = response.data.messages[1].content;
        console.log('Contenido recibido del bot:', botContent.substring(0, 50) + '...');
        if (!response.data.success) {
          throw new Error(response.data.error || 'Error en la respuesta del chatbot');
        }

        const botResponse = response.data.data.answer;
        console.log('Bot response received:', botResponse);

        // Guardar el mensaje del usuario
        const { data: messageData, error: messageError } = await supabase
          .from('chat_history')
          .insert({
            content,
            sender: 'user',
            chat_id: chat.id,
            user_id: authUser.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (messageError) {
          console.error('Error saving user message:', messageError);
          throw messageError;
        }
        console.log('User message saved:', messageData);

        // Guardar la respuesta del bot
        const { data: botMessageData, error: botMessageError } = await supabase
          .from('chat_history')
          .insert({
            content: botResponse,
            sender: 'bot',
            chat_id: chat.id,
            user_id: authUser.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (botMessageError) {
          console.error('Error saving bot response:', botMessageError);
          throw botMessageError;
        }
        console.log('Bot response saved:', botMessageData);

        // Actualizar el estado con los nuevos mensajes
        setMessages(prevMessages => [...prevMessages, messageData, botMessageData]);
        
        toast({
          title: "Éxito",
          description: "Respuesta recibida del chatbot",
        });

        return botResponse;
      } catch (error) {
        console.error('Error calling chatbot API:', {
          error: error,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        throw new Error('Error al comunicarse con el chatbot');
      }
    } catch (error) {
      console.error('Error sending message:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar el mensaje",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para iniciar nuevo chat
  const startNewChat = async (title: string) => {
    if (!authUser) return;

    try {
      handleLoading(true);
      // Create new chat
      const { data: newChat, error: newChatError } = await supabase
        .from('chats')
        .insert({
          title,
          user_id: authUser.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (newChatError) throw newChatError;

      // Update state with new chat
      setChat(newChat);
      setMessages([]); // Start with empty messages
      
      // Update URL hash to reflect new chat
      window.location.hash = `chat=${newChat.id}`;

      toast({
        title: "Éxito",
        description: "Nueva conversación creada",
      });

      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      toast({
        title: "Error",
        description: "Error al crear una nueva conversación",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar chat existente
  const loadChat = async (chatId: string) => {
    if (!authUser) return;

    try {
      handleLoading(true);
      // Load chat details
      const { data: chatData, error: chatError } = await supabase
        .from('chats')
        .select('*')
        .eq('id', chatId)
        .eq('user_id', authUser.id)
        .single();

      if (chatError) throw chatError;

      // Load messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_history')
        .select('*')
        .eq('chat_id', chatId)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Update state
      setChat(chatData);
      setMessages(messagesData || []);

      toast({
        title: "Éxito",
        description: "Chat cargado correctamente",
      });
    } catch (error) {
      console.error('Error loading chat:', error);
      toast({
        title: "Error",
        description: "Error al cargar el chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar chat
  const saveChat = async (chatId: string, title: string) => {
    if (!authUser) return;

    try {
      handleLoading(true);
      // Update chat title
      const { error: updateError } = await supabase
        .from('chats')
        .update({ title })
        .eq('id', chatId)
        .eq('user_id', authUser.id);

      if (updateError) throw updateError;

      // Update chat in state
      setChat(prev => prev && prev.id === chatId ? { ...prev, title } : prev);

      toast({
        title: "Éxito",
        description: "Título del chat actualizado",
      });
    } catch (error) {
      console.error('Error saving chat:', error);
      toast({
        title: "Error",
        description: "Error al guardar el chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar chat
  const deleteChat = async (chatId: string) => {
    if (!authUser) return;

    try {
      handleLoading(true);
      // Delete chat and its messages
      const { error: chatError } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', authUser.id);

      const { error: messagesError } = await supabase
        .from('chat_history')
        .delete()
        .eq('chat_id', chatId)
        .eq('user_id', authUser.id);

      if (chatError || messagesError) throw new Error('Error al eliminar el chat');

      // Reset state
      setChat(null);
      setMessages([]);

      toast({
        title: "Éxito",
        description: "Chat eliminado correctamente",
      });

      // Update URL hash
      window.location.hash = '';
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Error al eliminar el chat",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para limpiar historial de chat
  const clearChatHistory = async () => {
    if (!authUser) return;

    try {
      handleLoading(true);
      // Delete all user's chats and messages
      const { error: chatsError } = await supabase
        .from('chats')
        .delete()
        .eq('user_id', authUser.id);

      const { error: messagesError } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', authUser.id);

      if (chatsError || messagesError) throw new Error('Error al limpiar el historial');

      // Reset state
      setChat(null);
      setMessages([]);

      toast({
        title: "Éxito",
        description: "Historial limpiado correctamente",
      });

      // Update URL hash
      window.location.hash = '';
    } catch (error) {
      console.error('Error clearing chat history:', error);
      toast({
        title: "Error",
        description: "Error al limpiar el historial",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para establecer días de retención
  const setChatRetentionDays = async (days: number) => {
    try {
      setRetentionDays(days);
      toast({
        title: "Éxito",
        description: `Días de retención actualizados a ${days}`,
      });
    } catch (error) {
      console.error('Error setting retention days:', error);
      toast({
        title: "Error",
        description: "Error al establecer días de retención",
        variant: "destructive",
      });
    }
  };

  return (
    <ChatbotContext.Provider value={{
      messages,
      chat,
      isLoading,
      isChatLoading,
      sendMessage,
      startNewChat,
      loadChat,
      saveChat,
      deleteChat,
      clearChatHistory,
      setChatRetentionDays
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot debe ser usado dentro de un ChatbotProvider');
  }
  return context;
}

export default ChatbotProvider;
