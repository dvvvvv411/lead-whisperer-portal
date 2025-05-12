
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Wallet, 
  Settings, 
  LogOut, 
  Home, 
  TrendingUp, 
  CircleDollarSign 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, 
  NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle 
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useUserCredit } from "@/hooks/useUserCredit";

interface UserNavbarProps {
  userId?: string;
  userEmail?: string;
  className?: string;
}

const UserNavbar = ({ userId, userEmail, className }: UserNavbarProps) => {
  const { toast } = useToast();
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(userId);
  const [prevCredit, setPrevCredit] = useState<number | null>(null);
  const [creditIncreased, setCreditIncreased] = useState<boolean | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (userId) {
      fetchUserCredit();
    }
  }, [userId, fetchUserCredit]);

  // Animation effect when credit changes
  useEffect(() => {
    if (prevCredit !== null && userCredit !== null) {
      setCreditIncreased(userCredit > prevCredit);
      
      // Reset animation after 2 seconds
      const timeout = setTimeout(() => {
        setCreditIncreased(null);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
    
    // Store current credit for next comparison
    if (userCredit !== null && userCredit !== prevCredit) {
      setPrevCredit(userCredit);
    }
  }, [userCredit, prevCredit]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      window.location.href = "/admin";
    } catch (error: any) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "0,00 €";
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Only render after mounting to avoid hydration errors
  if (!isMounted) return null;

  return (
    <header className={cn("w-full border-b border-gold/20 bg-casino-darker px-4 py-3", className)}>
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo and title */}
        <div className="flex items-center">
          <Link to="/nutzer" className="flex items-center">
            <CircleDollarSign className="h-6 w-6 mr-2 text-gold" />
            <span className="text-xl font-bold gradient-text">Crypto Trader</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/nutzer">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-casino-highlight",
                  location.pathname === "/nutzer" && "text-gold"
                )}>
                  <Home className="mr-1 h-4 w-4" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/nutzer/einzahlen">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-casino-highlight",
                  location.pathname === "/nutzer/einzahlen" && "text-gold"
                )}>
                  <Wallet className="mr-1 h-4 w-4" />
                  Einzahlen
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/nutzer/auszahlen">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-casino-highlight",
                  location.pathname === "/nutzer/auszahlen" && "text-gold"
                )}>
                  <TrendingUp className="mr-1 h-4 w-4" />
                  Auszahlen
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/nutzer/einstellungen">
                <NavigationMenuLink className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-transparent hover:bg-casino-highlight",
                  location.pathname === "/nutzer/einstellungen" && "text-gold"
                )}>
                  <Settings className="mr-1 h-4 w-4" />
                  Einstellungen
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        {/* User info and controls */}
        <div className="flex items-center gap-4">
          {/* Credit display with animation */}
          <div 
            className={cn(
              "px-4 py-2 rounded-md transition-all duration-500",
              creditIncreased === true ? "bg-green-500/20 text-green-300 animate-pulse-gold" : 
              creditIncreased === false ? "bg-red-500/20 text-red-300" : 
              "bg-casino-card"
            )}
          >
            <div className="text-xs text-muted-foreground mb-0.5">Guthaben</div>
            <div className="font-bold text-lg">
              {creditLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                formatCurrency(userCredit)
              )}
            </div>
          </div>
          
          {/* User email (visible on larger screens) */}
          {userEmail && (
            <div className="hidden md:block text-sm text-muted-foreground">
              {userEmail}
            </div>
          )}
          
          {/* Logout button */}
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-gold/20 hover:bg-gold/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Abmelden</span>
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden mt-3 pb-1 flex justify-around">
        <Link to="/nutzer" className={cn(
          "flex flex-col items-center p-2 rounded",
          location.pathname === "/nutzer" ? "text-gold" : "text-muted-foreground"
        )}>
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/nutzer/einzahlen" className={cn(
          "flex flex-col items-center p-2 rounded",
          location.pathname === "/nutzer/einzahlen" ? "text-gold" : "text-muted-foreground"
        )}>
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1">Einzahlen</span>
        </Link>
        <Link to="/nutzer/auszahlen" className={cn(
          "flex flex-col items-center p-2 rounded",
          location.pathname === "/nutzer/auszahlen" ? "text-gold" : "text-muted-foreground"
        )}>
          <TrendingUp className="h-5 w-5" />
          <span className="text-xs mt-1">Auszahlen</span>
        </Link>
        <Link to="/nutzer/einstellungen" className={cn(
          "flex flex-col items-center p-2 rounded",
          location.pathname === "/nutzer/einstellungen" ? "text-gold" : "text-muted-foreground"
        )}>
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </header>
  );
};

export default UserNavbar;
