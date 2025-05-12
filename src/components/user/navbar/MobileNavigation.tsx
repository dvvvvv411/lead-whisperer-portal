
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, TrendingUp, Settings, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserCredit } from "@/hooks/useUserCredit";

const MobileNavigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (!isMobile) return null;
  
  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)} 
        className="md:hidden fixed bottom-6 right-6 z-50 bg-gold/20 hover:bg-gold/30 p-3 rounded-full shadow-lg backdrop-blur-sm border border-gold/30 transition-all duration-300"
        aria-label="Menü öffnen"
      >
        <Menu className="h-6 w-6 text-gold" />
      </button>
      
      {/* Mobile Navigation Menu - Slide up from bottom when open */}
      <div className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-casino-darker/95 backdrop-blur-md border-t border-gold/20 shadow-lg",
        "transition-all duration-300 ease-in-out",
        isMenuOpen ? "translate-y-0" : "translate-y-full"
      )}>
        <div className="flex justify-around py-4">
          <Link to="/nutzer" 
            className={cn(
              "flex flex-col items-center p-2 rounded",
              location.pathname === "/nutzer" ? "text-gold" : "text-muted-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link to="/nutzer/einzahlen" 
            className={cn(
              "flex flex-col items-center p-2 rounded",
              location.pathname === "/nutzer/einzahlen" ? "text-gold" : "text-muted-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs mt-1">Einzahlen</span>
          </Link>
          <Link to="/nutzer/auszahlen" 
            className={cn(
              "flex flex-col items-center p-2 rounded",
              location.pathname === "/nutzer/auszahlen" ? "text-gold" : "text-muted-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs mt-1">Auszahlen</span>
          </Link>
          <Link to="/nutzer/einstellungen" 
            className={cn(
              "flex flex-col items-center p-2 rounded",
              location.pathname === "/nutzer/einstellungen" ? "text-gold" : "text-muted-foreground"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
