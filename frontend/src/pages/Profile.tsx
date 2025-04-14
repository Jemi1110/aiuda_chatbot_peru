
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatBot from "@/components/ChatBot";
import { Settings, History } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useLocation, useSearchParams } from "react-router-dom";

type UserProfile = {
  name: string;
  avatar_url: string | null;
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tabParam = searchParams.get('tab') || 'chat';
  
  useEffect(() => {
    // Set the hash according to the active tab
    if (location.hash === '') {
      window.location.hash = `#${tabParam}`;
    }
  }, [tabParam, location.hash]);

  const [profile, setProfile] = useState<UserProfile>({ 
    name: user?.email?.split('@')[0] || 'Usuario',
    avatar_url: null
  });
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(profile.name);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.email?.split('@')[0] || 'Usuario',
        avatar_url: null
      });
      setName(user.email?.split('@')[0] || 'Usuario');
      
      // Load chat history (simulated)
      setTimeout(() => {
        setChatHistory([
          {
            id: 1,
            date: '12/04/2025',
            preview: 'Consulta sobre dolor de cabeza'
          },
          {
            id: 2,
            date: '10/04/2025',
            preview: 'Información sobre medicamentos para la gripe'
          }
        ]);
        setLoadingHistory(false);
      }, 1000);
    }
  }, [user]);

  const handleSaveProfile = () => {
    setProfile(prev => ({ ...prev, name }));
    setEditMode(false);
    toast({
      title: "Perfil actualizado",
      description: "Los cambios han sido guardados correctamente."
    });
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-10 px-4">
      <Tabs defaultValue={tabParam} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="chat" onClick={() => window.location.hash = '#chat'}>
            Chat médico
          </TabsTrigger>
          <TabsTrigger value="settings" onClick={() => window.location.hash = '#settings'}>
            <Settings className="mr-2 h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>
        
        {/* Content for each tab */}
        <TabsContent value="chat" className="flex justify-center">
          <ChatBot />
        </TabsContent>
        
        <TabsContent value="history">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-aiuda-navy">Historial de consultas</h2>
            <Separator className="mb-4" />
            
            {loadingHistory ? (
              <div className="flex justify-center py-8">
                <div className="animate-pulse text-muted-foreground">Cargando historial...</div>
              </div>
            ) : chatHistory.length > 0 ? (
              <div className="space-y-4">
                {chatHistory.map(chat => (
                  <Card key={chat.id} className="p-4 cursor-pointer hover:bg-muted/10 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{chat.preview}</p>
                        <p className="text-sm text-muted-foreground">{chat.date}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay consultas previas registradas.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4 text-aiuda-navy">Configuración del perfil</h2>
            <Separator className="mb-6" />
            
            {!editMode ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Nombre</h3>
                  <p className="text-lg">{profile.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Correo electrónico</h3>
                  <p className="text-lg">{user.email}</p>
                </div>
                
                <Button 
                  onClick={() => setEditMode(true)}
                  variant="outline"
                >
                  Editar perfil
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input 
                    id="email" 
                    value={user.email || ''}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">El correo electrónico no se puede modificar</p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSaveProfile}
                    className="bg-aiuda-coral hover:bg-aiuda-coral/90"
                  >
                    Guardar cambios
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditMode(false);
                      setName(profile.name);
                    }}
                    variant="outline"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
