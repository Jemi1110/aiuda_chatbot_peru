import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabase';
import { useChatbot } from "@/contexts/ChatbotContext";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [retentionDays, setRetentionDays] = useState(30);
  const { clearChatHistory, deleteChat, setChatRetentionDays } = useChatbot();

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
    }
  }, [user]);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        email: email
      });

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Correo electrónico actualizado correctamente",
      });
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el correo electrónico",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 text-aiuda-navy">Configuración</h1>
        
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-aiuda-navy">Cambiar correo electrónico</h2>
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !email}>
                {loading ? "Actualizando..." : "Actualizar correo"}
              </Button>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-aiuda-navy">Historial de chats</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="retentionDays">Días de retención de chats</Label>
                <Input
                  id="retentionDays"
                  type="number"
                  min="1"
                  max="365"
                  value={retentionDays}
                  onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                  className="mt-2 w-24"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Los chats se mantendrán durante los días especificados antes de ser eliminados automáticamente
                </p>
                <Button
                  onClick={() => setChatRetentionDays(retentionDays)}
                  className="mt-2"
                >
                  Guardar días de retención
                </Button>
              </div>

              <div className="border-t pt-4">
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que quieres eliminar todos los chats?')) {
                      clearChatHistory();
                    }
                  }}
                >
                  Limpiar historial completo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
