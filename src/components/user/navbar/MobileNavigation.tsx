
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, TrendingUp, Settings, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNavigation = () => {
  const location = useLocation();
  
  return (
    <div className="md:hidden mt-3 pb-1 flex justify-around">
      <Link to="/nutzer" className={cn(
        "flex flex-col items-center p-2 rounded",
        location.pathname === "/nutzer" ? "text-gold font-medium" : "text-white hover:text-gold/90"
      )}>
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1 drop-shadow-sm">Home</span>
      </Link>
      <Link to="/nutzer/trading-archiv" className={cn(
        "flex flex-col items-center p-2 rounded",
        location.pathname === "/nutzer/trading-archiv" ? "text-gold font-medium" : "text-white hover:text-gold/90"
      )}>
        <Bot className="h-5 w-5" />
        <span className="text-xs mt-1 drop-shadow-sm">Archiv</span>
      </Link>
      <Link to="/nutzer/einzahlen" className={cn(
        "flex flex-col items-center p-2 rounded",
        location.pathname === "/nutzer/einzahlen" ? "text-gold font-medium" : "text-white hover:text-gold/90"
      )}>
        <Wallet className="h-5 w-5" />
        <span className="text-xs mt-1 drop-shadow-sm">Einzahlen</span>
      </Link>
      <Link to="/nutzer/auszahlen" className={cn(
        "flex flex-col items-center p-2 rounded",
        location.pathname === "/nutzer/auszahlen" ? "text-gold font-medium" : "text-white hover:text-gold/90"
      )}>
        <TrendingUp className="h-5 w-5" />
        <span className="text-xs mt-1 drop-shadow-sm">Auszahlen</span>
      </Link>
      <Link to="/nutzer/einstellungen" className={cn(
        "flex flex-col items-center p-2 rounded",
        location.pathname === "/nutzer/einstellungen" ? "text-gold font-medium" : "text-white hover:text-gold/90"
      )}>
        <Settings className="h-5 w-5" />
        <span className="text-xs mt-1 drop-shadow-sm">Settings</span>
      </Link>
    </div>
  );
};

export default MobileNavigation;
