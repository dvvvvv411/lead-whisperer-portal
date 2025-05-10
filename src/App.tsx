
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLeads from "./pages/AdminLeads";
import NotFound from "./pages/NotFound";
import { createClient } from "@supabase/supabase-js";

const queryClient = new QueryClient();

// Supabase-Initialisierung für globalen Zugriff
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Sicherstellen, dass die Umgebungsvariablen vorhanden sind
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase-Umgebungsvariablen fehlen. Bitte aktiviere die Supabase-Integration."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/leads" element={<AdminLeads />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
