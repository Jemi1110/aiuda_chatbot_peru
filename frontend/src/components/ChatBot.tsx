
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, Save, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function ChatBot() {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get('chat');
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "¡Hola! Soy AIUDA, tu asistente médico virtual. ¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatTitle, setChatTitle] = useState(chatId ? `Consulta #${chatId}` : "Nueva consulta");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Load chat history based on chatId
  useEffect(() => {
    if (chatId) {
      // In a real app, you would fetch chat history from a database
      if (chatId === "1") {
        setMessages([
          {
            id: "1",
            content: "¡Hola! Soy AIUDA, tu asistente médico virtual. ¿En qué puedo ayudarte hoy?",
            sender: "bot",
            timestamp: new Date(2025, 3, 12, 10, 30),
          },
          {
            id: "2",
            content: "Tengo un dolor de cabeza muy fuerte desde ayer",
            sender: "user",
            timestamp: new Date(2025, 3, 12, 10, 31),
          },
          {
            id: "3",
            content: "Siento escuchar sobre tu dolor de cabeza. ¿Podrías describir la intensidad y localización del dolor? ¿Has tomado algún medicamento?",
            sender: "bot",
            timestamp: new Date(2025, 3, 12, 10, 31),
          },
        ]);
        setChatTitle("Consulta sobre dolor de cabeza");
      } else if (chatId === "2") {
        setMessages([
          {
            id: "1",
            content: "¡Hola! Soy AIUDA, tu asistente médico virtual. ¿En qué puedo ayudarte hoy?",
            sender: "bot",
            timestamp: new Date(2025, 3, 10, 15, 20),
          },
          {
            id: "2",
            content: "¿Qué medicamentos son recomendados para la gripe?",
            sender: "user",
            timestamp: new Date(2025, 3, 10, 15, 21),
          },
          {
            id: "3",
            content: "Para la gripe común, se suelen recomendar medicamentos para aliviar los síntomas como paracetamol o ibuprofeno para la fiebre y el dolor, descongestionantes nasales para la congestión, y antihistamínicos para los estornudos y la secreción nasal. Recuerda que estos medicamentos no curan la gripe, solo alivian los síntomas. ¿Tienes algún síntoma específico que te preocupe?",
            sender: "bot",
            timestamp: new Date(2025, 3, 10, 15, 21),
          },
        ]);
        setChatTitle("Información sobre medicamentos para la gripe");
      }
    }
  }, [chatId]);

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
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "Estoy procesando tu consulta. Por favor ten en cuenta que soy un prototipo y actualmente no tengo integración con una IA médica real.";

      // Simple keyword matching for demo purposes
      if (inputValue.toLowerCase().includes("dolor")) {
        botResponse = "Entiendo que estás experimentando dolor. ¿Podrías describir dónde sientes el dolor y cuánto tiempo llevas con él? Esto me ayudará a darte una mejor orientación.";
      } else if (inputValue.toLowerCase().includes("fiebre")) {
        botResponse = "La fiebre puede ser síntoma de muchas condiciones. ¿Has medido tu temperatura? ¿Tienes otros síntomas como dolor de cabeza, fatiga o dolor muscular?";
      } else if (inputValue.toLowerCase().includes("gripe") || inputValue.toLowerCase().includes("resfriado")) {
        botResponse = "Para síntomas de gripe o resfriado, te recomiendo descansar, mantenerte hidratado y considerar analgésicos de venta libre como paracetamol. Si los síntomas persisten más de una semana, deberías consultar a un médico.";
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      
      // If this is a new chat, update the title based on the first user message
      if (!chatId && messages.length <= 2) {
        const newTitle = `Consulta: ${userMessage.content.substring(0, 30)}${userMessage.content.length > 30 ? '...' : ''}`;
        setChatTitle(newTitle);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  
  const handleSaveChat = () => {
    toast({
      title: "Conversación guardada",
      description: "La conversación ha sido guardada correctamente"
    });
  };

  return (
    <Card className="w-full max-w-3xl h-[calc(100vh-120px)] shadow-xl border-aiuda-blue/20 relative">
      <div className="bg-gradient-to-r from-aiuda-blue to-aiuda-coral p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-full p-1.5">
              <Bot className="h-5 w-5 text-aiuda-navy" />
            </div>
            <h2 className="text-white font-bold">{chatTitle}</h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSaveChat} 
            className="text-white hover:bg-white/20"
          >
            <Save className="h-4 w-4 mr-1" />
            Guardar
          </Button>
        </div>
      </div>

      <CardContent className="p-0 flex flex-col h-[calc(100%-64px)]">
        <ScrollArea 
          className="flex-1 p-4"
          onScroll={handleScroll}
        >
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    message.sender === "user"
                      ? "bg-aiuda-coral text-white px-4 py-3 rounded-2xl rounded-tr-none shadow-sm max-w-[80%] transition-all hover:shadow-md"
                      : "bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] transition-all hover:shadow-md"
                  }
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {showScrollButton && (
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-20 right-4 rounded-full shadow-md h-10 w-10 bg-white"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-5 w-5" />
          </Button>
        )}

        <div className="p-4 border-t bg-muted/10">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu consulta médica..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 border-aiuda-blue/30 rounded-full focus-visible:ring-aiuda-coral"
            />
            <Button
              onClick={handleSendMessage}
              disabled={inputValue.trim() === ""}
              className="bg-aiuda-coral hover:bg-aiuda-coral/90 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
