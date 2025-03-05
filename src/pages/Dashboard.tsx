
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LogOut, 
  User, 
  Calendar, 
  MessageSquare, 
  Star, 
  Settings,
  Bell,
  Briefcase,
  Clock,
  PlusCircle
} from "lucide-react";
import { toast } from "sonner";

interface UserData {
  email: string;
  name?: string;
  user_type?: 'client' | 'professional';
}

interface Notification {
  id: number;
  message: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      
      // Buscar perfil do usuário incluindo o tipo
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      
      setUserData({
        email: session.user.email || '',
        name: profile.name || session.user.user_metadata?.name,
        user_type: profile.user_type
      });
      
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      navigate("/login");
    }
  }

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error: any) {
      toast.error("Erro ao fazer logout");
    }
  }

  const handleNotifications = () => {
    toast.info("Em breve você poderá ver suas notificações aqui!");
  };

  const handleProfileClick = () => {
    toast.info("Página de perfil em desenvolvimento");
  };

  const handleScheduleClick = () => {
    toast.info("Sistema de agendamento em desenvolvimento");
  };

  const handleMessagesClick = () => {
    toast.info("Sistema de mensagens em desenvolvimento");
  };

  const handleSettingsClick = () => {
    toast.info("Configurações em desenvolvimento");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">ServiceConnect</h1>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNotifications}
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Olá, {userData?.name || 'Usuário'}!
          </h2>
          <p className="text-gray-600">
            {userData?.user_type === 'professional' 
              ? 'Bem-vindo ao seu painel profissional' 
              : 'Bem-vindo ao seu painel de cliente'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userData?.user_type === 'professional' ? (
            // Stats para profissionais
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Propostas Enviadas</p>
                    <p className="text-2xl font-semibold">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Projetos Ativos</p>
                    <p className="text-2xl font-semibold">0</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Stats para clientes
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Serviços Publicados</p>
                    <p className="text-2xl font-semibold">0</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Propostas Recebidas</p>
                    <p className="text-2xl font-semibold">0</p>
                  </div>
                </div>
              </div>
            </>
          )}
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-50 p-3 rounded-full">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avaliações</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 p-3 rounded-full">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mensagens</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Ações Rápidas</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center"
                onClick={handleProfileClick}
              >
                <User className="h-5 w-5 mb-2" />
                <span>Meu Perfil</span>
              </Button>

              {userData?.user_type === 'client' ? (
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center"
                  onClick={() => navigate("/publicar-servico")}
                >
                  <PlusCircle className="h-5 w-5 mb-2" />
                  <span>Publicar Serviço</span>
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center"
                  onClick={() => navigate("/servicos")}
                >
                  <Briefcase className="h-5 w-5 mb-2" />
                  <span>Buscar Serviços</span>
                </Button>
              )}

              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center"
                onClick={handleMessagesClick}
              >
                <MessageSquare className="h-5 w-5 mb-2" />
                <span>Mensagens</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center"
                onClick={handleSettingsClick}
              >
                <Settings className="h-5 w-5 mb-2" />
                <span>Configurações</span>
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">
              {userData?.user_type === 'professional' ? 'Oportunidades Recentes' : 'Propostas Recentes'}
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-center py-8">
                {userData?.user_type === 'professional' 
                  ? 'Nenhuma oportunidade disponível' 
                  : 'Nenhuma proposta recebida'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-8">
              Nenhuma atividade recente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
