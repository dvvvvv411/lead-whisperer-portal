
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Logo = () => {
  const isMobile = useIsMobile();
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
      whileHover={{
        scale: 1.05
      }} 
      className={`flex flex-col items-center ${isMobile ? 'mx-auto' : ''}`}
    >
      <Link to="/">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="h-14 object-contain" 
        />
      </Link>
      
      {/* Trading badge positioned below logo in mobile view */}
      {isMobile && (
        <motion.div 
          className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mt-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
        >
          <span className="text-gold flex items-center gap-2 text-sm">
            <TrendingUp className="h-3.5 w-3.5" /> KI-gestütztes Trading
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Logo;
