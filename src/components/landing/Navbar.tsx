
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./navbar/Logo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import MobileMenu from "./navbar/MobileMenu";
import MobileMenuToggle from "./navbar/MobileMenuToggle";

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
          <Logo />
          
          {/* Desktop Navigation */}
          <DesktopNavigation 
            activeSection={activeSection}
            scrollToSection={scrollToSection}
          />
          
          {/* Mobile Navigation Button */}
          <div className={`md:hidden flex items-center ${isMobile && !mobileMenuOpen ? 'absolute right-4' : ''}`}>
            <MobileMenuToggle 
              isOpen={mobileMenuOpen}
              toggleMenu={toggleMobileMenu}
            />
          </div>
        </div>
        
        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={mobileMenuOpen}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
