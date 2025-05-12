
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Bot, Sparkles } from "lucide-react";

interface ChartDataPoint {
  x: number;
  y: number;
}

const ChartSection = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    {x: 0, y: 30},
    {x: 10, y: 28},
    {x: 20, y: 32},
    {x: 30, y: 31},
    {x: 40, y: 34},
    {x: 50, y: 28},
    {x: 60, y: 26},
    {x: 70, y: 29},
    {x: 80, y: 31},
    {x: 90, y: 35},
    {x: 100, y: 33}
  ]);
  
  // Price change direction for more realistic movement
  const [priceDirection, setPriceDirection] = useState<number>(1);
  // Volatility factor to create more dynamic changes
  const [volatility, setVolatility] = useState<number>(0.5);
  // Trend strength for gradual direction shifts
  const [trendStrength, setTrendStrength] = useState<number>(0.7);
  
  useEffect(() => {
    // Simulate realistic market behavior with trends, volatility, and price momentum
    const interval = setInterval(() => {
      // Occasionally change overall trend direction (simulating market sentiment shifts)
      if (Math.random() < 0.05) {
        setPriceDirection(prev => prev * -1);
      }
      
      // Occasionally change volatility (simulating market conditions)
      if (Math.random() < 0.1) {
        setVolatility(Math.max(0.2, Math.min(1.5, volatility + (Math.random() - 0.5) * 0.3)));
      }
      
      // Occasionally change trend strength (simulating momentum shifts)
      if (Math.random() < 0.1) {
        setTrendStrength(Math.max(0.4, Math.min(0.9, trendStrength + (Math.random() - 0.5) * 0.1)));
      }

      // Apply a Fibonacci retracement-like pattern occasionally
      const applyFibonacciPattern = Math.random() < 0.02;
      
      // Generate new data points with more realistic price action
      setChartData(prevData => {
        // Copy last point to build from
        const lastPoint = prevData[prevData.length - 1];
        const secondLastPoint = prevData[prevData.length - 2] || lastPoint;
        
        // Calculate momentum from previous movement
        const previousMovement = lastPoint.y - secondLastPoint.y;
        
        // Base change with momentum factor
        let baseChange = (Math.random() - 0.5) * volatility;
        
        // Apply trend direction
        baseChange += priceDirection * trendStrength * 0.2;
        
        // Apply momentum (price tends to continue in same direction)
        baseChange += previousMovement * 0.4;
        
        // Apply Fibonacci retracement if triggered
        if (applyFibonacciPattern) {
          // Find recent high and low
          const recentPoints = prevData.slice(-5);
          const recentHigh = Math.max(...recentPoints.map(p => p.y));
          const recentLow = Math.min(...recentPoints.map(p => p.y));
          const fibLevel = [0.236, 0.382, 0.5, 0.618, 0.786][Math.floor(Math.random() * 5)];
          const retracement = recentLow + (recentHigh - recentLow) * fibLevel;
          
          // Move toward the retracement level
          baseChange = (retracement - lastPoint.y) * 0.3;
        }
        
        // Ensure we stay within reasonable range (20-40)
        const newY = Math.max(20, Math.min(40, lastPoint.y + baseChange));
        
        // Shift all points left
        const newData = prevData.map(point => ({
          ...point,
          x: point.x > 0 ? point.x - 1 : point.x
        }));
        
        // Add new point at the right
        if (newData[newData.length - 1].x < 100) {
          newData.push({
            x: newData[newData.length - 1].x + 1,
            y: newY
          });
        } else {
          // Replace last point
          newData[newData.length - 1] = {
            x: 100,
            y: newY
          };
        }
        
        // Keep only the last 11 points for performance
        if (newData.length > 11) {
          return newData.slice(-11);
        }
        
        return newData;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, [priceDirection, volatility, trendStrength]);

  return (
    <motion.div
      className="md:col-span-2 relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {/* Chart graphic with chart container */}
      <div className="relative backdrop-blur-md border border-[#9b87f5]/20 rounded-xl p-6 shadow-lg shadow-[#9b87f5]/5 bg-black/20">
        {/* Accent elements */}
        <motion.div 
          className="absolute -top-3 -left-3 bg-black/40 p-3 rounded-lg border border-gold/20 backdrop-blur-sm"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <Bitcoin className="h-5 w-5 text-gold" />
        </motion.div>
        
        <motion.div 
          className="absolute -top-3 -right-3 bg-black/40 p-3 rounded-lg border border-[#9b87f5]/30 backdrop-blur-sm"
          whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(155,135,245,0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <Bot className="h-5 w-5 text-[#9b87f5]" />
        </motion.div>
        
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold animate-pulse" /> Live Trading Performance
        </h3>
        
        {/* Chart with SVG visualization */}
        <div className="h-60 w-full relative">
          <svg width="100%" height="100%" viewBox="0 0 100 50" className="overflow-visible">
            {/* Grid lines with subtle animation */}
            <g className="grid-lines">
              {[0, 10, 20, 30, 40, 50].map((line) => (
                <motion.line 
                  key={`h-${line}`} 
                  x1="0" 
                  y1={line} 
                  x2="100" 
                  y2={line} 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="0.3"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.03, 0.05, 0.03] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: line * 0.1 }}
                />
              ))}
              {[0, 20, 40, 60, 80, 100].map((line) => (
                <motion.line 
                  key={`v-${line}`} 
                  x1={line} 
                  y1="0" 
                  x2={line} 
                  y2="50" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="0.3"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.03, 0.05, 0.03] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: line * 0.05 }}
                />
              ))}
            </g>
            
            {/* Data points with pulse effect */}
            {chartData.map((point, index) => (
              <motion.circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r={index === chartData.length - 1 ? 0.8 : 0.4}
                fill={index === chartData.length - 1 ? "rgba(255,215,0,1)" : "rgba(155,135,245,0.6)"}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: index === chartData.length - 1 ? [1, 0.7, 1] : 1,
                  scale: index === chartData.length - 1 ? [1, 1.8, 1] : 1
                }}
                transition={{ 
                  duration: index === chartData.length - 1 ? 2 : 0.3,
                  repeat: index === chartData.length - 1 ? Infinity : 0,
                  repeatDelay: 0.5
                }}
              />
            ))}
            
            {/* Chart line with dynamic path */}
            <motion.path
              d={`M${chartData.map(point => `${point.x},${point.y}`).join(' L')}`}
              fill="none"
              stroke="url(#line-gradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
              animate={{ 
                d: `M${chartData.map(point => `${point.x},${point.y}`).join(' L')}`,
                strokeDashoffset: [0, -10, 0],
              }}
              transition={{ 
                d: { duration: 0.3, ease: "easeOut" },
                strokeDashoffset: { duration: 10, repeat: Infinity, ease: "linear" }
              }}
              style={{
                filter: "drop-shadow(0 0 2px rgba(155,135,245,0.5))"
              }}
            />
            
            {/* Area gradient with subtle animation */}
            <motion.path
              d={`M${chartData[0]?.x || 0},${chartData[0]?.y || 30} L${chartData.map(point => `${point.x},${point.y}`).join(' L')} L${chartData[chartData.length-1]?.x || 100},50 L${chartData[0]?.x || 0},50 Z`}
              fill="url(#area-gradient)"
              opacity="0.15"
              animate={{ 
                d: `M${chartData[0]?.x || 0},${chartData[0]?.y || 30} L${chartData.map(point => `${point.x},${point.y}`).join(' L')} L${chartData[chartData.length-1]?.x || 100},50 L${chartData[0]?.x || 0},50 Z`,
                opacity: [0.15, 0.18, 0.15]
              }}
              transition={{ 
                d: { duration: 0.3, ease: "easeOut" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            
            {/* Moving ticker line to simulate real-time data */}
            <motion.line
              x1="100"
              y1="0"
              x2="100"
              y2="50"
              stroke="rgba(255,215,0,0.3)"
              strokeWidth="0.4"
              strokeDasharray="1,1"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.7, 0],
                x1: [100, 0, 0], 
                x2: [100, 0, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "linear",
                times: [0, 0.9, 1]
              }}
            />
            
            {/* Gradients with animated stops */}
            <defs>
              <motion.linearGradient 
                id="line-gradient" 
                x1="0%" 
                y1="0%" 
                x2="100%" 
                y2="0%"
                animate={{
                  x1: ["0%", "20%", "0%"],
                  x2: ["100%", "80%", "100%"],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <stop offset="0%" stopColor="#FFD700" />
                <motion.stop 
                  offset="50%" 
                  stopColor="#9b87f5"
                  animate={{ offset: ["50%", "40%", "60%", "50%"] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <stop offset="100%" stopColor="#8B5CF6" />
              </motion.linearGradient>
              
              <motion.linearGradient 
                id="area-gradient" 
                x1="0%" 
                y1="0%" 
                x2="0%" 
                y2="100%"
                animate={{
                  y1: ["0%", "10%", "0%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <stop offset="0%" stopColor="#9b87f5" stopOpacity="0.8" />
                <motion.stop 
                  offset="50%" 
                  stopColor="#9b87f5" 
                  stopOpacity="0.2"
                  animate={{ 
                    offset: ["50%", "60%", "40%", "50%"],
                    stopOpacity: ["0.2", "0.3", "0.2"] 
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
              </motion.linearGradient>
            </defs>
          </svg>
          
          {/* Glowing line effect with dynamic position */}
          <motion.div 
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#9b87f5]/70 to-transparent blur-md"
            style={{ top: '30%' }}
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              width: ["50%", "70%", "50%"],
              left: ["0%", "30%", "0%"]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Real-time data flash effect */}
          <motion.div
            className="absolute top-0 right-0 h-full w-1 bg-gold/10"
            animate={{ 
              opacity: [0, 0.8, 0],
              width: [1, 4, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatDelay: 3,
              ease: "easeInOut" 
            }}
          />
          
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Stats with animated values */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="text-center p-2 bg-white/5 rounded-md border border-[#9b87f5]/10"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(155,135,245,0.3)" }}
          >
            <p className="text-xs text-gray-400">24h Gewinn</p>
            <motion.p 
              className="text-lg font-semibold text-green-400"
              animate={{
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              +2.4%
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="text-center p-2 bg-white/5 rounded-md border border-gold/10"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,215,0,0.3)" }}
          >
            <p className="text-xs text-gray-400">Erfolgsrate</p>
            <motion.p 
              className="text-lg font-semibold text-gold"
              animate={{
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              87%
            </motion.p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="text-center p-2 bg-white/5 rounded-md border border-[#9b87f5]/10"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(155,135,245,0.3)" }}
          >
            <p className="text-xs text-gray-400">Monatlich</p>
            <motion.p 
              className="text-lg font-semibold text-green-400"
              animate={{
                opacity: [1, 0.7, 1]
              }}
              transition={{
                duration: 2,
                delay: 1,
                repeat: Infinity,
                repeatDelay: 5
              }}
            >
              +15.2%
            </motion.p>
          </motion.div>
        </div>

        {/* Animated edge effect with gradients */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <motion.div
              className="absolute -inset-[1px] rounded-xl opacity-30"
              animate={{
                background: [
                  "linear-gradient(90deg, transparent, rgba(155,135,245,0.5), transparent)",
                  "linear-gradient(90deg, transparent, rgba(255,215,0,0.5), transparent)",
                  "linear-gradient(90deg, transparent, rgba(155,135,245,0.5), transparent)",
                ],
                backgroundSize: ["200% 100%", "200% 100%", "200% 100%"],
                backgroundPosition: ["100% 0%", "0% 0%", "100% 0%"],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
      
      {/* Floating animated elements around chart */}
      <motion.div 
        className="absolute -bottom-2 right-12 w-12 h-12 rounded-full"
        style={{ border: "1px solid rgba(255, 215, 0, 0.1)" }}
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.05, 1],
          borderColor: ["rgba(255, 215, 0, 0.1)", "rgba(155, 135, 245, 0.2)", "rgba(255, 215, 0, 0.1)"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute -bottom-4 right-4 w-4 h-4 rounded-full"
        style={{ background: "rgba(155, 135, 245, 0.1)" }}
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.1, 0.4, 0.1],
          background: ["rgba(155, 135, 245, 0.1)", "rgba(255, 215, 0, 0.15)", "rgba(155, 135, 245, 0.1)"]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <motion.div 
        className="absolute -bottom-2 left-20 w-6 h-6 rounded-full"
        style={{ border: "1px solid rgba(155, 135, 245, 0.1)" }}
        animate={{ 
          y: [0, -8, 0],
          opacity: [0.1, 0.3, 0.1],
          borderColor: ["rgba(155, 135, 245, 0.1)", "rgba(255, 215, 0, 0.2)", "rgba(155, 135, 245, 0.1)"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      <motion.div 
        className="absolute -top-2 right-24 w-3 h-3 rounded-full"
        style={{ background: "rgba(255, 215, 0, 0.1)" }}
        animate={{ 
          y: [0, -12, 0],
          opacity: [0.1, 0.3, 0.1] 
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <motion.div 
        className="absolute top-10 -right-4 w-8 h-8 rounded-full border border-[#9b87f5]/10"
        animate={{ 
          rotate: [0, 180, 360],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default ChartSection;
