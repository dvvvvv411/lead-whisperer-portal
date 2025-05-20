
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AdminLogo = () => {
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
    <Link to="/admin" className="flex items-center">
      <img 
        src={logoUrl} 
        alt="Logo" 
        className="h-10 object-contain mr-2" 
      />
    </Link>
  );
};

export default AdminLogo;
