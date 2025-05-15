
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CtaSection from "@/components/landing/CtaSection";
import ContactSection from "@/components/landing/ContactSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PartnersSection from "@/components/landing/PartnersSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Check for authenticated user and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          console.log("User authenticated on landing page, redirecting to appropriate dashboard");
          
          // Check if the user is an admin
          const { data: adminRoleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          // Redirect to the appropriate dashboard based on user role
          if (adminRoleData) {
            navigate('/admin');
          } else {
            navigate('/nutzer');
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-gold border-casino-card animate-spin mb-4"></div>
          <p className="text-muted-foreground">Wird geladen...</p>
        </div>
      </div>
    );
  }

  // Initiate a call to sync public trades to ensure we have fresh data
  useEffect(() => {
    const syncPublicTrades = async () => {
      try {
        // Call the edge function to sync public trades
        await supabase.functions.invoke('update-public-trades');
      } catch (error) {
        console.error("Error syncing public trades:", error);
      }
    };
    
    // Sync when the page loads
    syncPublicTrades();
    
    // Also set up a periodic sync every 5 minutes
    const interval = setInterval(syncPublicTrades, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
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
        
        <div className="relative z-10" id="cta">
          <CtaSection />
        </div>
        
        <div className="relative z-10" id="contact">
          <ContactSection />
        </div>
        
        <div className="relative z-10" id="benefits">
          <BenefitsSection />
        </div>
        
        <div className="relative z-10" id="testimonials">
          <TestimonialsSection />
        </div>
        
        <div className="relative z-10" id="partners">
          <PartnersSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
