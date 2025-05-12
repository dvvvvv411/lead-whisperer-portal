
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminRegister from "./pages/AdminRegister";
import AdminLeads from "./pages/AdminLeads";
import AdminCryptoWallets from "./pages/AdminCryptoWallets";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import User from "./pages/User";
import UserActivation from "./pages/UserActivation";
import UserDeposit from "./pages/UserDeposit";
import UserWithdrawal from "./pages/UserWithdrawal";
import UserSettings from "./pages/UserSettings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import TradingBot from "./pages/TradingBot"; // New
import Experiences from "./pages/Experiences"; // New
import Status from "./pages/Status"; // New
import FAQ from "./pages/FAQ"; // New
import { ThemeProvider } from "@/components/user/theme/theme-provider";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Define App component as a proper function component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="user-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/trading-bot" element={<TradingBot />} /> {/* New route */}
              <Route path="/erfahrungen" element={<Experiences />} /> {/* New route */}
              <Route path="/status" element={<Status />} /> {/* New route */}
              <Route path="/faq" element={<FAQ />} /> {/* New route */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/leads" element={<AdminLeads />} />
              <Route path="/admin/crypto-wallets" element={<AdminCryptoWallets />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/nutzer" element={<User />} />
              <Route path="/nutzer/aktivierung" element={<UserActivation />} />
              <Route path="/nutzer/einzahlen" element={<UserDeposit />} />
              <Route path="/nutzer/auszahlen" element={<UserWithdrawal />} />
              <Route path="/nutzer/einstellungen" element={<UserSettings />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
