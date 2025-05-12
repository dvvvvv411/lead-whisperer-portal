
import { motion } from "framer-motion";

interface ExchangeCardProps {
  name: string;
  logo: string;
  websiteUrl: string;
  index: number;
}

const ExchangeCard = ({ name, logo, websiteUrl, index }: ExchangeCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-lg p-3"
      onClick={() => window.open(websiteUrl, '_blank')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {/* Logo - Smaller size container */}
        <div className="w-16 h-16 bg-white/5 rounded-lg flex items-center justify-center p-2 border border-white/10">
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
        
        {/* Name */}
        <h3 className="text-sm font-medium text-gold text-center">{name}</h3>
      </div>
    </motion.div>
  );
};

export default ExchangeCard;
