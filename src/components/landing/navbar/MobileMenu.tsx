
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileNavLink from "./MobileNavLink";

interface MobileMenuProps {
  isOpen: boolean;
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const MobileMenu = ({ isOpen, activeSection, scrollToSection }: MobileMenuProps) => {
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden mt-4 pb-4 bg-casino-dark/90 backdrop-blur-md rounded-lg border border-gold/10 shadow-lg"
    >
      <div className="flex flex-col space-y-4 p-4">
        <MobileNavLink 
          active={activeSection === "hero"} 
          onClick={() => scrollToSection("hero")}
        >
          Home
        </MobileNavLink>
        <MobileNavLink 
          active={activeSection === "cta"} 
          onClick={() => scrollToSection("cta")}
        >
          Trading Bot
        </MobileNavLink>
        <MobileNavLink 
          active={activeSection === "contact"} 
          onClick={() => scrollToSection("contact")}
        >
          Kontakt
        </MobileNavLink>
        <MobileNavLink 
          active={activeSection === "testimonials"} 
          onClick={() => scrollToSection("testimonials")}
        >
          Erfahrungen
        </MobileNavLink>
        <MobileNavLink 
          active={activeSection === "benefits"} 
          onClick={() => scrollToSection("benefits")}
        >
          Vorteile
        </MobileNavLink>
        
        {/* Login button in mobile menu */}
        <div className="pt-2 mt-2 border-t border-gold/10">
          <Button 
            className="w-full bg-gradient-to-r from-gold to-gold-light text-black font-medium hover:shadow-md hover:shadow-gold/20 transition-all"
            onClick={() => window.location.href = '/auth'} 
          >
            <LogIn className="mr-2 h-4 w-4" />
            Anmelden
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileMenu;
