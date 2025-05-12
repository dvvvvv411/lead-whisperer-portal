
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Typing indicator component for the contact form background
const TypingIndicator = ({ x, y }: { x: number, y: number }) => {
  return (
    <motion.div 
      className="absolute flex space-x-1"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        y: [-10, -20, -10]
      }}
      transition={{ 
        duration: 2, 
        repeat: Infinity, 
        repeatType: "reverse", 
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.div 
          key={i}
          className="w-1 h-1 rounded-full bg-gold/70"
          animate={{
            y: [0, -5, 0]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1
          }}
        />
      ))}
    </motion.div>
  );
};

// Wave effect component
const WaveEffect = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10"
      initial={{ width: 10, height: 10, opacity: 0.8 }}
      animate={{ 
        width: ['10%', '80%'], 
        height: ['10%', '80%'], 
        opacity: [0.3, 0] 
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeOut"
      }}
    />
  );
};

const BackgroundEffects = () => {
  const [typingIndicators, setTypingIndicators] = useState<{x: number, y: number}[]>([]);
  const [scrollY, setScrollY] = useState(0);
  
  // Handle scroll-based animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Generate typing indicators
  useEffect(() => {
    const indicators = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setTypingIndicators(indicators);
  }, []);

  const additionalElements = (
    <>
      {/* Contact-specific enhanced background elements */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent1/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          y: scrollY * 0.05 // Parallax effect based on scroll
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -15, 0],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          y: scrollY * -0.03 // Opposite parallax effect
        }}
      />
      
      {/* "Typing" indicators scattered around */}
      {typingIndicators.map((indicator, i) => (
        <TypingIndicator key={i} x={indicator.x} y={indicator.y} />
      ))}
      
      {/* Concentric wave animations */}
      <WaveEffect delay={0} />
      <WaveEffect delay={1} />
      <WaveEffect delay={2} />
      
      {/* Contact form highlight zone */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-lg"
        animate={{
          boxShadow: [
            "0 0 0 rgba(255,215,0,0.05)",
            "0 0 50px rgba(255,215,0,0.1)",
            "0 0 0 rgba(255,215,0,0.05)",
          ]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Data flow lines (symbolic of message sending) */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 100,300 C 200,100 300,500 900,300"
          stroke="rgba(255, 215, 0, 0.1)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10,10"
          animate={{
            strokeDashoffset: [0, -100]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.path
          d="M 300,500 C 400,300 600,700 1100,400"
          stroke="rgba(255, 215, 0, 0.05)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="15,15"
          animate={{
            strokeDashoffset: [0, -150]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
      
      {/* Glowing cursor dots that follow a path */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-gold"
        animate={{
          x: [100, 200, 300, 400, 500, 600, 700, 800],
          y: [500, 300, 500, 200, 400, 300, 500, 200],
          opacity: [0, 1, 1, 1, 1, 1, 1, 0],
          scale: [0.5, 1, 1, 1, 1, 1, 1, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.1, 0.3, 0.4, 0.6, 0.7, 0.9, 1]
        }}
      >
        <div className="absolute inset-0 scale-[2] rounded-full bg-gold/30 blur-sm"></div>
      </motion.div>
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopWave={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={true}
      particleColor="rgba(100, 204, 201, 0.7)" // Using accent1 color for particles
    />
  );
};

export default BackgroundEffects;
