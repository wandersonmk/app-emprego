import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Professionals from "./pages/Professionals";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PublishService from "./pages/PublishService";
import ServiceDetails from "./pages/ServiceDetails";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster richColors position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profissionais" element={<Professionals />} />
            <Route path="/profissionais/:id" element={<ProfessionalProfile />} />
            <Route path="/servicos" element={<Services />} />
            <Route path="/publicar-servico" element={<PublishService />} />
            <Route path="/servicos/:id" element={<ServiceDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
