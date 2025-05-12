
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Connection line component - simplified
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
      stroke="rgba(255, 215, 0, 0.15)" // Reduced opacity
      strokeWidth="1"
      strokeDasharray="5,5"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 1],
        opacity: [0, 0.6, 0] // Reduced max opacity
      }}
      transition={{
        duration: 5, // Slower
        delay,
        repeat: Infinity,
        repeatDelay: 7, // Longer delay
        ease: "easeInOut"
      }}
    />
  );
};

// Pulse effect around partner logos - simplified
const LogoPulse = ({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) => {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill="none"
      stroke="rgba(255, 215, 0, 0.08)" // Reduced opacity
      strokeWidth="1.5" // Reduced width
      initial={{ scale: 1, opacity: 0 }}
      animate={{
        scale: [1, 1.3, 1], // Reduced scale
        opacity: [0, 0.4, 0], // Reduced max opacity
        strokeWidth: [1.5, 1, 0.5] // Reduced width range
      }}
      transition={{
        duration: 4, // Slower
        delay,
        repeat: Infinity,
        repeatDelay: 3, // Longer delay
        ease: "easeOut"
      }}
    />
  );
};

const BackgroundEffects = () => {
  const [partnerNodes, setPartnerNodes] = useState<{x: number; y: number}[]>([]);
  const [connections, setConnections] = useState<{start: number; end: number; delay: number}[]>([]);
  
  // Generate partner nodes and connections - reduced count
  useEffect(() => {
    // Create 4 partner nodes in a circular layout (reduced from 6)
    const radius = 200;
    const centerX = 500;
    const centerY = 300;
    const nodes = Array.from({ length: 4 }, (_, i) => {
      const angle = (i / 4) * Math.PI * 2;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });
    setPartnerNodes(nodes);
    
    // Create connections between nodes - reduced count
    const newConnections = [];
    // Connect each node to 1 other (reduced connections)
    for (let i = 0; i < 4; i++) {
      // Connect to next node
      newConnections.push({
        start: i,
        end: (i + 1) % 4,
        delay: i * 0.7
      });
      
      // Connect to node across - only for first two nodes
      if (i < 2) {
        newConnections.push({
          start: i,
          end: (i + 2) % 4,
          delay: i * 0.7 + 3
        });
      }
    }
    setConnections(newConnections);
  }, []);

  const additionalElements = (
    <>
      {/* Partner connections visualization */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Connections - reduced count handled above */}
        {connections.map((conn, i) => {
          if (partnerNodes.length < 4) return null; // Wait for nodes to be created
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
            size={25} // Reduced size
            delay={i * 0.7}
          />
        ))}
      </svg>
      
      {/* Glowing partner spots */}
      {partnerNodes.map((node, i) => (
        <motion.div
          key={i}
          className="absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/4 filter blur-lg" // Reduced size and opacity
          style={{
            left: node.x,
            top: node.y
          }}
          animate={{
            opacity: [0.05, 0.15, 0.05], // Reduced opacity range
            scale: [1, 1.15, 1] // Reduced scale effect
          }}
          transition={{
            duration: 5, // Slower
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7
          }}
        />
      ))}
      
      {/* Flowing light trace effect - reduced to 1 */}
      <motion.div
        className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" // Reduced opacity
        style={{ width: '100%' }}
        animate={{
          opacity: [0, 0.4, 0], // Reduced opacity range
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 10, // Slower
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5 // Added delay
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
      interactive={false} // Changed to false
      particleDensity="low" // Reduced from medium
      glowIntensity="low" // Already at low
    />
  );
};

export default BackgroundEffects;
