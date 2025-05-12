
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bitcoin, Bot, Sparkles } from "lucide-react";

interface ChartDataPoint {
  x: number;
  y: number;
}

const ChartSection = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([
    {x: 0, y: 35},
    {x: 15, y: 30},
    {x: 30, y: 25},
    {x: 45, y: 20},
    {x: 60, y: 15},
    {x: 75, y: 10},
    {x: 100, y: 15}
  ]);

  // Animation für die Chart zur Simulation von Trading-Aktivität
  useEffect(() => {
    const interval = setInterval(() => {
      // Erstellt subtile zufällige Variationen für jeden Punkt, um das Chart zu animieren
      const newData = chartData.map(point => {
        const variance = (Math.random() - 0.5) * 2; // Zufälliger Wert zwischen -1 und 1
        return {
          ...point,
          y: Math.max(5, Math.min(40, point.y + variance)) // Innerhalb vernünftiger Grenzen halten
        };
      });
      
      setChartData(newData);
    }, 500);
    
    return () => clearInterval(interval);
  }, [chartData]);

  return (
    <motion.div
      className="md:col-span-2 relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {/* Modernes Chart-Grafik mit dünneren Linien und mehr Transparenz */}
      <div className="relative backdrop-blur-md border border-[#9b87f5]/20 rounded-xl p-6 shadow-lg shadow-[#9b87f5]/5 bg-black/20">
        {/* Akzent-Elemente */}
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
        
        {/* Aktualisierte Chart mit animiertem Pfad */}
        <div className="h-60 w-full relative">
          <svg width="100%" height="100%" viewBox="0 0 100 50" className="overflow-visible">
            {/* Gitterlinien */}
            <g className="grid-lines">
              {[0, 10, 20, 30, 40, 50].map((line) => (
                <line 
                  key={`h-${line}`} 
                  x1="0" 
                  y1={line} 
                  x2="100" 
                  y2={line} 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="0.3"
                />
              ))}
              {[0, 20, 40, 60, 80, 100].map((line) => (
                <line 
                  key={`v-${line}`} 
                  x1={line} 
                  y1="0" 
                  x2={line} 
                  y2="50" 
                  stroke="rgba(255,255,255,0.03)" 
                  strokeWidth="0.3"
                />
              ))}
            </g>
            
            {/* Animierte Diagrammlinie, die mit chartData aktualisiert wird */}
            <motion.path
              d={`M${chartData.map(point => `${point.x},${point.y}`).join(' L')}`}
              fill="none"
              stroke="url(#line-gradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
              animate={{ d: `M${chartData.map(point => `${point.x},${point.y}`).join(' L')}` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            
            {/* Animierter Farbverlaufsbereich unter der Diagrammlinie */}
            <motion.path
              d={`M${chartData[0].x},${chartData[0].y} L${chartData.map(point => `${point.x},${point.y}`).join(' L')} L${chartData[chartData.length-1].x},50 L${chartData[0].x},50 Z`}
              fill="url(#area-gradient)"
              opacity="0.15"
              animate={{ d: `M${chartData[0].x},${chartData[0].y} L${chartData.map(point => `${point.x},${point.y}`).join(' L')} L${chartData[chartData.length-1].x},50 L${chartData[0].x},50 Z` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            
            {/* Verbesserte Farbverläufe */}
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="50%" stopColor="#9b87f5" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9b87f5" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#9b87f5" stopOpacity="0.2" />
                <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Verbesserter leuchtender Linieneffekt */}
          <motion.div 
            className="absolute top-12 left-1/2 w-20 h-0.5 bg-[#9b87f5]/30 blur-md"
            animate={{ 
              opacity: [0.3, 0.8, 0.3],
              width: ["50%", "60%", "50%"]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          ></motion.div>
          
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Statistiken unter dem Diagramm mit aktualisiertem Styling */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0 }}
            className="text-center p-2 bg-white/5 rounded-md border border-[#9b87f5]/10"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(155,135,245,0.3)" }}
          >
            <p className="text-xs text-gray-400">24h Gewinn</p>
            <p className="text-lg font-semibold text-green-400">+2.4%</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2 }}
            className="text-center p-2 bg-white/5 rounded-md border border-gold/10"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,215,0,0.3)" }}
          >
            <p className="text-xs text-gray-400">Erfolgsrate</p>
            <p className="text-lg font-semibold text-gold">87%</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4 }}
            className="text-center p-2 bg-white/5 rounded-md border border-[#9b87f5]/10"
            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(155,135,245,0.3)" }}
          >
            <p className="text-xs text-gray-400">Monatlich</p>
            <p className="text-lg font-semibold text-green-400">+15.2%</p>
          </motion.div>
        </div>

        {/* Animierter Randeffekt */}
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
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 100%", backgroundPosition: "100% 0%" }}
            />
          </div>
        </div>
      </div>
      
      {/* Additional floating animated elements around chart */}
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
