import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const categories = [
  // Serviços Gerais
  "Limpeza",
  "Manutenção",
  "Reforma",
  "Jardinagem",
  "Pintura",
  "Elétrica",
  "Hidráulica",
  "Diarista",
  "Marido de Aluguel",
  
  // Aulas e Educação
  "Aula para Habilitados",
  "Educador Físico",
  "Aula de Violão",
  "Aula de Canto",
  "Aula de Bateria",
  "Aula de Guitarra",
  "Aula de Programação",
  
  // Tecnologia e Design
  "Designer",
  "Programador",
  
  // Outros
  "Outros"
].sort(); // Ordenar alfabeticamente para facilitar a busca

const cities = [
  "São Paulo",
  "Indaiatuba",
  "Salto",
  "Itu",
  "Sorocaba",
  "Campinas"
];

// Função para formatar o valor como moeda brasileira
const formatCurrency = (value: string) => {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, "");
  
  // Converte para centavos
  const cents = parseInt(numericValue) / 100;
  
  // Formata o número como moeda brasileira
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents);
};

// Função para limpar a formatação da moeda
const unformatCurrency = (value: string) => {
  return value.replace(/\D/g, "");
};

export default function PublishService() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchCategory, setSearchCategory] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    location: "",
    category: "",
    type: ""
  });

  // Filtra as categorias baseado na pesquisa
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "budget") {
      // Para o campo de orçamento, aplica a formatação de moeda
      const unformattedValue = unformatCurrency(value);
      const formattedValue = unformattedValue ? formatCurrency(unformattedValue) : "";
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value
    }));
  };

  const handleLocationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      location: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado para publicar um serviço");
        navigate("/login");
        return;
      }

      // Verificar se o usuário é um cliente
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (!profile || profile.user_type !== 'client') {
        toast.error("Apenas clientes podem publicar serviços");
        navigate("/dashboard");
        return;
      }

      // Validar campos obrigatórios
      if (!formData.title || !formData.description || !formData.location || !formData.category || !formData.budget || !formData.type) {
        toast.error("Por favor, preencha todos os campos obrigatórios");
        return;
      }

      // Converter o valor formatado para número
      const budgetValue = parseFloat(unformatCurrency(formData.budget)) / 100;
      if (isNaN(budgetValue) || budgetValue <= 0) {
        toast.error("Por favor, informe um valor válido para o orçamento");
        return;
      }

      // Criar o serviço
      const { error } = await supabase
        .from('service_requests')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          budget: budgetValue,
          location: formData.location,
          category: formData.category,
          type: formData.type,
          client_id: session.user.id,
          status: 'pending'
        });

      if (error) {
        console.error("Erro ao publicar serviço:", error);
        throw new Error(error.message);
      }

      toast.success("Serviço publicado com sucesso!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Erro ao publicar serviço:", error);
      toast.error(error.message || "Erro ao publicar serviço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Publicar Novo Serviço</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Título do Serviço
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Pintura de apartamento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição
              </label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva os detalhes do serviço..."
                required
                className="min-h-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Orçamento
              </label>
              <Input
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="R$ 0,00"
                className="font-mono"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Localização
              </label>
              <div className="relative">
                <select
                  value={formData.location}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  required
                >
                  <option value="">Selecione a cidade</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Tipo de Serviço
              </label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                  required
                >
                  <option value="">Selecione o tipo</option>
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <Select value={formData.category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg">
                  <div className="max-h-[200px] overflow-y-auto">
                    <Input
                      placeholder="Procurar categoria..."
                      value={searchCategory}
                      onChange={(e) => setSearchCategory(e.target.value)}
                      className="mb-2 mx-2 w-[calc(100%-1rem)]"
                    />
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <SelectItem 
                          key={category} 
                          value={category}
                          className="cursor-pointer hover:bg-gray-100"
                        >
                          {category}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Nenhuma categoria encontrada
                      </div>
                    )}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Publicando..." : "Publicar Serviço"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
