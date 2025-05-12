
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

// Define a reusable particle component for advanced animations
const Particle = ({ 
  x, 
  y, 
  size, 
  color, 
  delay, 
  duration 
}: { 
  x: number; 
  y: number; 
  size: number; 
  color: string; 
  delay: number; 
  duration: number; 
}) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ 
        x, 
        y, 
        width: size, 
        height: size, 
        background: color 
      }}
      animate={{
        y: [y, y - 100, y],
        opacity: [0.1, 0.8, 0.1],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

type BackgroundProps = {
  variant?: "primary" | "secondary"; // primary = darker, secondary = slightly lighter
  showTopWave?: boolean;
  showBottomWave?: boolean;
  showTopGradient?: boolean;
  showBottomGradient?: boolean;
  additionalElements?: React.ReactNode;
  interactive?: boolean;
  particleDensity?: "low" | "medium" | "high";
  particleColor?: string;
  glowIntensity?: "low" | "medium" | "high";
};

const SharedBackgroundEffects: React.FC<BackgroundProps> = ({
  variant = "primary",
  showTopWave = false,
  showBottomWave = false,
  showTopGradient = false,
  showBottomGradient = false,
  additionalElements,
  interactive = false,
  particleDensity = "medium",
  particleColor = "#FFD700",
  glowIntensity = "medium"
}) => {
  const bgColor = variant === "primary" ? "#0B0D0E" : "#12151E";
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
  }>>([]);
  
  // Generate particles based on density
  useEffect(() => {
    const count = 
      particleDensity === "low" ? 10 : 
      particleDensity === "medium" ? 20 : 
      40;
    
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      color: particleColor,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 3
    }));
    
    setParticles(newParticles);
  }, [particleDensity, particleColor]);
  
  // Handle mouse interaction if enabled
  useEffect(() => {
    if (!interactive) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);
  
  // Determine glow scale based on intensity
  const glowScale = 
    glowIntensity === "low" ? "scale-100 opacity-10" : 
    glowIntensity === "medium" ? "scale-125 opacity-20" : 
    "scale-150 opacity-30";
  
  return (
    <>
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-casino-darker to-casino-darker/90 z-0"></div>
      
      {/* Enhanced grid pattern with animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%']
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </motion.div>
      
      {/* Dynamic particles */}
      {particles.map(particle => (
        <Particle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          size={particle.size}
          color={particle.color}
          delay={particle.delay}
          duration={particle.duration}
        />
      ))}
      
      {/* Interactive glow effect that follows mouse if interactive is enabled */}
      {interactive && (
        <motion.div
          className={`absolute w-96 h-96 rounded-full bg-gold/10 filter blur-3xl pointer-events-none ${glowScale}`}
          animate={{
            x: mousePosition.x - 192, // Center the 384px (96*4) element on cursor
            y: mousePosition.y - 192,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      )}
      
      {/* Common animated elements with enhanced animations */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent1/10 rounded-full filter blur-3xl"
        animate={{ 
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, -20, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gold/10 rounded-full filter blur-3xl"
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          scale: [1, 1.15, 1],
          x: [0, 30, 0],
          y: [0, -15, 0]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Advanced gold particles with trails */}
      <motion.div 
        className="absolute top-40 right-1/4 w-1 h-1 rounded-full bg-gold/80 z-10"
        animate={{ 
          opacity: [0.2, 0.9, 0.2],
          scale: [1, 2, 1],
          y: [0, -50, 0],
          x: [0, 30, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut", 
          delay: 1 
        }}
      >
        {/* Particle trail */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gold/40"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-32 left-1/3 w-1 h-1 rounded-full bg-gold/80 z-10"
        animate={{ 
          opacity: [0.3, 0.9, 0.3],
          scale: [1, 1.8, 1],
          y: [0, 40, 0],
          x: [0, -20, 0],
        }}
        transition={{ 
          duration: 3.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        {/* Particle trail */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gold/40"
          initial={{ scale: 1, opacity: 0.7 }}
          animate={{ scale: 2.5, opacity: 0 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>
      
      {/* Top wave with animation */}
      {showTopWave && (
        <div className="absolute top-0 left-0 right-0 z-10">
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 100" 
            preserveAspectRatio="none" 
            className="w-full h-12"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.path 
              fill={bgColor} 
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              animate={{
                d: [
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                  "M0,40L48,35C96,30,192,20,288,24C384,28,480,46,576,52C672,58,768,52,864,46C960,40,1056,34,1152,32C1248,30,1344,32,1392,33L1440,34L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </div>
      )}
      
      {/* Top gradient with shimmer */}
      {showTopGradient && (
        <div className="absolute top-0 inset-x-0 h-24 z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-casino-darker to-transparent"></div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
      
      {/* Bottom wave with animation */}
      {showBottomWave && (
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 100" 
            preserveAspectRatio="none" 
            className="w-full h-12"
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <motion.path 
              fill={bgColor} 
              d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
              animate={{
                d: [
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z",
                  "M0,24L48,26C96,28,192,32,288,38C384,43,480,48,576,50C672,53,768,53,864,48C960,43,1056,32,1152,27C1248,21,1344,21,1392,22L1440,24L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z",
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"
                ]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          </motion.svg>
        </div>
      )}
      
      {/* Bottom gradient with shimmer */}
      {showBottomGradient && (
        <div className="absolute bottom-0 inset-x-0 h-24 z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-casino-darker to-transparent"></div>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent1/5 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      )}
      
      {/* Additional custom elements specific to each section */}
      {additionalElements}
    </>
  );
};

export default SharedBackgroundEffects;
