
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Vereinfachte Sparkle-Effekt-Komponente
const Sparkle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-gold"
      style={{
        left: `${Math.random() * 100}%`,
        bottom: `-5%`,
      }}
      animate={{
        y: [0, -Math.random() * 100 - 50], // Reduzierte Distanz
        opacity: [0, 0.4, 0], // Reduzierte Opazität
        scale: [0, Math.random() * 0.3 + 0.3, 0], // Reduzierte Skalierung
      }}
      transition={{
        duration: Math.random() * 2 + 4, // Langsamere Animation
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 6 // Längere Pause zwischen Wiederholungen
      }}
    >
      {/* Vereinfachtes Funkeln-Glühen */}
      <div className="absolute inset-0 scale-[1.3] rounded-full bg-gold/20 blur-sm"></div>
    </motion.div>
  );
};

// Vereinfachte Lichtstrahl-Komponente
const LightCone = ({ x, width, height, rotation, delay }: { 
  x: string, 
  width: number, 
  height: number, 
  rotation: number,
  delay: number
}) => {
  return (
    <motion.div
      className="absolute bottom-0 bg-gradient-to-t from-gold/3 to-transparent" // Reduzierte Opazität
      style={{
        left: x,
        width: width,
        height: height,
        transformOrigin: 'bottom center',
        rotate: rotation,
      }}
      animate={{
        opacity: [0.03, 0.1, 0.03], // Reduzierte Opazität
      }}
      transition={{
        duration: 9, // Langsamere Animation
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const BackgroundEffects = () => {
  const [sparkles, setSparkles] = useState<number[]>([]);
  
  // Stark reduzierte Anzahl an Sparkles
  useEffect(() => {
    setSparkles(Array.from({ length: 4 }, (_, i) => i * 1.2)); // Reduziert von 8 auf 4
  }, []);
  
  const additionalElements = (
    <>
      {/* Vereinfachter animierter Lichtstrahl */}
      <motion.div 
        className="absolute -top-40 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" // Reduzierte Opazität
        animate={{ 
          opacity: [0.05, 0.08, 0.05], // Reduzierte Opazität
          scale: [1, 1.05, 1], // Reduzierte Skalierung
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} // Langsamere Animation
      />
      
      {/* Nur ein Lichtkegel statt zwei */}
      <LightCone x="45%" width={120} height={250} rotation={0} delay={1} />
      
      {/* Reduzierte Funkelpartikel */}
      {sparkles.map((delay, index) => (
        <Sparkle key={index} delay={delay} />
      ))}
      
      {/* Vereinfachter animierter Gradient-Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent to-gold/3 opacity-0" // Reduzierte Opazität
        animate={{
          opacity: [0, 0.05, 0], // Reduzierte Opazität
        }}
        transition={{
          duration: 15, // Langsamere Animation
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
      interactive={false}
      particleDensity="low"
      glowIntensity="low"
    />
  );
};

export default BackgroundEffects;
