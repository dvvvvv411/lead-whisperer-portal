
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Star component for testimonials background
const Star = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => {
  return (
    <motion.div
      className="absolute rounded-full bg-gold"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size
      }}
      animate={{
        opacity: [0.1, 0.8, 0.1],
        scale: [1, 1.3, 1]
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Star glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gold/20 blur-sm"
        animate={{
          scale: [1, 2, 1]
        }}
        transition={{
          duration: 3,
          delay: delay * 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

// Rating star animation
const AnimatedRating = ({ x, y, delay }: { x: number; y: number; delay: number }) => {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
        y: [0, -30]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 7 + Math.random() * 5,
        ease: "easeOut"
      }}
    >
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <motion.svg 
            key={i} 
            className="w-3 h-3 text-gold fill-gold"
            viewBox="0 0 24 24"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: delay + i * 0.1,
              duration: 0.3
            }}
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </motion.svg>
        ))}
      </div>
    </motion.div>
  );
};

const BackgroundEffects = () => {
  const [stars, setStars] = useState<{x: number; y: number; size: number; delay: number}[]>([]);
  const [ratingAnimations, setRatingAnimations] = useState<{x: number; y: number; delay: number}[]>([]);
  const quoteControls = useAnimation();
  
  // Generate stars
  useEffect(() => {
    const newStars = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }));
    setStars(newStars);
    
    // Generate rating animations
    const newRatings = Array.from({ length: 8 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10
    }));
    setRatingAnimations(newRatings);
    
    // Start quote animation
    quoteControls.start({
      opacity: [0.03, 0.08, 0.03],
      scale: [1, 1.05, 1],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    });
  }, [quoteControls]);

  const additionalElements = (
    <>
      {/* Starry background effect */}
      {stars.map((star, i) => (
        <Star 
          key={i}
          x={star.x}
          y={star.y}
          size={star.size}
          delay={star.delay}
        />
      ))}
      
      {/* Rating animations popping up */}
      {ratingAnimations.map((rating, i) => (
        <AnimatedRating
          key={i}
          x={rating.x}
          y={rating.y}
          delay={rating.delay}
        />
      ))}
      
      {/* Quote background symbols */}
      <motion.div
        className="absolute text-gold/5 text-[300px] font-serif -top-20 left-10"
        animate={quoteControls}
      >
        "
      </motion.div>
      
      <motion.div
        className="absolute text-gold/5 text-[300px] font-serif bottom-0 right-10 rotate-180"
        animate={quoteControls}
      >
        "
      </motion.div>
      
      {/* Testimonial-specific animated particles with enhanced pulse */}
      <motion.div 
        className="absolute top-40 right-1/4 w-2 h-2 rounded-full bg-gold/90 z-10"
        animate={{ 
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.8, 1],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.5)",
            "0 0 30px rgba(255,215,0,0.8)",
            "0 0 0px rgba(255,215,0,0.5)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-32 left-1/3 w-2 h-2 rounded-full bg-gold/80 z-10"
        animate={{ 
          opacity: [0.2, 0.9, 0.2],
          scale: [1, 2, 1],
          y: [0, -15, 0],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.3)",
            "0 0 20px rgba(255,215,0,0.7)",
            "0 0 0px rgba(255,215,0,0.3)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Soft glow effects */}
      <motion.div 
        className="absolute top-1/3 left-1/4 w-80 h-80 bg-gold/5 rounded-full filter blur-3xl"
        animate={{
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-accent1/5 rounded-full filter blur-3xl"
        animate={{
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.15, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Animated wave patterns */}
      <svg className="absolute inset-0 w-full h-full opacity-10">
        <motion.path
          d="M 0,100 C 200,150 400,50 600,100 C 800,150 1000,50 1200,100 C 1400,150 1600,50 1800,100"
          stroke="rgba(255,215,0,0.2)"
          strokeWidth="1"
          fill="none"
          animate={{
            d: [
              "M 0,100 C 200,150 400,50 600,100 C 800,150 1000,50 1200,100 C 1400,150 1600,50 1800,100",
              "M 0,150 C 200,50 400,150 600,50 C 800,150 1000,50 1200,150 C 1400,50 1600,150 1800,50",
              "M 0,100 C 200,150 400,50 600,100 C 800,150 1000,50 1200,100 C 1400,150 1600,50 1800,100"
            ]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 0,200 C 200,250 400,150 600,200 C 800,250 1000,150 1200,200 C 1400,250 1600,150 1800,200"
          stroke="rgba(100,204,201,0.1)"
          strokeWidth="1"
          fill="none"
          animate={{
            d: [
              "M 0,200 C 200,250 400,150 600,200 C 800,250 1000,150 1200,200 C 1400,250 1600,150 1800,200",
              "M 0,250 C 200,150 400,250 600,150 C 800,250 1000,150 1200,250 C 1400,150 1600,250 1800,150",
              "M 0,200 C 200,250 400,150 600,200 C 800,250 1000,150 1200,200 C 1400,250 1600,150 1800,200"
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </svg>
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="primary"
      showTopGradient={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={true}
      particleDensity="medium"
      particleColor="rgba(255, 215, 0, 0.6)" // Gold color for particles
      glowIntensity="medium"
    />
  );
};

export default BackgroundEffects;
