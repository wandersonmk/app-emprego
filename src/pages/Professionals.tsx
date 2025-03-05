
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dados mockados para exemplo
const professionals = [
  {
    id: "1",
    name: "Ana Silva",
    profession: "Designer UX/UI",
    location: "São Paulo, SP",
    rating: 4.8,
    reviews: 156,
    hourlyRate: 120,
    imageUrl: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Carlos Santos",
    profession: "Desenvolvedor Full Stack",
    location: "Rio de Janeiro, RJ",
    rating: 4.9,
    reviews: 243,
    hourlyRate: 150,
    imageUrl: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Julia Costa",
    profession: "Marketing Digital",
    location: "Curitiba, PR",
    rating: 4.7,
    reviews: 89,
    hourlyRate: 100,
    imageUrl: "https://i.pravatar.cc/150?img=3",
  },
];

const Professionals = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      
      {/* Search Section */}
      <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">
            Encontre Profissionais
          </h1>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nome ou especialidade"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <Input type="text" placeholder="Cidade" />
            </div>
            <Button size="lg" className="shrink-0">
              Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((professional) => (
              <div
                key={professional.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={professional.imageUrl}
                    alt={professional.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-lg text-gray-900">
                      {professional.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {professional.profession}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <MapPin className="w-4 h-4" />
                      {professional.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">
                          {professional.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({professional.reviews} avaliações)
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        R$ {professional.hourlyRate}/hora
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/profissionais/${professional.id}`)}
                      >
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Professionals;
