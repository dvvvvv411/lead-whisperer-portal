
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// 3D Network Node component - simplified
const NetworkNode = ({ x, y, size, isPrimary = false }: { x: number, y: number, size: number, isPrimary?: boolean }) => {
  const pulseVariants = {
    pulse: {
      scale: [1, 1.1, 1], // Reduced scale effect
      opacity: isPrimary ? [0.7, 0.9, 0.7] : [0.3, 0.6, 0.3], // Reduced opacity effect
      transition: {
        duration: isPrimary ? 2.5 : Math.random() * 2 + 3, // Slower animation
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className={`absolute rounded-full ${isPrimary ? 'bg-gold' : 'bg-gold/30'}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size
      }}
      variants={pulseVariants}
      animate="pulse"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 rounded-full bg-gold/30 blur-sm ${isPrimary ? 'scale-125' : 'scale-110'}`}></div>
    </motion.div>
  );
};

const BackgroundEffects = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const networkControls = useAnimation();
  const [nodes, setNodes] = useState<{x: number, y: number, size: number, isPrimary: boolean}[]>([]);
  
  // Generate network nodes - reduced count
  useEffect(() => {
    const newNodes = Array.from({ length: 8 }, (_, i) => ({ // Reduced from 20 to 8
      x: Math.random() * 100, 
      y: Math.random() * 100,
      size: Math.random() * 3 + (i < 3 ? 4 : 2),  // Make some nodes larger
      isPrimary: i < 3 // First 3 nodes are primary/larger (reduced from 5)
    }));
    
    setNodes(newNodes);
  }, []);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const moveX = clientX / window.innerWidth - 0.5;
      const moveY = clientY / window.innerHeight - 0.5;
      
      setMousePosition({ x: moveX, y: moveY });
      
      // Subtly move the network based on mouse position - reduced movement
      networkControls.start({
        x: moveX * 10, // Reduced from 15
        y: moveY * 10, // Reduced from 15
        transition: { type: "spring", stiffness: 40, damping: 25 } // Made smoother
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [networkControls]);

  const additionalElements = (
    <>
      {/* 3D Network effect */}
      <motion.div 
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        animate={networkControls}
      >
        {/* Connection lines (create web effect) - reduced count */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.g
            animate={{
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Creating a network of lines - reduced from 15 to 6 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.line 
                key={i}
                x1={`${Math.random() * 100}%`} 
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`} 
                y2={`${Math.random() * 100}%`}
                stroke="rgba(255, 215, 0, 0.15)"
                strokeWidth="0.5"
                animate={{
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{
                  duration: Math.random() * 5 + 7, // Slower animation
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.g>
        </svg>
        
        {/* Network nodes - reduced count handled above */}
        {nodes.map((node, i) => (
          <NetworkNode 
            key={i} 
            x={node.x} 
            y={node.y} 
            size={node.size}
            isPrimary={node.isPrimary}
          />
        ))}
      </motion.div>
      
      {/* Hero-specific animated gold particle with enhanced effect - reduced to 1 */}
      <motion.div 
        className="absolute top-20 left-1/4 w-2 h-2 rounded-full bg-gold z-10"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.5)",
            "0 0 15px rgba(255,215,0,0.7)",
            "0 0 0px rgba(255,215,0,0.5)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Purple glowing orb with movement - reduced to 1 */}
      <motion.div 
        className="absolute top-1/4 left-1/5 w-60 h-60 bg-accent1/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -15, 0],
          y: [0, -8, 0],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
      
      {/* Data flow light trail - reduced to 1 */}
      <motion.div
        className="absolute h-1 w-20 bg-gradient-to-r from-transparent via-gold/30 to-transparent" // Reduced opacity
        style={{ top: '30%', left: '-10%' }}
        animate={{
          x: ['0%', '500%'],
          opacity: [0, 0.6, 0] // Reduced max opacity
        }}
        transition={{
          duration: 10, // Slower
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 4
        }}
      />
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="primary"
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={true} // Keep interactive for hero section
      glowIntensity="low" // Reduced from medium
    />
  );
};

export default BackgroundEffects;
