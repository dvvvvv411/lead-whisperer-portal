
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Logo = () => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      whileHover={{
        scale: 1.05
      }} 
      className={`flex flex-col items-center ${isMobile ? 'mx-auto' : ''}`}
    >
      <img 
        src="https://i.imgur.com/UA0DBN4.png" 
        alt="KRYPTO AI Logo" 
        className="h-12 object-contain" 
      />
      
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
