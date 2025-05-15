
import ChatBot from "@/components/ChatBot";
import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [showChatBot, setShowChatBot] = useState(false);
  
  return (
    <div className="min-h-screen">
      <main className="flex flex-col">
        <div className="py-16">
          <HeroSection />
        </div>
        
        <section id="chatbot-demo" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-aiuda-navy mb-4">Prueba nuestro asistente médico</h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Haz una consulta de prueba para ver cómo AIUDA puede ayudarte con orientación médica.
              </p>
            </div>
            
            <div className="w-full">
              {!showChatBot ? (
                <Button 
                  size="lg"
                  onClick={() => setShowChatBot(true)}
                  className="bg-aiuda-coral hover:bg-aiuda-coral/90 shadow-md hover:shadow-lg transition-all w-full max-w-md mx-auto"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Iniciar chat de demostración
                </Button>
              ) : (
                <div className="relative w-full">
                  <div className="absolute -right-4 -top-4 z-10">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full bg-white shadow-md hover:bg-red-50 border-red-100"
                      onClick={() => setShowChatBot(false)}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <ChatBot />
                </div>
              )}
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <HowItWorksSection />
        </section>
        
        <section className="py-16">
          <FeaturesSection />
        </section>
        
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-aiuda-navy mb-4 text-center">Acerca de AIUDA</h2>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                AIUDA es un proyecto desarrollado para ofrecer asistencia médica virtual a estudiantes de la Universidad Tecnológica del Perú (UTP) y público en general. Nuestro objetivo es proporcionar orientación médica inicial y confiable utilizando tecnología de inteligencia artificial.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                El sistema analiza los síntomas descritos por el usuario y proporciona información relevante, recomendaciones y, cuando es necesario, sugiere centros de salud cercanos para atención profesional.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                <strong>Importante:</strong> AIUDA no reemplaza la consulta médica profesional. Siempre recomendamos buscar atención médica para un diagnóstico adecuado y tratamiento.
              </p>
            </div>
          </div>
        </section>
        
        <section className="py-16">
          <CTASection />
        </section>
        
        <Footer />
      </main>
      {/* Floating Chat Button */}
      {!showChatBot && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            size="lg" 
            className="rounded-full w-14 h-14 shadow-lg bg-aiuda-coral hover:bg-aiuda-coral/90 transition-all hover:translate-y-[-3px]"
            onClick={() => {
              document.getElementById('chatbot-demo')?.scrollIntoView({ behavior: 'smooth' });
              setTimeout(() => setShowChatBot(true), 500);
            }}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;
