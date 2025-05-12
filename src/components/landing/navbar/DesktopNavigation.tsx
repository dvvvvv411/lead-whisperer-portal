
import { motion } from "framer-motion";
import { LogIn, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";
import { useLocation } from "react-router-dom";

interface DesktopNavigationProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const DesktopNavigation = ({ activeSection, scrollToSection }: DesktopNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink 
        active={currentPath === "/" && activeSection === "hero"} 
        onClick={() => scrollToSection("hero")}
        icon={<Star className="w-4 h-4 mr-1" />}
      >
        Home
      </NavLink>
      <NavLink 
        active={currentPath === "/trading-bot"} 
        onClick={() => window.location.href = '/trading-bot'}
      >
        Trading Bot
      </NavLink>
      <NavLink 
        active={currentPath === "/erfahrungen"} 
        onClick={() => window.location.href = '/erfahrungen'}
      >
        Erfahrungen
      </NavLink>
      <NavLink 
        active={currentPath === "/status"} 
        onClick={() => window.location.href = '/status'}
      >
        Status
      </NavLink>
      <NavLink 
        active={currentPath === "/faq"} 
        onClick={() => window.location.href = '/faq'}
      >
        FAQ
      </NavLink>
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          className="bg-gradient-to-r from-gold to-gold-light text-black font-medium hover:shadow-md hover:shadow-gold/20 transition-all"
          onClick={() => window.location.href = '/auth'}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Anmelden
        </Button>
      </motion.div>
    </div>
  );
};

export default DesktopNavigation;
