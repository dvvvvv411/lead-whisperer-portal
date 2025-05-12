
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
      {/* Neural connections (lines) */}
      {connections.map((conn, i) => (
        <motion.line 
          key={i}
          x1={x} 
          y1={y}
          x2={conn.targetX} 
          y2={conn.targetY}
          stroke="rgba(139, 92, 246, 0.2)"
          strokeWidth="1"
          style={{vectorEffect: 'non-scaling-stroke'}}
          animate={{
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
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
        fill="rgba(139, 92, 246, 0.4)"
        animate={{
          r: [size, size * 1.3, size],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 3
        }}
      >
        {/* Glow effect */}
        <motion.circle
          cx={0}
          cy={0}
          r={size * 1.5}
          fill="rgba(139, 92, 246, 0.1)"
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.circle>
    </>
  );
};

// Data flow component
const DataFlow = () => {
  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Binary data visualization */}
      <div className="relative w-full h-full overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs font-mono text-accent1/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: 0,
            }}
            initial={{ y: -100 }}
            animate={{
              y: ["0vh", "100vh"],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j} className="my-2">
                {Math.random() > 0.5 ? "1" : "0"}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const BackgroundEffects = () => {
  const [nodes, setNodes] = useState<{x: number; y: number; size: number; connections: {targetX: number; targetY: number}[]}[]>([]);
  
  // Generate neural network nodes
  useEffect(() => {
    const newNodes: {x: number; y: number; size: number; connections: {targetX: number; targetY: number}[]}[] = [];
    const nodeCount = 12;
    
    // First generate all node positions
    const positions = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * 1000,
      y: Math.random() * 800
    }));
    
    // Then create nodes with connections to other nodes
    positions.forEach((pos, i) => {
      const connections = [];
      // Connect to 1-3 other random nodes
      const connectionCount = Math.floor(Math.random() * 3) + 1;
      
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
        size: Math.random() * 3 + 2,
        connections
      });
    });
    
    setNodes(newNodes);
  }, []);
  
  const additionalElements = (
    <>
      {/* AI network visualization */}
      <svg className="absolute inset-0 w-full h-full opacity-70">
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
      
      {/* Data flow visualization */}
      <DataFlow />
      
      {/* Abstract brain/network shape */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-1/4 h-1/4"
      >
        <svg 
          viewBox="0 0 200 200" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full opacity-10"
        >
          <motion.path
            d="M100,20 C130,20 170,50 170,100 C170,150 130,180 100,180 C70,180 30,150 30,100 C30,50 70,20 100,20 Z"
            fill="none"
            stroke="rgba(139, 92, 246, 0.3)"
            strokeWidth="1"
            animate={{
              d: [
                "M100,20 C130,20 170,50 170,100 C170,150 130,180 100,180 C70,180 30,150 30,100 C30,50 70,20 100,20 Z",
                "M100,30 C140,30 160,60 160,100 C160,140 140,170 100,170 C60,170 40,140 40,100 C40,60 60,30 100,30 Z",
                "M100,20 C130,20 170,50 170,100 C170,150 130,180 100,180 C70,180 30,150 30,100 C30,50 70,20 100,20 Z"
              ]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </motion.div>
      
      {/* Animated data chart lines */}
      <svg className="absolute inset-0 w-full h-full">
        <motion.path
          d="M 0,150 C 50,120 100,180 150,100 C 200,20 250,120 300,150 C 350,180 400,50 450,100 C 500,150 550,50 600,20"
          stroke="rgba(255,215,0,0.1)"
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
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M 0,200 C 100,150 200,250 300,200 C 400,150 500,250 600,150"
          stroke="rgba(100,204,201,0.05)"
          strokeWidth="3"
          fill="none"
          animate={{
            d: [
              "M 0,200 C 100,150 200,250 300,200 C 400,150 500,250 600,150",
              "M 0,150 C 100,200 200,150 300,250 C 400,200 500,150 600,200",
              "M 0,200 C 100,150 200,250 300,200 C 400,150 500,250 600,150"
            ]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
      
      {/* KI analytical circles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-gold/10"
            style={{
              top: '50%',
              left: '50%',
              translateX: '-50%',
              translateY: '-50%',
              width: 200 + i * 100,
              height: 200 + i * 100,
            }}
            animate={{
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1],
              rotate: [0, 360]
            }}
            transition={{
              duration: 20 + i * 5,
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
      interactive={true}
      particleDensity="low" // Keep density low since we have our own network nodes
      particleColor="rgba(139, 92, 246, 0.5)" // Use accent purple color for particles
    />
  );
};

export default BackgroundEffects;
