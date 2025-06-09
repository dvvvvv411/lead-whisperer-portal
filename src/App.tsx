
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import User from "./pages/User";
import UserSettings from "./pages/UserSettings";
import UserDeposit from "./pages/UserDeposit";
import UserWithdrawal from "./pages/UserWithdrawal";
import UserTradeArchive from "./pages/UserTradeArchive";
import UserActivation from "./pages/UserActivation";
import UserAffiliate from "./pages/UserAffiliate";
import Admin from "./pages/Admin";
import AdminRegister from "./pages/AdminRegister";
import AdminLeads from "./pages/AdminLeads";
import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminAffiliate from "./pages/AdminAffiliate";
import AdminCryptoWallets from "./pages/AdminCryptoWallets";
import AdminRechtstexte from "./pages/AdminRechtstexte";
import AdminLegalInfo from "./pages/AdminLegalInfo";
import TradingBot from "./pages/TradingBot";
import NotFound from "./pages/NotFound";
import Status from "./pages/Status";
import TestNotifications from "./pages/TestNotifications";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import Haftungsausschluss from "./pages/Haftungsausschluss";
import Partners from "./pages/Partners";
import Press from "./pages/Press";
import FAQ from "./pages/FAQ";
import Experiences from "./pages/Experiences";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Check for affiliate code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    
    if (ref) {
      // Store affiliate code in localStorage for later use during registration
      localStorage.setItem('affiliate_code', ref);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* User Routes */}
            <Route path="/nutzer" element={<User />} />
            <Route path="/nutzer/aktivierung" element={<UserActivation />} />
            <Route path="/nutzer/einstellungen" element={<UserSettings />} />
            <Route path="/nutzer/einzahlen" element={<UserDeposit />} />
            <Route path="/nutzer/einzahlung" element={<UserDeposit />} />
            <Route path="/nutzer/auszahlen" element={<UserWithdrawal />} />
            <Route path="/nutzer/auszahlung" element={<UserWithdrawal />} />
            <Route path="/nutzer/trading-archiv" element={<UserTradeArchive />} />
            <Route path="/nutzer/handel-archiv" element={<UserTradeArchive />} />
            <Route path="/nutzer/freunde-einladen" element={<UserAffiliate />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/nutzer" element={<AdminUsers />} />
            <Route path="/admin/einzahlungen" element={<AdminPayments />} />
            <Route path="/admin/auszahlungen" element={<AdminWithdrawals />} />
            <Route path="/admin/affiliate" element={<AdminAffiliate />} />
            <Route path="/admin/crypto-wallets" element={<AdminCryptoWallets />} />
            <Route path="/admin/rechtstexte" element={<AdminRechtstexte />} />
            <Route path="/admin/legal-info" element={<AdminLegalInfo />} />
            
            {/* Special Routes */}
            <Route path="/trading-bot" element={<TradingBot />} />
            <Route path="/status" element={<Status />} />
            <Route path="/test-notifications" element={<TestNotifications />} />
            
            {/* Legal Pages */}
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            <Route path="/haftungsausschluss" element={<Haftungsausschluss />} />
            
            {/* Marketing Pages */}
            <Route path="/partner" element={<Partners />} />
            <Route path="/presse" element={<Press />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/erfahrungen" element={<Experiences />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
