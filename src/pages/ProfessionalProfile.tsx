
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Star, Clock, Calendar } from "lucide-react";
import { useParams } from "react-router-dom";

// Mock de dados detalhados do profissional
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
    about: "Designer UX/UI com mais de 8 anos de experiência em projetos digitais. Especializada em criar interfaces intuitivas e atraentes que proporcionam a melhor experiência para os usuários.",
    specialties: ["Design de Interfaces", "Prototipagem", "Design Systems", "Pesquisa UX"],
    education: "Bacharel em Design Digital - Universidade de São Paulo",
    languages: ["Português", "Inglês", "Espanhol"],
    availability: "Segunda a Sexta, 9h às 18h",
    projectsCompleted: 234,
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
    about: "Desenvolvedor Full Stack com experiência em React, Node.js e arquitetura de sistemas. Especializado em criar soluções escaláveis e de alta performance.",
    specialties: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    education: "Mestrado em Ciência da Computação - UFRJ",
    languages: ["Português", "Inglês"],
    availability: "Segunda a Sexta, 8h às 17h",
    projectsCompleted: 187,
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
    about: "Especialista em Marketing Digital com foco em estratégias de crescimento e aquisição de clientes. Experiência em SEO, mídias sociais e marketing de conteúdo.",
    specialties: ["SEO", "Marketing de Conteúdo", "Mídias Sociais", "Google Ads"],
    education: "Pós-graduação em Marketing Digital - UFPR",
    languages: ["Português", "Inglês", "Francês"],
    availability: "Segunda a Sexta, 9h às 18h",
    projectsCompleted: 156,
  },
];

const ProfessionalProfile = () => {
  const { id } = useParams();
  const professional = professionals.find(p => p.id === id);

  if (!professional) {
    return (
      <div className="min-h-screen bg-accent">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl font-heading font-bold text-gray-900">
            Profissional não encontrado
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-accent">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <img
                src={professional.imageUrl}
                alt={professional.name}
                className="w-32 h-32 rounded-full object-cover"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
                  {professional.name}
                </h1>
                <p className="text-lg text-gray-600 mb-4">{professional.profession}</p>
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {professional.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{professional.rating}</span>
                    <span className="text-gray-500">
                      ({professional.reviews} avaliações)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    {professional.availability}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 md:flex-none">
                    Contratar
                  </Button>
                  <Button variant="outline" className="flex-1 md:flex-none">
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Sobre</h2>
                <p className="text-gray-600">{professional.about}</p>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Especialidades</h2>
                <div className="flex flex-wrap gap-2">
                  {professional.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Informações</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Valor por hora</h3>
                    <p className="text-lg font-medium">R$ {professional.hourlyRate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Projetos completados</h3>
                    <p className="text-lg font-medium">{professional.projectsCompleted}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Idiomas</h3>
                    <p className="text-gray-600">{professional.languages.join(", ")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Formação</h3>
                    <p className="text-gray-600">{professional.education}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Membro desde</h3>
                    <p className="text-gray-600">Janeiro 2023</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
