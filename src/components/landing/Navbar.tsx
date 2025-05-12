
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, LogIn, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position
      const sections = ["hero", "cta", "contact", "testimonials", "benefits"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-casino-darker/90 backdrop-blur-lg shadow-lg py-2"
          : "bg-transparent py-8" // Increased padding for better spacing from hero section
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo centered on mobile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`flex flex-col items-center ${isMobile ? 'mx-auto' : ''}`}
          >
            <img 
              src="https://i.imgur.com/lL2FhfD.png" 
              alt="KRYPTO AI Logo" 
              className="h-12 object-contain"
            />
            
            {/* Trading badge positioned below logo in mobile view - will only show here */}
            {isMobile && (
              <motion.div 
                className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-3 py-1 mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="text-gold flex items-center gap-1.5 text-xs">
                  <Star className="h-3 w-3" /> KI-gestütztes Trading
                </span>
              </motion.div>
            )}
          </motion.div>
          
          {/* Desktop Navigation */}
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
                onClick={() => window.location.href = '/auth'} // Changed to new auth page
              >
                <LogIn className="mr-2 h-4 w-4" />
                Anmelden
              </Button>
            </motion.div>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className={`md:hidden flex items-center ${isMobile && !mobileMenuOpen ? 'absolute right-4' : ''}`}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Now includes login button */}
        {mobileMenuOpen && (
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
        )}
      </div>
    </motion.nav>
  );
};

const NavLink = ({ 
  onClick, 
  children, 
  active = false,
  icon = null
}: { 
  onClick: () => void, 
  children: React.ReactNode,
  active?: boolean,
  icon?: React.ReactNode
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    className={`text-white hover:text-gold transition-colors relative group flex items-center ${
      active ? 'text-gold font-medium' : ''
    }`}
  >
    {icon}
    {children}
    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
      active ? 'w-full' : 'w-0 group-hover:w-full'
    }`}></span>
    {active && (
      <motion.span 
        className="absolute -right-2 -top-1 flex h-5 w-5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/30 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
      </motion.span>
    )}
  </motion.button>
);

const MobileNavLink = ({ 
  onClick, 
  children,
  active = false
}: { 
  onClick: () => void, 
  children: React.ReactNode,
  active?: boolean
}) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`text-white hover:text-gold transition-colors py-2 px-4 rounded-md ${
      active ? 'bg-gold/10 text-gold font-medium border-l-2 border-gold' : ''
    }`}
  >
    {children}
  </motion.button>
);

export default Navbar;
