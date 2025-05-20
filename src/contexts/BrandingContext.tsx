
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BrandingData {
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  company_name: string;
}

interface BrandingContextType {
  branding: BrandingData;
  loading: boolean;
  refreshBranding: () => Promise<void>;
}

const defaultBranding: BrandingData = {
  site_name: "bitloon",
  site_description: "KI-gesteuertes Krypto-Investment der nächsten Generation",
  logo_url: "https://i.imgur.com/Q191f5z.png",
  favicon_url: "/favicon.svg",
  company_name: "GMS Management und Service GmbH",
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  loading: true,
  refreshBranding: async () => {},
});

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingData>(defaultBranding);
  const [loading, setLoading] = useState(true);

  const fetchBrandingData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('legal_info')
        .select('site_name, site_description, logo_url, favicon_url, company_name')
        .single();

      if (error) {
        console.error("Error fetching branding info:", error);
        return;
      }

      if (data) {
        setBranding({
          site_name: data.site_name,
          site_description: data.site_description,
          logo_url: data.logo_url,
          favicon_url: data.favicon_url,
          company_name: data.company_name,
        });
      }
    } catch (err) {
      console.error("Failed to fetch branding data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrandingData();
  }, []);

  const refreshBranding = async () => {
    await fetchBrandingData();
  };

  return (
    <BrandingContext.Provider value={{ branding, loading, refreshBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};
