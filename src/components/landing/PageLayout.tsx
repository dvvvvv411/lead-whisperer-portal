
import { ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ErrorBoundary } from "@/components/ui/error-boundary";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
  skipAuthCheck?: boolean;
}

const PageLayout = ({ 
  children, 
  title, 
  description, 
  className = "", 
  skipAuthCheck = false 
}: PageLayoutProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(skipAuthCheck ? false : true);

  // Check for authenticated user and redirect if needed
  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check if requested (for pages like Status that should be accessible to everyone)
      if (skipAuthCheck) {
        setLoading(false);
        return;
      }
      
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
  }, [navigate, skipAuthCheck]);

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
      <ErrorBoundary fallback={<SimplifiedNavbar />}>
        <Navbar />
      </ErrorBoundary>
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ErrorBoundary fallback={<SimplifiedHeader title={title} description={description} />}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
              {description && (
                <p className="text-gray-300 max-w-2xl mx-auto">
                  {description}
                </p>
              )}
            </motion.div>
          </ErrorBoundary>
          
          <ErrorBoundary fallback={<div className="text-center p-4">Inhalt konnte nicht geladen werden.</div>}>
            <div className={`${className}`}>
              {children}
            </div>
          </ErrorBoundary>
        </div>
      </main>
      
      <ErrorBoundary fallback={<SimplifiedFooter />}>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

// Simple fallback components
const SimplifiedNavbar = () => (
  <div className="fixed w-full top-0 z-50 bg-casino-darker py-4">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center">
        <div className="text-gold font-bold">KRYPTO AI</div>
      </div>
    </div>
  </div>
);

const SimplifiedHeader = ({ title, description }: { title?: string; description?: string }) => (
  <div className="mb-12 text-center">
    <h1 className="text-3xl font-bold mb-4 text-gold">{title || "KRYPTO AI"}</h1>
    {description && <p className="text-gray-300">{description}</p>}
  </div>
);

const SimplifiedFooter = () => (
  <div className="py-8 text-center text-gray-400">
    © KRYPTO AI
  </div>
);

export default PageLayout;
