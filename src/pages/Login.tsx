import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, Home, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Recupera a última página visitada do localStorage quando o componente monta
  useEffect(() => {
    const lastPath = sessionStorage.getItem("lastPath");
    // Se não houver lastPath no storage e a página atual não for login,
    // armazena a página atual como lastPath
    if (!lastPath && location.pathname !== "/login") {
      sessionStorage.setItem("lastPath", location.pathname);
    }
  }, [location]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast.success("Login realizado com sucesso!");
      
      // Após o login bem-sucedido, recupera a última página visitada
      const lastPath = sessionStorage.getItem("lastPath") || "/dashboard";
      // Limpa o lastPath do storage
      sessionStorage.removeItem("lastPath");
      // Navega para a última página
      navigate(lastPath);
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      {/* Botão Voltar para Início */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 hover:bg-white/10"
        onClick={() => navigate("/")}
      >
        <Home className="h-5 w-5" />
      </Button>

      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-card backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 animate-fade-in">
          {/* Cabeçalho */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Bem-vindo(a)
            </h1>
            <p className="text-muted-foreground">
              Entre com suas credenciais para acessar
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo de Email */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Link Esqueceu a senha */}
            <div className="text-sm text-right">
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              className="w-full text-base font-medium h-12"
              disabled={loading}
            >
              {loading ? (
                "Entrando..."
              ) : (
                <>
                  Entrar
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>

            {/* Link para Cadastro */}
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/cadastro")}
                className="text-primary hover:underline focus:outline-none font-medium"
              >
                Cadastre-se
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
