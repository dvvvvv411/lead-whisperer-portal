
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExchangeCardProps {
  name: string;
  logo: string;
  description: string;
  metrics: string;
  websiteUrl: string;
  index: number;
}

const ExchangeCard = ({ name, logo, description, metrics, websiteUrl, index }: ExchangeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-gradient-to-br from-casino-card to-black border border-white/10 rounded-xl overflow-hidden shadow-lg"
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          {/* Logo - Standardized size container */}
          <div className="w-24 h-24 min-w-[6rem] bg-white/5 rounded-lg flex items-center justify-center p-3 border border-white/10">
            <img 
              src={logo} 
              alt={`${name} logo`} 
              className="max-w-full max-h-full object-contain" 
              style={{ width: "auto", height: "auto", maxHeight: "100%", maxWidth: "100%" }}
              onError={(e) => {
                // Fallback if image loading fails
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/100x100?text=" + name;
              }}
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold text-gold mb-2">{name}</h3>
            <p className="text-gray-300 mb-3">{description}</p>
            <p className="text-sm text-gray-400 mb-4">{metrics}</p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                className="border-gold/30 text-gold hover:bg-gold/10"
                onClick={() => window.open(websiteUrl, '_blank')}
              >
                Zur offiziellen Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExchangeCard;
