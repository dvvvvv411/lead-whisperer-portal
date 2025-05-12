
import { motion } from "framer-motion";
import React from "react";

type BackgroundProps = {
  variant?: "primary" | "secondary"; // primary = darker, secondary = slightly lighter
  showTopWave?: boolean;
  showBottomWave?: boolean;
  showTopGradient?: boolean;
  showBottomGradient?: boolean;
  additionalElements?: React.ReactNode;
};

const SharedBackgroundEffects: React.FC<BackgroundProps> = ({
  variant = "primary",
  showTopWave = false,
  showBottomWave = false,
  showTopGradient = false,
  showBottomGradient = false,
  additionalElements,
}) => {
  const bgColor = variant === "primary" ? "#0B0D0E" : "#12151E";
  
  return (
    <>
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-casino-darker to-casino-darker/90 z-0"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>
      
      {/* Common animated elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent1/5 rounded-full filter blur-3xl"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold/5 rounded-full filter blur-3xl"
        animate={{ 
          opacity: [0.1, 0.15, 0.1],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Gold particles */}
      <motion.div 
        className="absolute top-40 right-1/4 w-1 h-1 rounded-full bg-gold/60"
        animate={{ 
          opacity: [0.2, 0.7, 0.2],
          scale: [1, 1.8, 1]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-gold/80"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Top wave or gradient */}
      {showTopWave && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12">
            <path fill={bgColor} d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      )}
      
      {showTopGradient && (
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-casino-darker to-transparent z-10"></div>
      )}
      
      {/* Bottom wave or gradient */}
      {showBottomWave && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12">
            <path fill={bgColor} d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
          </svg>
        </div>
      )}
      
      {showBottomGradient && (
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-casino-darker to-transparent z-10"></div>
      )}
      
      {/* Additional custom elements specific to each section */}
      {additionalElements}
    </>
  );
};

export default SharedBackgroundEffects;
