import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageSquare, Map, History, Lock, Activity, BookOpen } from 'lucide-react';

// Componente de característica reutilizable
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-muted hover:shadow-lg transition-shadow">
      <div className="bg-aiuda-blue/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-aiuda-navy">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

const HomePage = () => {
  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-aiuda-blue" />,
      title: "Chatbot Inteligente",
      description: "Interactúa con nuestro asistente médico basado en IA para obtener respuestas a tus consultas de salud.",
    },
    {
      icon: <Map className="h-6 w-6 text-aiuda-blue" />,
      title: "Centros de Salud",
      description: "Encuentra centros médicos cercanos basados en tu ubicación y necesidades específicas.",
    },
    {
      icon: <History className="h-6 w-6 text-aiuda-blue" />,
      title: "Historial de Consultas",
      description: "Accede a tu historial de conversaciones para dar seguimiento a tus consultas anteriores.",
    },
    {
      icon: <Lock className="h-6 w-6 text-aiuda-blue" />,
      title: "Privacidad Asegurada",
      description: "Tu información médica está protegida con los más altos estándares de seguridad.",
    },
    {
      icon: <Activity className="h-6 w-6 text-aiuda-blue" />,
      title: "Análisis de Síntomas",
      description: "Recibe orientación basada en los síntomas que describes para una mejor comprensión.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-aiuda-blue" />,
      title: "Recursos Educativos",
      description: "Accede a información médica verificada y recursos educativos sobre salud.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Describe tus síntomas",
      description: "Inicia una conversación con nuestro chatbot y describe lo que sientes con tus propias palabras.",
    },
    {
      number: "02",
      title: "Recibe orientación",
      description: "El sistema analizará tus síntomas y te proporcionará información médica relevante y orientación inicial.",
    },
    {
      number: "03",
      title: "Recomendaciones personalizadas",
      description: "Obtén consejos de autocuidado o recomendaciones para buscar atención médica según tu situación.",
    },
    {
      number: "04",
      title: "Encuentra centros de salud",
      description: "Si necesitas atención médica, te ayudamos a encontrar centros de salud cercanos según tus necesidades.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
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
              <Button asChild size="lg" className="bg-aiuda-coral hover:bg-aiuda-coral/90 text-white">
                <Link to="/chat">
                  Comenzar ahora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-aiuda-blue text-aiuda-blue hover:bg-aiuda-blue/10">
                Aprender más
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
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
                <Button className="w-full bg-aiuda-coral hover:bg-aiuda-coral/90" asChild>
                  <Link to="/chat">Hacer una consulta</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aiuda-navy mb-4">Características Principales</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AIUDA combina tecnología avanzada con información médica confiable para brindarte asistencia inmediata.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature: FeatureProps, index: number) => (
              <Feature
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-aiuda-navy mb-4">¿Cómo Funciona?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AIUDA utiliza inteligencia artificial para analizar tus síntomas y brindarte orientación médica de forma rápida y confiable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative p-6 text-center">
                <div className="text-5xl font-bold text-aiuda-blue/20 mb-2">{step.number}</div>
                <h3 className="text-xl font-semibold text-aiuda-navy mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-aiuda-navy text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para comenzar?</h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a nuestra comunidad y descubre cómo la inteligencia artificial puede ayudarte con tus preguntas de salud.
          </p>
          <Button asChild className="bg-white text-aiuda-navy hover:bg-white/90 text-lg py-6 px-8">
            <Link to="/register">
              Crear cuenta gratuita
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
