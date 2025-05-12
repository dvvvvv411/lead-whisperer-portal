
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Vereinfachte Typing-Indikator-Komponente
const TypingIndicator = ({ x, y }: { x: number, y: number }) => {
  return (
    <motion.div 
      className="absolute flex space-x-1"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.5, 0], // Reduzierte Opazität
        y: [-5, -12, -5]  // Reduzierte Bewegung
      }}
      transition={{ 
        duration: 4, // Langsamere Animation
        repeat: Infinity, 
        repeatType: "reverse", 
        ease: "easeInOut",
        delay: Math.random() * 5
      }}
    >
      {[0, 1].map(i => ( // Reduziert von 3 auf 2 Punkte
        <motion.div 
          key={i}
          className="w-1 h-1 rounded-full bg-gold/40" // Reduzierte Opazität
          animate={{
            y: [0, -3, 0] // Reduzierte Bewegung
          }}
          transition={{
            duration: 0.8, // Langsamere Animation
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
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Generate typing indicators - stark reduziert
  useEffect(() => {
    const indicators = Array.from({ length: 2 }, () => ({ // Reduziert von 4 auf 2
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setTypingIndicators(indicators);
  }, []);

  const additionalElements = (
    <>
      {/* Eine vereinfachte Hintergrundblase */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent1/5 rounded-full filter blur-3xl" // Reduzierte Opazität
        animate={{
          scale: [1, 1.04, 1], // Reduzierte Skalierung
          opacity: [0.05, 0.08, 0.05] // Reduzierte Opazität
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} // Langsamere Animation
        style={{
          y: scrollY * 0.02 // Reduzierter Parallax-Effekt
        }}
      />
      
      {/* Reduzierte Typing-Indikatoren */}
      {typingIndicators.map((indicator, i) => (
        <TypingIndicator key={i} x={indicator.x} y={indicator.y} />
      ))}
      
      {/* Vereinfachte Kontaktformular-Hervorhebung */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 rounded-lg"
        animate={{
          boxShadow: [
            "0 0 0 rgba(255,215,0,0.01)",
            "0 0 20px rgba(255,215,0,0.04)",
            "0 0 0 rgba(255,215,0,0.01)",
          ]
        }}
        transition={{
          duration: 10, // Langsamere Animation
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopWave={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={false}
      particleDensity="low"
      particleColor="rgba(100, 204, 201, 0.4)" // Reduzierte Opazität
    />
  );
};

export default BackgroundEffects;
