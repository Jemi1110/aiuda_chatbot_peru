import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/services/chatService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '1',
        content: '¡Hola! Soy tu asistente de salud. ¿En qué puedo ayudarte hoy?',
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(input);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="container mx-auto max-w-4xl flex items-center">
          <div className="bg-white/20 p-2 rounded-full mr-3">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AIUDA - Asistente de Salud UTP</h1>
            <p className="text-sm text-blue-100">Estoy aquí para ayudarte con tus consultas de salud</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 container mx-auto max-w-4xl">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <Bot className="h-16 w-16 text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">¡Hola! Soy tu asistente de salud</h2>
            <p className="max-w-md">Pregúntame lo que necesites sobre salud, citas médicas o cualquier consulta relacionada.</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const showHeader = index === 0 || 
              new Date(messages[index - 1].timestamp).toDateString() !== message.timestamp.toDateString();

            return (
              <React.Fragment key={message.id}>
                {showHeader && (
                  <div className="text-center my-4">
                    <span className="bg-white/50 text-xs text-gray-500 px-3 py-1 rounded-full border border-gray-200">
                      {format(message.timestamp, "EEEE d 'de' MMMM", { locale: es })}
                    </span>
                  </div>
                )}
                <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-2`}>
                  <div 
                    className={`flex items-start gap-3 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-blue-600 border border-blue-100 shadow-sm'
                    }`}>
                      {message.isUser ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 ${
                      message.isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 text-right ${
                        message.isUser ? 'text-blue-200' : 'text-gray-400'
                      }`}>
                        {format(message.timestamp, 'HH:mm')}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Typing Indicator */}
      {isLoading && (
        <div className="flex justify-start px-4 pb-2">
          <div className="flex items-center bg-white rounded-full shadow-sm px-4 py-2 border border-gray-100">
            <div className="flex space-x-1">
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-2 w-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="ml-2 text-xs text-gray-500">AIUDA está escribiendo...</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-100 p-4 shadow-inner">
        <form 
          onSubmit={handleSubmit} 
          className="container mx-auto max-w-4xl flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              className="w-full pr-12 py-5 rounded-xl border-gray-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => {
                // Función para adjuntar archivos
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            </button>
          </div>
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()} 
            className="h-11 w-11 p-0 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            </Button>
          </form>
          <p className="text-xs text-center text-gray-400 mt-2">
            AIUDA puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
