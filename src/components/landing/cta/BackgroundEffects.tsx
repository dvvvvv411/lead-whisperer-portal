
import { motion } from "framer-motion";

const BackgroundEffects = () => {
  return (
    <>
      {/* Unified background elements with consistent color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0D0E]/70 to-[#0B0D0E]/90 opacity-80"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
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
        className="absolute -bottom-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Enhanced bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="#0B0D0E" 
            fillOpacity="1" 
            d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,58.7C1200,43,1320,21,1380,10.7L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          ></path>
        </svg>
      </div>
    </>
  );
};

export default BackgroundEffects;
