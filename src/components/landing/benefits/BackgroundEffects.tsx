
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import SharedBackgroundEffects from "../common/SharedBackgroundEffects";

// Neural network node component
const NeuralNode = ({ x, y, size, connections }: { 
  x: number; 
  y: number; 
  size: number;
  connections: {targetX: number; targetY: number}[];
}) => {
  return (
    <>
      {/* Neural connections (lines) - connections count is reduced in parent */}
      {connections.map((conn, i) => (
        <motion.line 
          key={i}
          x1={x} 
          y1={y}
          x2={conn.targetX} 
          y2={conn.targetY}
          stroke="rgba(139, 92, 246, 0.15)" // Reduced opacity
          strokeWidth="1"
          style={{vectorEffect: 'non-scaling-stroke'}}
          animate={{
            opacity: [0.05, 0.15, 0.05] // Reduced opacity change
          }}
          transition={{
            duration: 4 + Math.random() * 2, // Slower animation
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2
          }}
        />
      ))}
      
      {/* Node circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill="rgba(139, 92, 246, 0.3)" // Reduced opacity
        animate={{
          r: [size, size * 1.2, size], // Reduced scale effect
          opacity: [0.2, 0.4, 0.2] // Reduced opacity effect
        }}
        transition={{
          duration: 4, // Slower
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3
        }}
      >
        {/* Glow effect */}
        <motion.circle
          cx={0}
          cy={0}
          r={size * 1.3} // Reduced size
          fill="rgba(139, 92, 246, 0.1)"
          animate={{
            opacity: [0.1, 0.2, 0.1] // Reduced opacity
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.circle>
    </>
  );
};

const BackgroundEffects = () => {
  const [nodes, setNodes] = useState<{x: number; y: number; size: number; connections: {targetX: number; targetY: number}[]}[]>([]);
  
  // Generate neural network nodes - reduced count
  useEffect(() => {
    const newNodes: {x: number; y: number; size: number; connections: {targetX: number; targetY: number}[]}[] = [];
    const nodeCount = 6; // Reduced from 12
    
    // First generate all node positions
    const positions = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 800
    }));
    
    // Then create nodes with connections to other nodes - reduced connections
    positions.forEach((pos, i) => {
      const connections = [];
      // Connect to 1-2 other random nodes (reduced from 1-3)
      const connectionCount = Math.floor(Math.random() * 2) + 1;
      
      for (let c = 0; c < connectionCount; c++) {
        let targetIdx = Math.floor(Math.random() * nodeCount);
        // Avoid self-connections
        while (targetIdx === i) {
          targetIdx = Math.floor(Math.random() * nodeCount);
        }
        
        connections.push({
          targetX: positions[targetIdx].x,
          targetY: positions[targetIdx].y
        });
      }
      
      newNodes.push({
        x: pos.x,
        y: pos.y,
        size: Math.random() * 2.5 + 2, // Slightly reduced size
        connections
      });
    });
    
    setNodes(newNodes);
  }, []);
  
  const additionalElements = (
    <>
      {/* AI network visualization */}
      <svg className="absolute inset-0 w-full h-full opacity-60"> {/* Reduced opacity */}
        {nodes.map((node, i) => (
          <NeuralNode
            key={i}
            x={node.x}
            y={node.y}
            size={node.size}
            connections={node.connections}
          />
        ))}
      </svg>
      
      {/* Animated data chart line - reduced to 1 from 2 */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 0,150 C 50,120 100,180 150,100 C 200,20 250,120 300,150 C 350,180 400,50 450,100 C 500,150 550,50 600,20"
          stroke="rgba(255,215,0,0.08)" // Reduced opacity
          strokeWidth="2"
          fill="none"
          animate={{
            d: [
              "M 0,150 C 50,120 100,180 150,100 C 200,20 250,120 300,150 C 350,180 400,50 450,100 C 500,150 550,50 600,20",
              "M 0,100 C 50,150 100,50 150,120 C 200,180 250,80 300,120 C 350,150 400,100 450,150 C 500,100 550,150 600,80",
              "M 0,150 C 50,120 100,180 150,100 C 200,20 250,120 300,150 C 350,180 400,50 450,100 C 500,150 550,50 600,20"
            ]
          }}
          transition={{
            duration: 40, // Slower animation
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* KI analytical circles - reduced from 3 to 2 */}
      <div className="absolute inset-0">
        {[...Array(2)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-gold/8" // Reduced opacity
            style={{
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
              width: 200 + i * 100,
              height: 200 + i * 100,
            }}
            animate={{
              opacity: [0.05, 0.1, 0.05], // Reduced opacity
              scale: [1, 1.05, 1], // Reduced scale effect
              rotate: [0, 360]
            }}
            transition={{
              duration: 25 + i * 5, // Slower animation
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </>
  );

  return (
    <SharedBackgroundEffects 
      variant="primary"
      showTopGradient={true}
      showBottomGradient={true}
      additionalElements={additionalElements}
      interactive={false} // Changed to false
      particleDensity="low" // Already at low
      particleColor="rgba(139, 92, 246, 0.4)" // Reduced opacity
    />
  );
};

export default BackgroundEffects;
