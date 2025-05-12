
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
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden p-4"
      onClick={() => window.open(websiteUrl, '_blank')}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 15px rgba(255, 215, 0, 0.3)",
        borderColor: "rgba(255, 215, 0, 0.3)"
      }}
      whileTap={{ scale: 0.97 }}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Logo container with glow effect */}
        <div className="w-16 h-16 bg-white/10 rounded-md flex items-center justify-center p-2 border border-white/10">
          <motion.img 
            src={logo} 
            alt={`${name} logo`} 
            className="max-w-full max-h-full object-contain" 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
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
