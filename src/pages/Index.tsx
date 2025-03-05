
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-gray-900 mb-8 animate-fade-in">
              Encontre o profissional ideal para seu projeto
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto animate-fade-in">
              Conectamos você aos melhores profissionais do mercado. Rápido, seguro e eficiente.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 animate-fade-in">
              <div className="flex items-center gap-4 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                <Search className="w-5 h-5 text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="Qual serviço você precisa?"
                  className="flex-1 border-none focus:outline-none text-gray-900 placeholder-gray-400"
                />
                <Button size="lg" className="shrink-0">
                  Buscar
                </Button>
              </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-fade-in">
              {['Design', 'Desenvolvimento', 'Marketing', 'Consultoria'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="py-6 h-auto flex flex-col gap-2 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  asChild
                >
                  <Link to={`/categoria/${category.toLowerCase()}`}>
                    <span className="font-medium">{category}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Profissionais Verificados",
                description: "Todos os profissionais são verificados e avaliados pela comunidade."
              },
              {
                title: "Pagamento Seguro",
                description: "Seu pagamento só é liberado quando o serviço é concluído."
              },
              {
                title: "Suporte 24/7",
                description: "Nossa equipe está sempre disponível para ajudar."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <h3 className="text-lg font-heading font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
