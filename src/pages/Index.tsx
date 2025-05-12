
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CtaSection from "@/components/landing/CtaSection";
import ContactSection from "@/components/landing/ContactSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PartnersSection from "@/components/landing/PartnersSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  // Track scroll position for potential scroll-based animations
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-casino-darker text-white overflow-hidden">
      <Navbar />
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection />
        </motion.div>
        
        <div className="relative z-10">
          <CtaSection />
        </div>
        
        <div className="relative z-10">
          <ContactSection />
        </div>
        
        <div className="relative z-10">
          <BenefitsSection />
        </div>
        
        <div className="relative z-10">
          <TestimonialsSection />
        </div>
        
        <div className="relative z-10">
          <PartnersSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
