import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  created_at: string;
}

interface SimpleChatBotProps {
  token: string;
}

export default function SimpleChatBot({ token }: SimpleChatBotProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  useEffect(() => {
    console.log('SimpleChatBot received token:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 10),
      tokenEnd: token?.substring(token?.length - 10),
      isValidLength: token?.length >= 100
    });

    const getOrCreateChat = async () => {
      try {
        const { data: existingChat, error: getError } = await supabase
          .from('chats')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (getError && getError.code !== 'PGRST116') {
          throw getError;
        }

        if (existingChat) {
          setChatId(existingChat.id);
          return existingChat.id;
        }

        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            title: `Chat ${new Date().toISOString().split('T')[0]}`,
            user_id: user.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        setChatId(newChat.id);
        return newChat.id;
      } catch (error) {
        console.error('Error getting/creating chat:', error);
        toast({
          title: "Error",
          description: "No se pudo obtener el chat",
          variant: "destructive"
        });
        return null;
      }
    };

    getOrCreateChat();
  }, [user, token]);

  const sendMessage = async (content: string) => {
    if (!user || !token) {
      toast({
        title: "Error",
        description: "No se puede enviar mensaje sin usuario o token",
        variant: "destructive"
      });
      return;
    }

    if (!chatId) {
      try {
        const { data: newChat, error: createError } = await supabase
          .from('chats')
          .insert({
            title: `Chat ${new Date().toISOString().split('T')[0]}`,
            user_id: user.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) throw createError;
        setChatId(newChat.id);
      } catch (error) {
        console.error('Error creating chat:', error);
        toast({
          title: "Error",
          description: "No se pudo crear el chat",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      if (!token || !token.trim()) {
        throw new Error('Token no disponible');
      }

      console.log('Sending message to backend:', {
        hasToken: !!token,
        tokenLength: token.length,
        payload: {
          in1: content
        }
      });

      // Enviar directamente el formato que Stack AI espera
      const payload = {
        "in-1": content
      };

      try {
        const response = await axios.post('http://localhost:4000/api/stack-ai', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 seconds timeout
        });

        console.log('Backend response received:', {
          status: response.status,
          data: response.data
        });

        return response.data;
      } catch (error) {
        console.error('Error en llamada al backend:', {
          error: error,
          message: error?.message,
          status: error?.response?.status,
          data: error?.response?.data,
          request: {
            url: error?.config?.url,
            method: error?.config?.method,
            headers: error?.config?.headers,
            data: error?.config?.data
          }
        });
        throw error;
      }

      return response.data;
    } catch (error) {
      console.error('Error en sendMessage:', {
        error: error,
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);

    try {
      if (!chatId) {
        try {
          const { data: newChat, error: createError } = await supabase
            .from('chats')
            .insert({
              title: `Chat ${new Date().toISOString().split('T')[0]}`,
              user_id: user.id,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) throw createError;
          setChatId(newChat.id);
        } catch (error) {
          console.error('Error creating chat:', error);
          toast({
            title: "Error",
            description: "No se pudo crear el chat",
            variant: "destructive"
          });
          return;
        }
      }

      const { data: userMessage, error: userError } = await supabase
        .from('chat_history')
        .insert({
          content: input,
          sender: 'user',
          chat_id: chatId,
          user_id: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (userError) throw userError;

      setMessages(prev => [
        ...prev,
        {
          id: userMessage.id,
          content: userMessage.content,
          sender: 'user' as const,
          created_at: userMessage.created_at
        }
      ]);

      setInput('');

      const response = await sendMessage(input);

      if (response?.success) {
        const { data: botMessage, error: botError } = await supabase
          .from('chat_history')
          .insert({
            content: response.message,
            sender: 'bot',
            chat_id: chatId,
            user_id: user.id,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (botError) throw botError;

        setMessages(prev => [
          ...prev,
          {
            id: botMessage.id,
            content: botMessage.content,
            sender: 'bot' as const,
            created_at: botMessage.created_at
          }
        ]);
      } else {
        throw new Error('Invalid response from Stack AI');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al enviar el mensaje",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 rounded-lg border border-gray-300 p-2"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}
