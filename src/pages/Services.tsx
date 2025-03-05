
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Clock, Star, Tag } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  location: string;
  delivery_date: string | null;
  created_at: string;
  client_id: string;
}

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ServiceRequest[];
    }
  });

  const parsePriceRange = (range: string) => {
    const numbers = range.match(/\d+/g)?.map(Number);
    if (!numbers || numbers.length === 0) return { min: 0, max: Infinity };
    if (numbers.length === 1) return { min: numbers[0], max: Infinity };
    return { min: numbers[0], max: numbers[1] };
  };

  const filteredServices = useMemo(() => {
    if (!services) return [];
    
    return services.filter((service) => {
      const textMatch = searchQuery
        ? (service.title + service.category + service.description)
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      const { min, max } = parsePriceRange(priceRange);
      const priceMatch = service.budget >= min && service.budget <= max;

      return textMatch && priceMatch;
    });
  }, [searchQuery, priceRange, services]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setPriceRange("");
  };

  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
            Encontre Serviços
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por serviço ou categoria"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Input
                type="text"
                placeholder="Faixa de preço (ex: 100-500)"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                className="shrink-0"
                onClick={handleClearFilters}
              >
                Limpar
              </Button>
              <Button size="lg" className="shrink-0">
                Buscar
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {filteredServices.length} serviços encontrados
          </div>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary px-2 py-1 bg-primary/10 rounded-full">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {service.delivery_date 
                          ? new Date(service.delivery_date).toLocaleDateString()
                          : "Data a combinar"
                        }
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="font-medium">
                          R$ {service.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {service.location}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(service.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link to={`/servicos/${service.id}`}>
                      <Button className="w-full mt-4">
                        Ver Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Nenhum serviço encontrado com os filtros selecionados.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
