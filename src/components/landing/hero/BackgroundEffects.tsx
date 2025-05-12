
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// 3D Network Node component
const NetworkNode = ({ x, y, size, isPrimary = false }: { x: number, y: number, size: number, isPrimary?: boolean }) => {
  const pulseVariants = {
    pulse: {
      scale: [1, 1.2, 1],
      opacity: isPrimary ? [0.8, 1, 0.8] : [0.3, 0.7, 0.3],
      transition: {
        duration: isPrimary ? 2 : Math.random() * 3 + 2,
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
      <div className={`absolute inset-0 rounded-full bg-gold/30 blur-sm ${isPrimary ? 'scale-150' : 'scale-125'}`}></div>
    </motion.div>
  );
};

const BackgroundEffects = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const networkControls = useAnimation();
  const [nodes, setNodes] = useState<{x: number, y: number, size: number, isPrimary: boolean}[]>([]);
  
  // Generate network nodes
  useEffect(() => {
    const newNodes = Array.from({ length: 20 }, (_, i) => ({
      x: Math.random() * 100, 
      y: Math.random() * 100,
      size: Math.random() * 4 + (i < 5 ? 4 : 2),  // Make some nodes larger
      isPrimary: i < 5 // First 5 nodes are primary/larger
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
      
      // Subtly move the network based on mouse position
      networkControls.start({
        x: moveX * 15,
        y: moveY * 15,
        transition: { type: "spring", stiffness: 50, damping: 30 }
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
        {/* Connection lines (create web effect) */}
        <svg className="absolute inset-0 w-full h-full">
          <motion.g
            animate={{
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Creating a network of lines */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.line 
                key={i}
                x1={`${Math.random() * 100}%`} 
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`} 
                y2={`${Math.random() * 100}%`}
                stroke="rgba(255, 215, 0, 0.15)"
                strokeWidth="0.5"
                animate={{
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.g>
        </svg>
        
        {/* Network nodes */}
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
      
      {/* Hero-specific animated gold particles with enhanced effects */}
      <motion.div 
        className="absolute top-20 left-1/4 w-2 h-2 rounded-full bg-gold z-10"
        animate={{ 
          opacity: [0.3, 1, 0.3],
          scale: [1, 1.8, 1],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.5)",
            "0 0 20px rgba(255,215,0,0.8)",
            "0 0 0px rgba(255,215,0,0.5)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-40 left-1/3 w-2 h-2 rounded-full bg-gold/70 z-10"
        animate={{ 
          opacity: [0.2, 0.8, 0.2],
          scale: [1, 2, 1],
          y: [0, -30, 0],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.3)",
            "0 0 15px rgba(255,215,0,0.6)",
            "0 0 0px rgba(255,215,0,0.3)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* Purple glowing orbs with movement */}
      <motion.div 
        className="absolute top-1/4 left-1/5 w-60 h-60 bg-accent1/10 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -20, 0],
          y: [0, -10, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-1/5 w-60 h-60 bg-accent1/15 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, 15, 0],
          opacity: [0.1, 0.18, 0.1]
        }}
        transition={{
          duration: 10, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Data flow light trails */}
      <motion.div
        className="absolute h-1 w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        style={{ top: '30%', left: '-10%' }}
        animate={{
          x: ['0%', '500%'],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 3
        }}
      />
      
      <motion.div
        className="absolute h-1 w-24 bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        style={{ top: '60%', left: '-5%' }}
        animate={{
          x: ['0%', '500%'],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
          repeatDelay: 2
        }}
      />
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="primary"
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={true}
      glowIntensity="medium"
    />
  );
};

export default BackgroundEffects;
