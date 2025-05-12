
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
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
          ? "bg-casino-darker/80 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">KRYPTO AI</span>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink onClick={() => scrollToSection("hero")}>Home</NavLink>
            <NavLink onClick={() => scrollToSection("cta")}>Trading Bot</NavLink>
            <NavLink onClick={() => scrollToSection("contact")}>Kontakt</NavLink>
            <NavLink onClick={() => scrollToSection("testimonials")}>Erfahrungen</NavLink>
            <NavLink onClick={() => scrollToSection("benefits")}>Vorteile</NavLink>
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden">
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
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 glassmorphism"
          >
            <div className="flex flex-col space-y-4 p-4">
              <NavLink onClick={() => scrollToSection("hero")}>Home</NavLink>
              <NavLink onClick={() => scrollToSection("cta")}>Trading Bot</NavLink>
              <NavLink onClick={() => scrollToSection("contact")}>Kontakt</NavLink>
              <NavLink onClick={() => scrollToSection("testimonials")}>Erfahrungen</NavLink>
              <NavLink onClick={() => scrollToSection("benefits")}>Vorteile</NavLink>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const NavLink = ({ onClick, children }: { onClick: () => void, children: React.ReactNode }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    className="text-white hover:text-gold transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></span>
  </motion.button>
);

export default Navbar;
