
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, TrendingUp, Settings, Bot } from "lucide-react";
import { NavigationMenu, NavigationMenuLink, NavigationMenuItem, 
  NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const DesktopNavigation = () => {
  const location = useLocation();
  
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/nutzer">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent hover:bg-casino-highlight text-white shadow-sm",
              location.pathname === "/nutzer" && "text-gold font-medium"
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
              "bg-transparent hover:bg-casino-highlight text-white shadow-sm",
              location.pathname === "/nutzer/einzahlen" && "text-gold font-medium"
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
              "bg-transparent hover:bg-casino-highlight text-white shadow-sm",
              location.pathname === "/nutzer/auszahlen" && "text-gold font-medium"
            )}>
              <TrendingUp className="mr-1 h-4 w-4" />
              Auszahlen
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/nutzer/trading-archiv">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent hover:bg-casino-highlight text-white shadow-sm",
              location.pathname === "/nutzer/trading-archiv" && "text-gold font-medium"
            )}>
              <Bot className="mr-1 h-4 w-4" />
              Trading-Archiv
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link to="/nutzer/einstellungen">
            <NavigationMenuLink className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent hover:bg-casino-highlight text-white shadow-sm",
              location.pathname === "/nutzer/einstellungen" && "text-gold font-medium"
            )}>
              <Settings className="mr-1 h-4 w-4" />
              Einstellungen
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNavigation;
