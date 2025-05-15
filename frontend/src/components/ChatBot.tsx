import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatbotContext } from "@/contexts/ChatbotContext";
import { useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  chat_id: string;
}

interface ChatBotProps {
  currentChatId: string | null;
}

export default function ChatBot({ currentChatId }: ChatBotProps) {
  const { toast } = useToast();
  const { messages, chat, isLoading, sendMessage, loadChat } = useContext(ChatbotContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Load chat history if currentChatId is provided
  useEffect(() => {
    if (currentChatId && !isLoading) {
      loadChat(currentChatId).catch((error) => {
        console.error('Error loading chat:', error);
        // Solo redirigir si no se ha creado un nuevo chat
        if (!error.message.includes('Se ha creado una nueva conversación')) {
          navigate('/profile');
        }
      });
    }
  }, [currentChatId, loadChat, navigate, isLoading]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
    const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    setShowScrollButton(!atBottom);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    if (messages.length > 0) {
      // Solo auto-scroll si no estamos viendo mensajes antiguos
      const messagesContainer = messagesEndRef.current;
      if (messagesContainer) {
        const { scrollHeight, scrollTop, clientHeight } = messagesContainer;
        const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
        
        if (atBottom) {
          scrollToBottom();
        }
      }
    }
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!user) {
      toast({
        title: "No autenticado",
        description: "Por favor, inicia sesión para usar el chatbot",
        variant: "destructive",
      });
      return;
    }

    await sendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col bg-white border rounded-lg">
        <ScrollArea className="flex-1 p-4" onScroll={handleScroll} ref={messagesEndRef}>
          {/* Agregamos un div de espaciado para evitar el efecto de rebote */}
          <div style={{ height: '1px' }}></div>
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-muted-foreground">
              <p className="text-base">Inicia una nueva conversación</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
              >
                <div
                  className={`p-3 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-aiuda-coral/10 text-aiuda-coral"
                      : "bg-aiuda-blue/10 text-aiuda-blue"
                  } rounded-lg`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} style={{ height: '1px' }} />
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
