
import { motion } from "framer-motion";
import { LogIn, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavLink from "./NavLink";

interface DesktopNavigationProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const DesktopNavigation = ({ activeSection, scrollToSection }: DesktopNavigationProps) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <NavLink 
        active={activeSection === "hero"} 
        onClick={() => scrollToSection("hero")}
        icon={<Star className="w-4 h-4 mr-1" />}
      >
        Home
      </NavLink>
      <NavLink 
        active={activeSection === "cta"} 
        onClick={() => scrollToSection("cta")}
      >
        Trading Bot
      </NavLink>
      <NavLink 
        active={activeSection === "contact"} 
        onClick={() => scrollToSection("contact")}
      >
        Kontakt
      </NavLink>
      <NavLink 
        active={activeSection === "testimonials"} 
        onClick={() => scrollToSection("testimonials")}
      >
        Erfahrungen
      </NavLink>
      <NavLink 
        active={activeSection === "benefits"} 
        onClick={() => scrollToSection("benefits")}
      >
        Vorteile
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
