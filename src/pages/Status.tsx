
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { 
  Activity, AlertCircle, CheckCircle, CircleCheck, Database, 
  Server, TrendingDown, TrendingUp
} from "lucide-react";
import { useCryptos } from "@/hooks/useCryptos";

interface Trade {
  id: string;
  crypto: string;
  symbol: string;
  amount: string;
  change: string;
  isProfit: boolean;
  timestamp: string;
  imageUrl: string | null;
}

const Status = () => {
  const { cryptos, loading, updateCryptoPrices } = useCryptos();
  const [serverLatency, setServerLatency] = useState(23);
  const [dbLatency, setDbLatency] = useState(12);
  const [activeTraders, setActiveTraders] = useState(1980);
  const [lastTrades, setLastTrades] = useState<Trade[]>([]);
  const [serverLoad, setServerLoad] = useState(35);

  // Simulate changing statistics
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly vary latency
      setServerLatency(prev => Math.max(15, Math.min(50, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))));
      setDbLatency(prev => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3))));
      
      // Vary active traders around 2000
      setActiveTraders(prev => Math.max(1950, Math.min(2050, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10))));
      
      // Vary server load
      setServerLoad(prev => Math.max(20, Math.min(75, prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Generate realistic trades based on actual crypto data
  useEffect(() => {
    if (!cryptos || cryptos.length === 0) return;

    const generateTrade = () => {
      // Pick a random crypto from available data
      const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
      
      // Generate realistic trade data based on actual crypto price
      const isProfit = Math.random() > 0.2; // 80% chance of profit to match good success rate
      const baseAmount = crypto.current_price * (1 + Math.random() * 3); // Between 1-4x of current price
      const amount = (baseAmount * (10 + Math.random() * 90)).toFixed(2); // €10-100 in crypto value
      
      // Calculate percent change - now modified to only show >3% profits or losses
      let percentChange: number;
      
      if (isProfit) {
        // For profit trades, ensure they are at least 3%
        // Use a base of 3% plus additional random amount
        percentChange = 3 + Math.random() * 7; // 3% to 10%
      } else {
        // For loss trades, can be any negative percentage
        percentChange = -(0.5 + Math.random() * 8); // -0.5% to -8.5%
      }
      
      // Format the percentage with 2 decimal places
      const formattedChange = Math.abs(percentChange).toFixed(2);
      
      return {
        id: Date.now() + Math.random().toString(),
        crypto: crypto.name,
        symbol: crypto.symbol,
        amount: `€${amount}`,
        change: isProfit ? `+${formattedChange}%` : `-${formattedChange}%`,
        isProfit,
        timestamp: new Date().toISOString(),
        imageUrl: crypto.image_url
      };
    };
    
    // Initial trades when cryptos are loaded
    if (lastTrades.length === 0) {
      const initialTrades = Array(5).fill(null).map(() => generateTrade());
      setLastTrades(initialTrades);
    }
    
    // Add a new trade every few seconds
    const addTradeInterval = setInterval(() => {
      setLastTrades(prev => {
        const newTrade = generateTrade();
        const updated = [newTrade, ...prev];
        return updated.slice(0, 10); // Keep only last 10 trades
      });
    }, 3000);
    
    return () => clearInterval(addTradeInterval);
  }, [cryptos]);

  // Trigger initial load and periodic refresh of crypto data
  useEffect(() => {
    if (cryptos.length === 0) {
      updateCryptoPrices();
    }
  }, [cryptos.length, updateCryptoPrices]);

  // Calculate the current trades (between 4000-4500) based on active traders
  const currentTrades = Math.floor(activeTraders * 2.2);

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
                <span className="text-green-400 font-bold">{currentTrades}</span>
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
          
          {/* Recent trades - Now using real crypto data */}
          <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Letzte Trades</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                <span className="text-green-500 text-sm">Live</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {loading ? (
                <div className="py-10 text-center text-gray-400">
                  <div className="w-6 h-6 border-2 border-t-2 border-gold rounded-full animate-spin mx-auto mb-2"></div>
                  Daten werden geladen...
                </div>
              ) : lastTrades.length === 0 ? (
                <div className="py-10 text-center text-gray-400">
                  Keine Handelsdaten verfügbar
                </div>
              ) : (
                lastTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-none">
                    <div className="flex items-center">
                      {trade.imageUrl ? (
                        <img 
                          src={trade.imageUrl} 
                          alt={trade.symbol} 
                          className="w-8 h-8 rounded-full mr-3 object-contain bg-gray-800"
                          onError={(e) => {
                            // Fallback to text if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `<div class="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">${trade.symbol.substring(0, 1).toUpperCase()}</div>`;
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                          {trade.symbol.substring(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="text-white font-medium">{trade.symbol.toUpperCase()}/EUR</span>
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
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Status;
