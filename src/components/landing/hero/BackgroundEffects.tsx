
import { motion } from "framer-motion";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

const BackgroundEffects = () => {
  const additionalElements = (
    <>
      {/* Hero-specific animated gold particles */}
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
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="primary"
      showBottomGradient={true}
      additionalElements={additionalElements}
    />
  );
};

export default BackgroundEffects;
