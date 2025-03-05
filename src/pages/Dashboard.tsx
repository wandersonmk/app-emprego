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
  PlusCircle,
  Home,
  Trash2,
  RefreshCw,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Corrigindo o caminho do import do AlertDialog

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

interface Service {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  status: string;
}

interface DashboardMetrics {
  totalServices: number;
  totalProposals: number;
  totalReviews: number;
  totalMessages: number;
}

interface Activity {
  id: string;
  type: 'service_created' | 'service_updated' | 'proposal_received' | 'message_received';
  title: string;
  description: string;
  created_at: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalServices: 0,
    totalProposals: 0,
    totalReviews: 0,
    totalMessages: 0
  });

  useEffect(() => {
    checkUser();
    loadServices();
    loadMetrics();
    loadActivities();
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

  async function loadServices() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .eq('client_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      toast.error("Erro ao carregar serviços");
    }
  }

  async function loadMetrics() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Contagem de serviços publicados
      const { count: servicesCount, error: servicesError } = await supabase
        .from('service_requests')
        .select('*', { count: 'exact' })
        .eq('client_id', session.user.id);

      if (servicesError) {
        console.error("Erro na contagem de serviços:", servicesError);
        return;
      }

      // Por enquanto, vamos mostrar apenas os serviços
      setMetrics({
        totalServices: servicesCount || 0,
        totalProposals: 0, // Implementaremos depois
        totalReviews: 0,   // Implementaremos depois
        totalMessages: 0    // Implementaremos depois
      });

    } catch (error: any) {
      console.error("Erro ao carregar métricas:", error);
      toast.error("Erro ao carregar métricas do dashboard");
    }
  }

  async function loadActivities() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Buscar serviços recentes
      const { data: recentServices, error: servicesError } = await supabase
        .from('service_requests')
        .select(`
          id,
          title,
          created_at,
          status,
          budget,
          location
        `)
        .eq('client_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (servicesError) {
        console.error("Erro ao buscar serviços:", servicesError);
        return;
      }

      // Formatar atividades de serviços
      const serviceActivities: Activity[] = (recentServices || []).map(service => ({
        id: service.id,
        type: 'service_created',
        title: 'Novo Serviço Publicado',
        description: `${service.title} - ${formatCurrency(service.budget)} - ${service.location}`,
        created_at: service.created_at,
        read: true
      }));

      // Ordenar por data mais recente
      const allActivities = [...serviceActivities].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setActivities(allActivities);
    } catch (error) {
      console.error("Erro ao carregar atividades:", error);
      toast.error("Erro ao carregar atividades recentes");
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

  function formatCurrency(value: number) {
    return `R$ ${value.toFixed(2)}`;
  }

  function formatActivityDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return format(date, "'Criado em' dd 'de' MMMM', às' HH:mm", {
        locale: ptBR
      });
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return dateString; // Retorna a string original em caso de erro
    }
  }

  function getActivityIcon(type: Activity['type']) {
    switch (type) {
      case 'service_created':
        return <PlusCircle className="h-4 w-4 text-primary" />;
      case 'service_updated':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'proposal_received':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'message_received':
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  }

  async function updateServiceStatus(serviceId: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from('service_requests')
        .update({ status: newStatus })
        .eq('id', serviceId);

      if (error) throw error;
      
      // Recarregar atividades e serviços
      loadActivities();
      loadServices();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do serviço");
    }
  }

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
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate("/")}
                  title="Ir para página inicial"
                >
                  <Home className="h-5 w-5" />
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
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
                    <p className="text-2xl font-semibold">{metrics.totalServices}</p>
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
                    <p className="text-2xl font-semibold">{metrics.totalProposals}</p>
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
                <p className="text-2xl font-semibold">{metrics.totalReviews}</p>
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
                <p className="text-2xl font-semibold">{metrics.totalMessages}</p>
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
              {userData?.user_type === 'professional' ? 'Oportunidades Recentes' : 'Meus Serviços'}
            </h3>
            <div className="max-h-[500px] overflow-y-auto pr-2">
              {services.length > 0 ? (
                services.map((service) => (
                  <div key={service.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{service.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {service.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {service.category}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {formatCurrency(service.budget)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {service.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/servico/${service.id}`)}
                        >
                          Ver Detalhes
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteService(service.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Você ainda não publicou nenhum serviço.</p>
                  <Button
                    onClick={() => navigate("/publicar-servico")}
                    variant="link"
                    className="mt-2"
                  >
                    Clique aqui para publicar seu primeiro serviço
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border"
                >
                  <div className="p-2 rounded-full bg-primary/10">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatActivityDate(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                Nenhuma atividade recente
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
