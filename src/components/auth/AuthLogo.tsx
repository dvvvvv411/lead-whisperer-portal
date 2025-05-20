
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthLogo = () => {
  const [logoUrl, setLogoUrl] = useState("https://i.imgur.com/Q191f5z.png");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data } = await supabase
          .from('legal_info')
          .select('logo_url')
          .single();

        if (data?.logo_url) {
          setLogoUrl(data.logo_url);
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchLogo();
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8 flex flex-col items-center gap-4"
    >
      <Link to="/">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="h-20 object-contain"
        />
      </Link>
      
      {/* Back to homepage button */}
      <Link 
        to="/"
        className="text-sm text-gold/80 hover:text-gold transition-colors flex items-center gap-1"
      >
        <span className="inline-block transform rotate-180">➔</span> Zurück zur Startseite
      </Link>
    </motion.div>
  );
};

export default AuthLogo;
