
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Sparkle effect component
const Sparkle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-gold"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: `-5%`,
      }}
      animate={{
        y: [0, -Math.random() * 200 - 100],
        opacity: [0, 0.8, 0],
        scale: [0, Math.random() + 0.5, 0],
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }}
    >
      {/* Sparkle glow */}
      <div className="absolute inset-0 scale-[2] rounded-full bg-gold/30 blur-sm"></div>
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
        opacity: [0.1, 0.3, 0.1],
        height: [height, height * 1.1, height],
        rotate: [rotation - 2, rotation + 2, rotation - 2]
      }}
      transition={{
        duration: 6,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const BackgroundEffects = () => {
  const [sparkles, setSparkles] = useState<number[]>([]);
  
  // Generate sparkles with different delays
  useEffect(() => {
    setSparkles(Array.from({ length: 20 }, (_, i) => i * 0.4));
  }, []);
  
  const additionalElements = (
    <>
      {/* CTA-specific animated light beams with enhanced effects */}
      <motion.div 
        className="absolute -top-40 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.25, 0.1],
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
          y: [0, 20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -bottom-40 right-1/4 w-80 h-80 bg-accent1/10 rounded-full blur-3xl"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.25, 1],
          x: [0, 30, 0],
          y: [0, -30, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Multiple light cones */}
      <LightCone x="20%" width={80} height={250} rotation={-5} delay={0} />
      <LightCone x="40%" width={120} height={300} rotation={0} delay={1.5} />
      <LightCone x="70%" width={100} height={280} rotation={5} delay={3} />
      
      {/* Sparkling particles rising from the bottom */}
      {sparkles.map((delay, index) => (
        <Sparkle key={index} delay={delay} />
      ))}
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-gold/5 opacity-0"
        animate={{
          opacity: [0, 0.1, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated radial pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute w-0 h-0 bg-transparent border-2 border-gold/10 rounded-full"
          animate={{
            width: ['0%', '40%'],
            height: ['0%', '40%'],
            opacity: [0.3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        <motion.div
          className="absolute w-0 h-0 bg-transparent border border-gold/5 rounded-full"
          animate={{
            width: ['0%', '70%'],
            height: ['0%', '70%'],
            opacity: [0.2, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1
          }}
        />
      </div>
      
      {/* Moving fog effect */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/20 to-transparent"
        animate={{
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute inset-x-0 -bottom-10 h-40 bg-gradient-radial from-gold/5 to-transparent opacity-30"
        animate={{
          scale: [0.8, 1.1, 0.8],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 10,
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
      particleDensity="high"
      interactive={true}
      glowIntensity="high"
    />
  );
};

export default BackgroundEffects;
