
import { useEffect } from "react";
import { useBranding } from "@/contexts/BrandingContext";

const MetadataUpdater = () => {
  const { branding, loading } = useBranding();

  useEffect(() => {
    if (loading) return;

    // Update document title
    document.title = `${branding.site_name} – ${branding.site_description}`;
    
    // Update meta tags
    const metaTags = {
      description: branding.site_description,
      "og:title": `${branding.site_name} – ${branding.site_description}`,
      "og:description": branding.site_description,
      "og:image": branding.logo_url,
      "twitter:image": branding.logo_url,
    };
    
    // Update each meta tag
    Object.entries(metaTags).forEach(([name, content]) => {
      // Try to find meta tag by name or property
      let meta = document.querySelector(`meta[name="${name}"]`) || 
                document.querySelector(`meta[property="${name}"]`);
      
      // If meta tag exists, update it
      if (meta) {
        meta.setAttribute("content", content);
      }
    });
    
    // Update favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon && branding.favicon_url) {
      favicon.setAttribute('href', branding.favicon_url);
    }
    
  }, [branding, loading]);

  // This is a utility component that doesn't render anything
  return null;
};

export default MetadataUpdater;
