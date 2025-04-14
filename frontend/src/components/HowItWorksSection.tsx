
import { ArrowRight } from "lucide-react";

export default function HowItWorksSection() {
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
            <div key={index} className="relative">
              <div className="text-5xl font-bold text-aiuda-blue/20 mb-2">{step.number}</div>
              <h3 className="text-xl font-semibold text-aiuda-navy mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                  <ArrowRight className="h-6 w-6 text-aiuda-coral/70" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
