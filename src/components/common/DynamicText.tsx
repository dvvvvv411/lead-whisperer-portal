
import { useEffect, useState } from "react";
import { useBranding } from "@/contexts/BrandingContext";

interface DynamicTextProps {
  text: string;
  className?: string;
}

const DynamicText = ({ text, className = "" }: DynamicTextProps) => {
  const { branding } = useBranding();
  const [processedText, setProcessedText] = useState(text);
  
  useEffect(() => {
    if (branding && branding.site_name) {
      const updatedText = text.replace(/bitloon/gi, branding.site_name);
      setProcessedText(updatedText);
    }
  }, [text, branding]);
  
  return <span className={className}>{processedText}</span>;
};

export default DynamicText;
