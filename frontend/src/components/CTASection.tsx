
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-aiuda-blue/20 to-aiuda-coral/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-aiuda-navy mb-6">
          Comienza a usar AIUDA hoy mismo
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Obtén orientación médica inmediata y confiable con nuestro asistente virtual basado en inteligencia artificial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-aiuda-coral hover:bg-aiuda-coral/90">
            Comenzar ahora
          </Button>
          <Button size="lg" variant="outline" className="border-aiuda-blue text-aiuda-blue hover:bg-aiuda-blue/10">
            Contactar soporte
          </Button>
        </div>
      </div>
    </section>
  );
}
