
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/landing/PageLayout";
import { 
  Activity, AlertCircle, CheckCircle, CircleCheck, Database, 
  Server, ExternalLink
} from "lucide-react";
import { useCryptos } from "@/hooks/useCryptos";
import { toast } from "@/hooks/use-toast";
import LiveTradesDisplay from "@/components/status/LiveTradesDisplay";
import TradePerformance from "@/components/status/TradePerformance";

const Status = () => {
  const { cryptos, loading: cryptosLoading, usingMockData, updateCryptoPrices } = useCryptos();
  const [serverLatency, setServerLatency] = useState(23);
  const [dbLatency, setDbLatency] = useState(12);
  const [activeTraders, setActiveTraders] = useState(1980);
  const [serverLoad, setServerLoad] = useState(35);

  // Show a toast when using mock data
  useEffect(() => {
    if (usingMockData) {
      toast({
        title: "Demo-Modus",
        description: "Sie sehen Demowerte. Melden Sie sich an, um Echtdaten zu sehen.",
        variant: "default"
      });
    }
  }, [usingMockData]);

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
      {usingMockData && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 text-yellow-300 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Sie sehen Demo-Daten. Für Echtdaten melden Sie sich bitte an.</span>
          </div>
        </div>
      )}
      
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
              
              {/* Trading Bot Link */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <Link 
                  to="/trading-bot"
                  className="flex items-center justify-between text-gold hover:text-gold/80 transition-colors"
                >
                  <span>Trading Bot ausprobieren</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Right column - Live trades and performance */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Live trades section */}
          <LiveTradesDisplay />
          
          {/* Trade performance section */}
          <TradePerformance />
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Status;
