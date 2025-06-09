import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/user/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";

// Importing all pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import User from "./pages/User";
import Admin from "./pages/Admin";
import AdminLeads from "./pages/AdminLeads";
import AdminUsers from "./pages/AdminUsers";
import AdminRegister from "./pages/AdminRegister";
import AdminCryptoWallets from "./pages/AdminCryptoWallets";
import AdminPayments from "./pages/AdminPayments";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminLegalInfo from "./pages/AdminLegalInfo";
import UserActivation from "./pages/UserActivation";
import UserDeposit from "./pages/UserDeposit";
import UserWithdrawal from "./pages/UserWithdrawal";
import UserSettings from "./pages/UserSettings";
import UserTradeArchive from "./pages/UserTradeArchive";
import NotFound from "./pages/NotFound";
import AGB from "./pages/AGB";
import Datenschutz from "./pages/Datenschutz";
import Impressum from "./pages/Impressum";
import FAQ from "./pages/FAQ";
import Status from "./pages/Status";
import Partners from "./pages/Partners";
import TradingBot from "./pages/TradingBot";
import Experiences from "./pages/Experiences";
import Haftungsausschluss from "./pages/Haftungsausschluss";
import TestNotifications from "./pages/TestNotifications";
import Press from "./pages/Press";
import UserInviteFriends from "./pages/UserInviteFriends";
import AdminAffiliate from "./pages/AdminAffiliate";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-casino-darker">
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="dark" storageKey="casino-theme">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/nutzer" element={<User />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/leads" element={<AdminLeads />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/register" element={<AdminRegister />} />
              <Route path="/admin/crypto-wallets" element={<AdminCryptoWallets />} />
              <Route path="/admin/payments" element={<AdminPayments />} />
              <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
              <Route path="/admin/rechtstexte" element={<AdminLegalInfo />} />
              <Route path="/nutzer/aktivierung" element={<UserActivation />} />
              
              {/* Updated routes to match navigation links */}
              <Route path="/nutzer/einzahlung" element={<UserDeposit />} />
              <Route path="/nutzer/einzahlen" element={<UserDeposit />} />
              <Route path="/nutzer/auszahlung" element={<UserWithdrawal />} />
              <Route path="/nutzer/auszahlen" element={<UserWithdrawal />} />
              <Route path="/nutzer/einstellungen" element={<UserSettings />} />
              <Route path="/nutzer/handel-archiv" element={<UserTradeArchive />} />
              <Route path="/nutzer/trading-archiv" element={<UserTradeArchive />} />
              
              {/* Update the trading bot route to be accessible for anonymous users */}
              <Route path="/trading-bot" element={<TradingBot />} />
              {/* Keep the existing route for backward compatibility */}
              <Route path="/nutzer/bot" element={<TradingBot />} />
              
              <Route path="/nutzer/freunde-einladen" element={<UserInviteFriends />} />
              <Route path="/admin/affiliate" element={<AdminAffiliate />} />
              
              <Route path="/agb" element={<AGB />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/status" element={<Status />} />
              <Route path="/partner" element={<Partners />} />
              <Route path="/presse" element={<Press />} />
              <Route path="/erfahrungen" element={<Experiences />} />
              <Route path="/haftungsausschluss" element={<Haftungsausschluss />} />
              <Route path="/test-notifications" element={<TestNotifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ThemeProvider>
        </QueryClientProvider>
      </div>
    </Router>
  );
}

export default App;
