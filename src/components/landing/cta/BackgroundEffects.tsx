
import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <>
      {/* Unified background elements with consistent color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C0E10]/90 to-[#0B0D0E]/95 opacity-90"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Animated light beams with gold and purple tones */}
      <motion.div 
        className="absolute -top-40 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Animated gold particles */}
      <motion.div 
        className="absolute top-40 right-1/3 w-1 h-1 rounded-full bg-gold/70"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Transition gradient to the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#090B0D] to-transparent"></div>
    </>
  );
};

export default BackgroundEffects;
