
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, TrendingUp, Settings } from "lucide-react";
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
  );
};

export default DesktopNavigation;
