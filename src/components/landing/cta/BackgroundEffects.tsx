
import { motion } from "framer-motion";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

const BackgroundEffects = () => {
  const additionalElements = (
    <>
      {/* CTA-specific animated light beams */}
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
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopGradient={true}
      showBottomWave={true}
      additionalElements={additionalElements}
    />
  );
};

export default BackgroundEffects;
