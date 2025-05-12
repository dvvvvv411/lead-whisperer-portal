
import { motion } from "framer-motion";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

const BackgroundEffects = () => {
  const additionalElements = (
    <>
      {/* Testimonial-specific animated particles */}
      <motion.div 
        className="absolute top-40 right-1/4 w-1 h-1 rounded-full bg-gold/80"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-gold/60"
        animate={{ 
          opacity: [0.2, 0.7, 0.2],
          scale: [1, 1.8, 1]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="primary"
      showTopGradient={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
    />
  );
};

export default BackgroundEffects;
