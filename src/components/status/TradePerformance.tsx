
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { usePublicTrades } from "@/hooks/usePublicTrades";

const TradePerformance = () => {
  const { trades } = usePublicTrades();
  const [stats, setStats] = useState({
    totalTrades: 0,
    successRate: 0,
    avgProfit: 0,
    avgLoss: 0,
    bestTrade: 0,
    worstTrade: 0
  });
  
  // Calculate statistics based on trades data
  useEffect(() => {
    if (trades.length > 0) {
      const successfulTrades = trades.filter(t => t.is_profit);
      const failedTrades = trades.filter(t => !t.is_profit);
      
      const successRate = (successfulTrades.length / trades.length) * 100;
      
      const profits = successfulTrades.map(t => t.change_percentage || 0);
      const losses = failedTrades.map(t => Math.abs(t.change_percentage || 0));
      
      const avgProfit = profits.length > 0 ? 
        profits.reduce((acc, val) => acc + val, 0) / profits.length : 0;
      
      const avgLoss = losses.length > 0 ? 
        losses.reduce((acc, val) => acc + val, 0) / losses.length : 0;
      
      const bestTrade = Math.max(...profits, 0);
      const worstTrade = Math.max(...losses, 0);
      
      setStats({
        totalTrades: trades.length,
        successRate: Math.min(Math.max(successRate, 0), 100),
        avgProfit,
        avgLoss,
        bestTrade,
        worstTrade
      });
    }
  }, [trades]);

  // For the gauge chart
  const gaugeValue = stats.successRate;
  const gaugeAngle = (gaugeValue / 100) * 180;

  return (
    <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Trade Performance</h3>
        <PieChart className="w-5 h-5 text-gold" />
      </div>
      
      {/* Success Rate Gauge */}
      <div className="relative h-32 mb-4">
        <div className="absolute inset-x-0 bottom-0 h-[100px] flex items-center justify-center">
          <div className="relative w-[200px] h-[100px] overflow-hidden">
            {/* Background semicircle */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-t-full"></div>
            
            {/* Gauge indicator */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: gaugeAngle }}
              transition={{ duration: 1, type: "spring" }}
              style={{ transformOrigin: "bottom center" }}
              className="absolute bottom-0 left-1/2 w-1 h-[95px] bg-white -translate-x-1/2"
            >
              <div className="w-3 h-3 absolute -top-1 -translate-x-1/3 rounded-full bg-white"></div>
            </motion.div>
            
            {/* Center point */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
        
        {/* Percentage text */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-bold text-white"
          >
            {Math.round(stats.successRate)}%
          </motion.span>
          <p className="text-sm text-gray-400">Erfolgsquote</p>
        </div>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <StatCard 
          title="Durchschn. Gewinn" 
          value={`+${stats.avgProfit.toFixed(2)}%`} 
          icon={<TrendingUp className="w-4 h-4" />} 
          positive={true}
        />
        
        <StatCard 
          title="Durchschn. Verlust" 
          value={`-${stats.avgLoss.toFixed(2)}%`} 
          icon={<TrendingDown className="w-4 h-4" />} 
          positive={false}
        />
        
        <StatCard 
          title="Bester Trade" 
          value={`+${stats.bestTrade.toFixed(2)}%`} 
          icon={<ArrowUpRight className="w-4 h-4" />} 
          positive={true}
        />
        
        <StatCard 
          title="Handelszahl" 
          value={stats.totalTrades.toString()} 
          icon={<PieChart className="w-4 h-4" />} 
          positive={null}
        />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  positive: boolean | null;
}

const StatCard = ({ title, value, icon, positive }: StatCardProps) => {
  let textColorClass = "text-white";
  if (positive === true) textColorClass = "text-green-400";
  if (positive === false) textColorClass = "text-red-400";
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-casino-darker rounded-lg p-4 border border-white/5"
    >
      <p className="text-xs text-gray-400 mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <span className={`text-lg font-bold ${textColorClass}`}>{value}</span>
        <div className={`${positive === true ? "text-green-400" : positive === false ? "text-red-400" : "text-gray-400"}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default TradePerformance;
