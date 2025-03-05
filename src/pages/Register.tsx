import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Definir o tipo permitido para userType
type UserType = "client" | "professional";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<UserType>("client"); // Especificar o tipo
  const [showPassword, setShowPassword] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Verificar se todos os campos obrigatórios estão preenchidos
      if (!email || !password || !name) {
        throw new Error("Por favor, preencha todos os campos");
      }
      
      // Registro do usuário no supabase auth
      console.log("Iniciando registro com:", { email, name, userType });
      
      try {
        // Garantir que user_type esteja em minúsculas e seja uma string válida
        const safeUserType = userType.toLowerCase() as UserType;
        
        console.log("Tentando registrar usuário com:", {
          email,
          name,
          user_type: safeUserType
        });

        // Registrar o usuário
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name, // Garantir que o nome está sendo enviado
              user_type: safeUserType // Garantir que o tipo está sendo enviado
            }
          }
        });

        console.log("Resposta do signUp:", { authData, signUpError });

        if (signUpError) {
          console.error("Erro detalhado no signUp:", {
            message: signUpError.message,
            status: signUpError.status,
            name: signUpError.name,
            error: signUpError
          });
          throw signUpError;
        }

        if (!authData.user) {
          console.error("Usuário não foi criado na resposta");
          throw new Error("Não foi possível criar o usuário");
        }

        console.log("Usuário registrado com sucesso:", {
          id: authData.user.id,
          email: authData.user.email,
          metadata: authData.user.user_metadata
        });
        
        // Verificar se estamos em modo de desenvolvimento
        const isDev = window.location.hostname === 'localhost' || 
                    window.location.hostname.includes('lovableproject.com');
                    
        // Mensagem adaptada com base no ambiente
        const mensagem = isDev 
          ? "Cadastro realizado com sucesso! Você já pode fazer login."
          : "Cadastro realizado com sucesso! Verifique seu email para confirmar.";
        
        toast.success(mensagem);
        
        // Redirecionando para o login
        navigate("/login");
        
      } catch (error: any) {
        console.error("Erro completo:", {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        let mensagemErro = "Erro ao fazer cadastro";
        
        if (error.message?.includes("User already registered")) {
          mensagemErro = "Este email já está registrado.";
        } else if (error.message?.includes("invalid user_type")) {
          mensagemErro = "Tipo de usuário inválido.";
        } else if (error.message) {
          mensagemErro = `Erro: ${error.message}`;
          if (error.details) {
            mensagemErro += ` (${error.details})`;
          }
        }
        
        toast.error(mensagemErro);
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      let mensagemErro = "Erro ao fazer cadastro";
      
      // Tratamento específico para erros conhecidos
      if (error.message?.includes("User already registered")) {
        mensagemErro = "Este email já está registrado.";
      } else if (error.message?.includes("database error")) {
        mensagemErro = "Erro no banco de dados. Por favor, tente novamente mais tarde.";
      } else if (error.message) {
        mensagemErro = error.message;
      }
      
      toast.error(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 animate-fade-in">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-3xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Criar Conta
            </h1>
            <p className="text-muted-foreground">
              Preencha seus dados para se cadastrar
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Campo de Nome */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11"
                  required
                />
              </div>
            </div>

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
                  minLength={6}
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

            {/* Seleção de Tipo de Usuário */}
            <div className="space-y-3">
              <Label>Tipo de Conta</Label>
              <RadioGroup
                defaultValue="client"
                value={userType}
                onValueChange={(value: UserType) => setUserType(value)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client">Cliente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="professional" id="professional" />
                  <Label htmlFor="professional">Profissional</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Botão de Cadastro */}
            <Button
              type="submit"
              className="w-full text-base font-medium h-12"
              disabled={loading}
            >
              {loading ? (
                "Cadastrando..."
              ) : (
                <>
                  Criar conta
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>

            {/* Link para Login */}
            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-primary hover:underline focus:outline-none font-medium"
              >
                Fazer login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
