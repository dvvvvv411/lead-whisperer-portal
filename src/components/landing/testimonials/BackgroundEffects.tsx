
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Star component for testimonials background - simplified
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
        opacity: [0.1, 0.6, 0.1], // Reduced max opacity
        scale: [1, 1.2, 1] // Reduced scale effect
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
          scale: [1, 1.5, 1] // Reduced scale
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

// Rating star animation - simplified
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
        opacity: [0, 0.8, 0], // Reduced max opacity
        scale: [0, 0.9, 0], // Reduced scale
        y: [0, -20] // Reduced movement
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 10 + Math.random() * 5, // Longer delay between animations
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
  
  // Generate stars - reduced count
  useEffect(() => {
    const newStars = Array.from({ length: 15 }, () => ({ // Reduced from 50 to 15
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5
    }));
    setStars(newStars);
    
    // Generate rating animations - reduced count
    const newRatings = Array.from({ length: 3 }, () => ({ // Reduced from 8 to 3
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10
    }));
    setRatingAnimations(newRatings);
    
    // Start quote animation - simplified
    quoteControls.start({
      opacity: [0.02, 0.05, 0.02], // Reduced opacity
      scale: [1, 1.03, 1], // Reduced scale
      transition: { duration: 10, repeat: Infinity, ease: "easeInOut" }
    });
  }, [quoteControls]);

  const additionalElements = (
    <>
      {/* Starry background effect - reduced count handled above */}
      {stars.map((star, i) => (
        <Star 
          key={i}
          x={star.x}
          y={star.y}
          size={star.size}
          delay={star.delay}
        />
      ))}
      
      {/* Rating animations popping up - reduced count handled above */}
      {ratingAnimations.map((rating, i) => (
        <AnimatedRating
          key={i}
          x={rating.x}
          y={rating.y}
          delay={rating.delay}
        />
      ))}
      
      {/* Quote background symbols - simplified */}
      <motion.div
        className="absolute text-gold/3 text-[250px] font-serif -top-20 left-10" // Reduced opacity and size
        animate={quoteControls}
      >
        "
      </motion.div>
      
      <motion.div
        className="absolute text-gold/3 text-[250px] font-serif bottom-0 right-10 rotate-180" // Reduced opacity and size
        animate={quoteControls}
      >
        "
      </motion.div>
      
      {/* Testimonial-specific animated particle - reduced to 1 */}
      <motion.div 
        className="absolute top-40 right-1/4 w-2 h-2 rounded-full bg-gold/70 z-10" // Reduced opacity
        animate={{ 
          opacity: [0.2, 0.7, 0.2], // Reduced opacity range
          scale: [1, 1.5, 1], // Reduced scale effect
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.3)",
            "0 0 20px rgba(255,215,0,0.6)",
            "0 0 0px rgba(255,215,0,0.3)"
          ]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Animated wave pattern - reduced to 1 */}
      <svg className="absolute inset-0 w-full h-full opacity-8"> {/* Reduced opacity */}
        <motion.path
          d="M 0,100 C 200,150 400,50 600,100 C 800,150 1000,50 1200,100 C 1400,150 1600,50 1800,100"
          stroke="rgba(255,215,0,0.15)" // Reduced opacity
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
            duration: 25, // Slower animation
            repeat: Infinity,
            ease: "easeInOut"
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
      interactive={false} // Changed to false
      particleDensity="low" // Reduced from medium
      particleColor="rgba(255, 215, 0, 0.4)" // Reduced opacity
      glowIntensity="low" // Reduced from medium
    />
  );
};

export default BackgroundEffects;
