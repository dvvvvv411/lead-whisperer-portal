
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Connection line component
const ConnectionLine = ({ 
  startX, 
  startY, 
  endX, 
  endY, 
  delay 
}: { 
  startX: number; 
  startY: number; 
  endX: number; 
  endY: number; 
  delay: number;
}) => {
  return (
    <motion.line
      x1={startX}
      y1={startY}
      x2={endX}
      y2={endY}
      stroke="rgba(255, 215, 0, 0.2)"
      strokeWidth="1"
      strokeDasharray="5,5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 1],
        opacity: [0, 0.8, 0]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 5,
        ease: "easeInOut"
      }}
    />
  );
};

// Pulse effect around partner logos
const LogoPulse = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill="none"
      stroke="rgba(255, 215, 0, 0.1)"
      strokeWidth="2"
      initial={{ scale: 1, opacity: 0 }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0, 0.5, 0],
        strokeWidth: [2, 1, 0]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeOut"
      }}
    />
  );
};

const BackgroundEffects = () => {
  const [partnerNodes, setPartnerNodes] = useState<{x: number; y: number}[]>([]);
  const [connections, setConnections] = useState<{start: number; end: number; delay: number}[]>([]);
  
  // Generate partner nodes and connections
  useEffect(() => {
    // Create 6 partner nodes in a circular layout
    const radius = 200;
    const centerX = 500;
    const centerY = 300;
    const nodes = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });
    setPartnerNodes(nodes);
    
    // Create connections between nodes
    const newConnections = [];
    // Connect each node to 2 others
    for (let i = 0; i < 6; i++) {
      // Connect to next node
      newConnections.push({
        start: i,
        end: (i + 1) % 6,
        delay: i * 0.5
      });
      
      // Connect to node across
      newConnections.push({
        start: i,
        end: (i + 3) % 6,
        delay: i * 0.5 + 3
      });
    }
    setConnections(newConnections);
  }, []);

  const additionalElements = (
    <>
      {/* Partner connections visualization */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Connections */}
        {connections.map((conn, i) => {
          if (partnerNodes.length < 6) return null; // Wait for nodes to be created
          return (
            <ConnectionLine
              key={i}
              startX={partnerNodes[conn.start].x}
              startY={partnerNodes[conn.start].y}
              endX={partnerNodes[conn.end].x}
              endY={partnerNodes[conn.end].y}
              delay={conn.delay}
            />
          );
        })}
        
        {/* Node pulses */}
        {partnerNodes.map((node, i) => (
          <LogoPulse
            key={i}
            x={node.x}
            y={node.y}
            size={30}
            delay={i * 0.5}
          />
        ))}
      </svg>
      
      {/* Glowing partner spots */}
      {partnerNodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 filter blur-lg"
          style={{
            left: node.x,
            top: node.y
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5
          }}
        />
      ))}
      
      {/* Partner-specific animated particles */}
      <motion.div 
        className="absolute top-20 left-1/3 w-2 h-2 rounded-full bg-gold/80 z-10"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.3)",
            "0 0 15px rgba(255,215,0,0.6)",
            "0 0 0px rgba(255,215,0,0.3)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute bottom-40 right-1/4 w-2 h-2 rounded-full bg-gold/60 z-10"
        animate={{ 
          opacity: [0.2, 0.7, 0.2],
          scale: [1, 1.8, 1],
          boxShadow: [
            "0 0 0px rgba(255,215,0,0.2)",
            "0 0 15px rgba(255,215,0,0.5)",
            "0 0 0px rgba(255,215,0,0.2)"
          ]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      />
      
      {/* Floating trust indicators */}
      <motion.div
        className="absolute top-2/3 left-1/3 px-6 py-2 rounded-full bg-black/10 border border-gold/20 backdrop-blur-sm text-gold/60 text-xs font-medium"
        animate={{
          y: [0, -15, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5
        }}
      >
        Trusted by 5000+ users
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 right-1/5 px-6 py-2 rounded-full bg-black/10 border border-gold/20 backdrop-blur-sm text-gold/60 text-xs font-medium"
        animate={{
          y: [0, -15, 0],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
          repeatDelay: 5
        }}
      >
        97% Customer Satisfaction
      </motion.div>
      
      {/* Flowing light trace effect */}
      <motion.div
        className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent"
        style={{ width: '100%' }}
        animate={{
          opacity: [0, 0.5, 0],
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 4
        }}
      />
      
      <motion.div
        className="absolute top-1/3 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        style={{ width: '100%' }}
        animate={{
          opacity: [0, 0.3, 0],
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
          repeatDelay: 3
        }}
      />
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="secondary"
      showTopGradient={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={true}
      particleDensity="medium"
      glowIntensity="low"
    />
  );
};

export default BackgroundEffects;
