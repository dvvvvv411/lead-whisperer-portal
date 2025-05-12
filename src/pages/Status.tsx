
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { 
  Activity, AlertCircle, CheckCircle, CircleCheck, Database, 
  Server, TrendingDown, TrendingUp, XCircle
} from "lucide-react";

const Status = () => {
  const [serverLatency, setServerLatency] = useState(23);
  const [dbLatency, setDbLatency] = useState(12);
  const [activeTraders, setActiveTraders] = useState(78);
  const [lastTrades, setLastTrades] = useState([]);
  const [serverLoad, setServerLoad] = useState(35);

  // Simulate changing statistics
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly vary latency
      setServerLatency(prev => Math.max(15, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))));
      setDbLatency(prev => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))));
      
      // Vary active traders
      setActiveTraders(prev => Math.max(60, Math.min(120, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))));
      
      // Vary server load
      setServerLoad(prev => Math.max(20, Math.min(75, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Generate simulated trades
  useEffect(() => {
    const generateTrade = () => {
      const cryptos = ["BTC", "ETH", "SOL", "ADA", "DOT", "MATIC", "AVAX"];
      const isProfit = Math.random() > 0.2; // 80% chance of profit to match 80% success rate
      const amount = (1000 + Math.random() * 4000).toFixed(2);
      const percentChange = (1 + Math.random() * 6).toFixed(2);
      const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
      
      return {
        id: Date.now() + Math.random(),
        crypto,
        amount: `€${amount}`,
        change: isProfit ? `+${percentChange}%` : `-${percentChange}%`,
        isProfit,
        timestamp: new Date().toISOString(),
      };
    };
    
    const addTradeInterval = setInterval(() => {
      setLastTrades(prev => {
        const newTrade = generateTrade();
        const updated = [newTrade, ...prev];
        return updated.slice(0, 10); // Keep only last 10 trades
      });
    }, 3000);
    
    // Initial trades
    setLastTrades([
      generateTrade(),
      generateTrade(),
      generateTrade(),
      generateTrade(),
      generateTrade()
    ]);
    
    return () => clearInterval(addTradeInterval);
  }, []);

  return (
    <PageLayout 
      title="System Status" 
      description="Überwachen Sie den Status und die Performance unseres KI-Trading-Systems in Echtzeit"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - System stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">System Status</h3>
            <div className="space-y-4">
              {/* Server status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Server className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-200">Server (Frankfurt)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">Online</span>
                  <CircleCheck className="w-5 h-5 text-green-400" />
                </div>
              </div>
              
              {/* Server latency */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-200">Latenz</span>
                </div>
                <div className="flex items-center">
                  <span className={`${serverLatency < 30 ? "text-green-400" : "text-yellow-400"} mr-2`}>
                    {serverLatency} ms
                  </span>
                  {serverLatency < 30 ? (
                    <CircleCheck className="w-5 h-5 text-green-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
              </div>
              
              {/* Database status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-200">Datenbank</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">Optimal</span>
                  <CircleCheck className="w-5 h-5 text-green-400" />
                </div>
              </div>
              
              {/* Database latency */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-200">DB Latenz</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">{dbLatency} ms</span>
                  <CircleCheck className="w-5 h-5 text-green-400" />
                </div>
              </div>
              
              {/* Server Load */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Serverauslastung</span>
                  <span className="text-gray-300">{serverLoad}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      serverLoad < 50 ? "bg-green-500" : serverLoad < 80 ? "bg-yellow-500" : "bg-red-500"
                    }`} 
                    style={{ width: `${serverLoad}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Aktivität</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Aktive Trader</span>
                <span className="text-green-400 font-bold">{activeTraders}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Aktuelle Trades</span>
                <span className="text-green-400 font-bold">{Math.floor(activeTraders * 1.6)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Erfolgsrate (24h)</span>
                <span className="text-green-400 font-bold">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Performance</span>
                <div className="flex items-center">
                  <span className="text-green-400 font-bold mr-1">Optimal</span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right column - Live activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Simulated trade chart */}
          <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg h-64">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Live Trading Aktivität</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span className="text-green-500 text-sm">Live</span>
              </div>
            </div>
            
            {/* Simplified chart simulation */}
            <div className="w-full h-40 flex items-end justify-between relative">
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
                <div className="border-b border-white/10"></div>
              </div>
              
              {/* Simulated bars */}
              {Array.from({ length: 24 }).map((_, i) => {
                const height = 20 + Math.random() * 80;
                const isGreen = Math.random() > 0.2;
                
                return (
                  <div 
                    key={i} 
                    className={`w-2 ${isGreen ? "bg-green-500" : "bg-red-500"} relative z-10`}
                    style={{ height: `${height}%` }}
                  ></div>
                );
              })}
            </div>
          </div>
          
          {/* Recent trades */}
          <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Letzte Trades</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span className="text-green-500 text-sm">Live</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {lastTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-none">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                      {trade.crypto.substring(0, 1)}
                    </div>
                    <div>
                      <span className="text-white font-medium">{trade.crypto}/EUR</span>
                      <p className="text-gray-400 text-sm">
                        {new Date(trade.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-right mr-3">
                      <span className="text-white font-medium">{trade.amount}</span>
                      <p className={`text-sm ${trade.isProfit ? "text-green-400" : "text-red-400"}`}>
                        {trade.change}
                      </p>
                    </div>
                    {trade.isProfit ? (
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Status;
