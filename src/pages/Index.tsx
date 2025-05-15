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
import { ErrorBoundary } from "@/components/ui/error-boundary";

const Index = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  
  // Effect for scroll handling - keep this outside of conditionals
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Check for authenticated user and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          setUser(data.user);
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
  
  // Initiate a call to sync public trades - this is now always outside conditionals
  useEffect(() => {
    const syncPublicTrades = async () => {
      try {
        // Call the edge function to sync public trades
        await supabase.functions.invoke('update-public-trades');
      } catch (error) {
        console.error("Error syncing public trades:", error);
      }
    };
    
    // Only sync if not loading (user authentication check completed)
    if (!loading) {
      // Sync when the page loads
      syncPublicTrades();
      
      // Also set up a periodic sync every 5 minutes
      const interval = setInterval(syncPublicTrades, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
    
    return undefined;
  }, [loading]); // Only re-run when loading state changes

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

  return (
    <div className="min-h-screen bg-casino-darker text-white overflow-hidden">
      <ErrorBoundary fallback={<NavbarFallback />}>
        <Navbar />
      </ErrorBoundary>
      <main>
        <ErrorBoundary fallback={<SectionFallback title="Hero Section" />}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <HeroSection />
          </motion.div>
        </ErrorBoundary>
        
        <div className="relative z-10" id="cta">
          <ErrorBoundary fallback={<SectionFallback title="CTA Section" />}>
            <CtaSection />
          </ErrorBoundary>
        </div>
        
        <div className="relative z-10" id="contact">
          <ErrorBoundary fallback={<SectionFallback title="Contact Section" />}>
            <ContactSection />
          </ErrorBoundary>
        </div>
        
        <div className="relative z-10" id="benefits">
          <ErrorBoundary fallback={<SectionFallback title="Benefits Section" />}>
            <BenefitsSection />
          </ErrorBoundary>
        </div>
        
        <div className="relative z-10" id="testimonials">
          <ErrorBoundary fallback={<SectionFallback title="Testimonials Section" />}>
            <TestimonialsSection />
          </ErrorBoundary>
        </div>
        
        <div className="relative z-10" id="partners">
          <ErrorBoundary fallback={<SectionFallback title="Partners Section" />}>
            <PartnersSection />
          </ErrorBoundary>
        </div>
      </main>
      <ErrorBoundary fallback={<div className="py-8 text-center">© KRYPTO AI</div>}>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

// Simple fallback components
const NavbarFallback = () => (
  <div className="fixed w-full top-0 z-50 bg-casino-darker py-4">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <div>KRYPTO AI</div>
        <div>Menu</div>
      </div>
    </div>
  </div>
);

const SectionFallback = ({ title }: { title: string }) => (
  <div className="py-16 text-center">
    <p>Failed to load {title}</p>
  </div>
);

export default Index;
