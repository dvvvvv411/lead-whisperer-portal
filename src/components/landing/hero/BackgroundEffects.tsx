
import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <>
      {/* Dark background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D0E]/90 via-[#0B0D0E]/80 to-[#0B0D0E]/90 z-0"></div>
      
      {/* Subtle animated grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated gold particles */}
        <motion.div 
          className="absolute top-20 left-1/4 w-1 h-1 rounded-full bg-gold"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 left-1/3 w-1 h-1 rounded-full bg-gold/50"
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.8, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        
        {/* Purple glowing orbs */}
        <div className="absolute top-1/4 left-1/5 w-60 h-60 bg-accent1/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/5 w-60 h-60 bg-accent1/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        {/* Transition gradient to the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0C0E10] to-transparent"></div>
      </div>
    </>
  );
};

export default BackgroundEffects;
