import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils"; 
import { ArrowLeft, Calendar, MapPin, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
} from "@/components/ui/alert-dialog";

interface ServiceDetails {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  client_id: string;
  client: {
    id: string;
    name: string;
  };
}

export default function ServiceDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState<ServiceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function loadService() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        // Primeiro, busca os dados do serviço
        const { data: serviceData, error: serviceError } = await supabase
          .from('service_requests')
          .select('*')
          .eq('id', id)
          .single();

        if (serviceError) throw serviceError;
        
        if (!serviceData) {
          toast.error("Serviço não encontrado");
          navigate("/dashboard");
          return;
        }

        // Depois, busca os dados do cliente
        const { data: clientData, error: clientError } = await supabase
          .from('user_profiles')
          .select('name')
          .eq('id', serviceData.client_id)
          .single();

        if (clientError) {
          console.error("Erro ao buscar dados do cliente:", clientError);
        }

        // Combina os dados
        setService({
          ...serviceData,
          client: {
            id: serviceData.client_id,
            name: clientData?.name || "Nome não disponível"
          }
        });
      } catch (error: any) {
        console.error("Erro ao carregar serviço:", error);
        toast.error(error.message || "Erro ao carregar serviço");
      } finally {
        setLoading(false);
      }
    }

    loadService();
  }, [id, navigate]);

  useEffect(() => {
    async function checkOwnership() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && service) {
        setIsOwner(session.user.id === service.client_id);
      }
    }
    checkOwnership();
  }, [service]);

  async function handleDeleteService() {
    try {
      setLoading(true);

      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado para excluir o serviço");
        return;
      }

      // Verificar se o usuário é o dono do serviço
      const { data: serviceCheck } = await supabase
        .from('service_requests')
        .select('client_id')
        .eq('id', id)
        .single();

      if (!serviceCheck || serviceCheck.client_id !== session.user.id) {
        toast.error("Você não tem permissão para excluir este serviço");
        return;
      }

      // Primeiro exclui todas as propostas relacionadas ao serviço
      const { data: deletedProposals, error: proposalsError } = await supabase
        .from('service_proposals')
        .delete()
        .eq('service_id', id)
        .select();

      if (proposalsError) {
        console.error("Erro ao excluir propostas:", proposalsError);
        toast.error(`Erro ao excluir propostas: ${proposalsError.message}`);
        return;
      }

      console.log("Propostas excluídas:", deletedProposals);

      // Depois exclui o serviço
      const { data: deletedService, error: serviceError } = await supabase
        .from('service_requests')
        .delete()
        .eq('id', id)
        .select();

      if (serviceError) {
        console.error("Erro ao excluir serviço:", serviceError);
        toast.error(`Erro ao excluir serviço: ${serviceError.message}`);
        return;
      }

      console.log("Serviço excluído:", deletedService);

      toast.success("Serviço excluído com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro ao excluir serviço:", error);
      toast.error(error.message || "Erro ao excluir serviço");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {isOwner && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading}>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Serviço
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Isso excluirá permanentemente seu serviço
                  e removerá os dados do nosso servidor.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteService}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sim, excluir serviço
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{service.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(service.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {service.location}
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              {service.category}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Descrição</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Orçamento</h2>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(service.budget)}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          <div className="inline-block px-3 py-1 rounded-full text-sm font-medium capitalize" 
            style={{
              backgroundColor: 
                service.status === "pending" ? "rgb(253 224 71)" :
                service.status === "in_progress" ? "rgb(147 197 253)" :
                service.status === "completed" ? "rgb(134 239 172)" :
                "rgb(252 165 165)",
              color:
                service.status === "pending" ? "rgb(161 98 7)" :
                service.status === "in_progress" ? "rgb(30 58 138)" :
                service.status === "completed" ? "rgb(21 128 61)" :
                "rgb(153 27 27)"
            }}>
            {service.status === "pending" ? "Pendente" :
             service.status === "in_progress" ? "Em Andamento" :
             service.status === "completed" ? "Concluído" :
             "Cancelado"}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Cliente</h2>
          <p className="text-gray-700">{service.client.name}</p>
        </div>
      </Card>
    </div>
  );
}
