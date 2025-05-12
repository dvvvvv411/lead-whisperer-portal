
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Typing indicator component for the contact form background - simplified
const TypingIndicator = ({ x, y }: { x: number, y: number }) => {
  return (
    <motion.div 
      className="absolute flex space-x-1"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.7, 0],
        y: [-5, -15, -5]
      }}
      transition={{ 
        duration: 3, // Slower
        repeat: Infinity, 
        repeatType: "reverse", 
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
    >
      {[0, 1, 2].map(i => (
        <motion.div 
          key={i}
          className="w-1 h-1 rounded-full bg-gold/60" // Reduced opacity
          animate={{
            y: [0, -4, 0] // Reduced movement
          }}
          transition={{
            duration: 0.6,
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
  
  // Generate typing indicators - reduced count
  useEffect(() => {
    const indicators = Array.from({ length: 4 }, () => ({ // Reduced from 8 to 4
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setTypingIndicators(indicators);
  }, []);

  const additionalElements = (
    <>
      {/* Contact-specific enhanced background elements - simplified */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent1/8 rounded-full filter blur-3xl" // Reduced opacity
        animate={{
          scale: [1, 1.07, 1], // Reduced scale effect
          opacity: [0.08, 0.12, 0.08] // Reduced opacity
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        style={{
          y: scrollY * 0.04 // Reduced parallax effect
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gold/7 rounded-full filter blur-3xl" // Reduced opacity
        animate={{
          scale: [1, 1.1, 1], // Reduced scale effect
          opacity: [0.07, 0.15, 0.07] // Reduced opacity
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{
          y: scrollY * -0.02 // Reduced parallax effect
        }}
      />
      
      {/* "Typing" indicators scattered around - reduced count above */}
      {typingIndicators.map((indicator, i) => (
        <TypingIndicator key={i} x={indicator.x} y={indicator.y} />
      ))}
      
      {/* Contact form highlight zone - simplified */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-lg"
        animate={{
          boxShadow: [
            "0 0 0 rgba(255,215,0,0.02)",
            "0 0 30px rgba(255,215,0,0.06)",
            "0 0 0 rgba(255,215,0,0.02)",
          ]
        }}
        transition={{
          duration: 8, // Slower
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Data flow lines (symbolic of message sending) - reduced to 1 */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 300,500 C 400,300 600,700 1100,400"
          stroke="rgba(255, 215, 0, 0.04)" // Reduced opacity
          strokeWidth="2"
          fill="none"
          strokeDasharray="15,15"
          animate={{
            strokeDashoffset: [0, -150]
          }}
          transition={{
            duration: 20, // Slower
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </svg>
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopWave={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={false} // Changed to false
      particleDensity="low" // Reduced from medium/high
      particleColor="rgba(100, 204, 201, 0.5)" // Reduced opacity
    />
  );
};

export default BackgroundEffects;
