
import { MessageSquare, Map, History, Lock, Activity, BookOpen } from "lucide-react";

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

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

export default function FeaturesSection() {
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

  return (
    <section id="features" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-aiuda-navy mb-4">Características Principales</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AIUDA combina tecnología avanzada con información médica confiable para brindarte asistencia inmediata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
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
  );
}
