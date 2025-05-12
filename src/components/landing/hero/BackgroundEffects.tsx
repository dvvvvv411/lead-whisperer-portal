
import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <>
      {/* Modified background to match CTA section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D0E]/90 via-[#0B0D0E]/80 to-[#0B0D0E]/90 z-0"></div>
      
      {/* Subtiles animiertes Rastermuster */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animierte Gold-Partikel mit mehr Animation */}
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
        <motion.div 
          className="absolute bottom-40 right-1/3 w-1 h-1 rounded-full bg-gold/30"
          animate={{ 
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.6, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div 
          className="absolute top-60 right-1/4 w-1 h-1 rounded-full bg-gold/40"
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.7, 1]
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        
        {/* Lila leuchtende Kugeln */}
        <div className="absolute top-1/4 left-1/5 w-60 h-60 bg-[#9b87f5]/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/5 w-60 h-60 bg-[#8B5CF6]/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-2/3 left-1/3 w-40 h-40 bg-[#7E69AB]/5 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
    </>
  );
};

export default BackgroundEffects;
