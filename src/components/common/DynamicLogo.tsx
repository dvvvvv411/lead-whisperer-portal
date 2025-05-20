
import { useBranding } from "@/contexts/BrandingContext";
import { Link } from "react-router-dom";

interface DynamicLogoProps {
  height?: number;
  className?: string;
  linkTo?: string;
  showText?: boolean;
}

const DynamicLogo = ({ height = 10, className = "", linkTo = "/", showText = false }: DynamicLogoProps) => {
  const { branding } = useBranding();
  
  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      <img 
        src={branding?.logo_url || "https://i.imgur.com/Q191f5z.png"} 
        alt={`${branding?.site_name || "bitloon"} Logo`} 
        className={`h-${height} object-contain`}
      />
      {showText && branding?.site_name && (
        <span className="ml-2 font-semibold text-gold">{branding.site_name}</span>
      )}
    </div>
  );
  
  if (linkTo === null) {
    return <LogoContent />;
  }
  
  return (
    <Link to={linkTo}>
      <LogoContent />
    </Link>
  );
};

export default DynamicLogo;
