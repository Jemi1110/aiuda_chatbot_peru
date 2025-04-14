
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,rgba(154,224,233,0.15),rgba(255,255,255,0))]" />
      
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-aiuda-navy mb-4">
            Tu asistente médico <span className="text-aiuda-coral">inteligente</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
            Obtén información médica confiable al instante para estudiantes de la UTP y público en general
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" className="bg-aiuda-coral hover:bg-aiuda-coral/90 text-white">
              Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-aiuda-blue text-aiuda-blue hover:bg-aiuda-blue/10">
              Aprender más
            </Button>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-aiuda-blue/20 animate-float" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-aiuda-coral/20 animate-float" style={{ animationDelay: "1s" }} />
            
            <div className="bg-white rounded-2xl shadow-xl border border-muted p-6 animate-pulse-soft">
              <img 
                src="/img/logo.png" 
                alt="AIUDA Logo" 
                className="h-16 mb-4 mx-auto" 
              />
              <h3 className="text-xl font-semibold text-center text-aiuda-navy mb-2">
                Asistencia médica inteligente
              </h3>
              <p className="text-center text-muted-foreground mb-4">
                Consulta síntomas, obtén recomendaciones y encuentra centros de salud cercanos.
              </p>
              <Button className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90">
                Hacer una consulta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
