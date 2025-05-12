import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
const Logo = () => {
  const isMobile = useIsMobile();
  return <motion.div whileHover={{
    scale: 1.05
  }} className={`flex flex-col items-center ${isMobile ? 'mx-auto' : ''}`}>
      <img src="https://i.imgur.com/lL2FhfD.png" alt="KRYPTO AI Logo" className="h-12 object-contain" />
      
      {/* Trading badge positioned below logo in mobile view - will only show here */}
      {isMobile}
    </motion.div>;
};
export default Logo;