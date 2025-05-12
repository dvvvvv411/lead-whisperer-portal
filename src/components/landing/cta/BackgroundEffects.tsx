
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Sparkle effect component - simplified
const Sparkle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-gold"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: `-5%`,
      }}
      animate={{
        y: [0, -Math.random() * 150 - 80], // Reduced distance
        opacity: [0, 0.6, 0], // Reduced opacity
        scale: [0, Math.random() * 0.4 + 0.5, 0], // Reduced scale
      }}
      transition={{
        duration: Math.random() * 2 + 3,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 4
      }}
    >
      {/* Sparkle glow */}
      <div className="absolute inset-0 scale-[1.5] rounded-full bg-gold/30 blur-sm"></div> {/* Reduced scale */}
    </motion.div>
  );
};

// Light cone component
const LightCone = ({ x, width, height, rotation, delay }: { 
  x: string, 
  width: number, 
  height: number, 
  rotation: number,
  delay: number
}) => {
  return (
    <motion.div
      className="absolute bottom-0 bg-gradient-to-t from-gold/5 to-transparent"
      style={{
        left: x,
        width: width,
        height: height,
        transformOrigin: 'bottom center',
        rotate: rotation,
      }}
      animate={{
        opacity: [0.05, 0.2, 0.05], // Reduced opacity
        height: [height, height * 1.05, height], // Reduced height change
      }}
      transition={{
        duration: 7, // Slower
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const BackgroundEffects = () => {
  const [sparkles, setSparkles] = useState<number[]>([]);
  
  // Generate sparkles with different delays - reduced count
  useEffect(() => {
    setSparkles(Array.from({ length: 8 }, (_, i) => i * 0.6)); // Reduced from 20 to 8
  }, []);
  
  const additionalElements = (
    <>
      {/* CTA-specific animated light beam - reduced count and complexity */}
      <motion.div 
        className="absolute -top-40 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.08, 0.15, 0.08],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Multiple light cones - reduced from 3 to 2 */}
      <LightCone x="25%" width={90} height={250} rotation={-3} delay={0} />
      <LightCone x="65%" width={100} height={270} rotation={3} delay={2} />
      
      {/* Sparkling particles rising from the bottom - reduced count above */}
      {sparkles.map((delay, index) => (
        <Sparkle key={index} delay={delay} />
      ))}
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-gold/5 opacity-0"
        animate={{
          opacity: [0, 0.08, 0], // Reduced opacity
        }}
        transition={{
          duration: 12, // Slower
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Moving fog effect - simplified */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/15 to-transparent"
        animate={{
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10, // Slower
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopGradient={true}
      showBottomWave={true}
      additionalElements={additionalElements}
      interactive={false} // Changed to false
      particleDensity="low" // Reduced from high
      glowIntensity="low" // Reduced from high
    />
  );
};

export default BackgroundEffects;
