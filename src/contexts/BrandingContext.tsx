
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchBrandingInfo, BrandingInfo } from "@/services/brandingService";

interface BrandingContextType {
  branding: BrandingInfo | null;
  loading: boolean;
  refreshBranding: () => Promise<void>;
}

const defaultBranding: BrandingInfo = {
  site_name: "bitloon",
  site_description: "KI-gesteuertes Krypto-Investment der nächsten Generation",
  logo_url: "https://i.imgur.com/Q191f5z.png",
  favicon_url: "/favicon.svg",
  press_links: [],
  phone_number: "+49 (0) 69 254 931 30",
  email: "info@gms-service.de",
  vat_id: "DE341123456"
};

const BrandingContext = createContext<BrandingContextType>({
  branding: defaultBranding,
  loading: true,
  refreshBranding: async () => {}
});

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingInfo | null>(defaultBranding);
  const [loading, setLoading] = useState(true);

  const loadBranding = async () => {
    setLoading(true);
    try {
      const data = await fetchBrandingInfo();
      setBranding(data || defaultBranding);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranding();
  }, []);

  // Update favicon dynamically
  useEffect(() => {
    if (branding && branding.favicon_url) {
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = branding.favicon_url;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    
    // Update document title
    if (branding && branding.site_name) {
      document.title = `${branding.site_name} – ${branding.site_description}`;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', branding.site_description);
      }
      
      // Update OpenGraph meta tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      let ogDescription = document.querySelector('meta[property="og:description"]');
      
      if (ogTitle) {
        ogTitle.setAttribute('content', `${branding.site_name} – ${branding.site_description}`);
      }
      
      if (ogDescription) {
        ogDescription.setAttribute('content', branding.site_description);
      }
    }
  }, [branding]);

  return (
    <BrandingContext.Provider value={{ 
      branding, 
      loading,
      refreshBranding: loadBranding
    }}>
      {children}
    </BrandingContext.Provider>
  );
};
