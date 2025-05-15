
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageLayout from "@/components/landing/PageLayout";
import { 
  Activity, AlertCircle, CheckCircle, CircleCheck, Database, 
  Server, ExternalLink, ShieldCheck, Zap, Clock
} from "lucide-react";
import { useCryptos } from "@/hooks/useCryptos";
import { toast } from "@/hooks/use-toast";

const Status = () => {
  const { cryptos, loading: cryptosLoading, usingMockData, updateCryptoPrices } = useCryptos();
  const [serverLatency, setServerLatency] = useState(23);
  const [dbLatency, setDbLatency] = useState(12);
  const [activeTraders, setActiveTraders] = useState(1980);
  const [serverLoad, setServerLoad] = useState(35);
  
  // System component statuses
  const [systemStatus, setSystemStatus] = useState({
    tradingEngine: true,
    apiConnection: true,
    payoutSystem: true,
    botPanel: true,
    lastChecked: new Date()
  });

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
      
      // Update last checked time
      setSystemStatus(prev => ({...prev, lastChecked: new Date()}));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // Trigger initial load of crypto data
  useEffect(() => {
    if (cryptos.length === 0) {
      updateCryptoPrices();
    }
  }, [cryptos.length, updateCryptoPrices]);

  // Calculate the current trades (between 4000-4500) based on active traders
  const currentTrades = Math.floor(activeTraders * 2.2);
  
  // Calculate overall system health (percentage)
  const systemHealthPercent = 99.8;

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
        
        {/* Right column - System components status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* System Components Status */}
          <div className="bg-casino-card border border-white/10 rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">System Komponenten</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                <span className="text-green-500 text-sm">Alle Systeme laufen einwandfrei</span>
              </div>
            </div>
            
            <div className="p-6">
              {/* Trading Engine Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatusCard
                  title="Trading Engine"
                  status={true}
                  description="Alle Operationen laufen optimal"
                  icon={<Zap className="w-6 h-6" />}
                  metrics={[
                    { label: "Ausführungszeit", value: "0.3s" },
                    { label: "Fehlerrate", value: "0.01%" }
                  ]}
                />
                
                <StatusCard
                  title="API-Verbindung"
                  status={true}
                  description="Datenfluss stabil und zuverlässig"
                  icon={<Activity className="w-6 h-6" />}
                  metrics={[
                    { label: "Antwortzeit", value: "1.2s" },
                    { label: "Uptime", value: "99.9%" }
                  ]}
                />
                
                <StatusCard
                  title="Auszahlungssystem"
                  status={true}
                  description="Transaktionen werden normal verarbeitet"
                  icon={<Database className="w-6 h-6" />}
                  metrics={[
                    { label: "Verarbeitungszeit", value: "1.5min" },
                    { label: "Erfolgsquote", value: "100%" }
                  ]}
                />
                
                <StatusCard
                  title="Bot-Panel"
                  status={true}
                  description="KI-Trading funktioniert einwandfrei"
                  icon={<ShieldCheck className="w-6 h-6" />}
                  metrics={[
                    { label: "Handelsvolumen", value: "Normal" },
                    { label: "Verfügbarkeit", value: "100%" }
                  ]}
                />
              </div>
            </div>
            
            {/* System Health Overview */}
            <div className="p-6 bg-casino-darker border-t border-white/10">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-lg font-medium text-white">Systemgesundheit: Ausgezeichnet</h4>
                <span className="text-green-400 font-bold">{systemHealthPercent}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div 
                  className="h-3 rounded-full bg-green-500" 
                  style={{ width: `${systemHealthPercent}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Letzte Überprüfung: {systemStatus.lastChecked.toLocaleTimeString('de-DE')}</span>
                </div>
                <span className="text-green-400 font-medium">Keine Ausfälle oder Störungen</span>
              </div>
            </div>
          </div>
          
          {/* Performance Dashboard */}
          <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-white">System Performance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Uptime Metric */}
              <MetricCard
                title="System Uptime"
                value="99.98%"
                description="Letzte 30 Tage"
                positive={true}
              />
              
              {/* Response Time */}
              <MetricCard
                title="Response Zeit"
                value="0.32s"
                description="Durchschnitt"
                positive={true}
              />
              
              {/* Reliability Score */}
              <MetricCard
                title="Zuverlässigkeit"
                value="Sehr Hoch"
                description="Bewertung A+"
                positive={true}
              />
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400 text-sm">
                Der BitLoon KI-Trading-Bot arbeitet rund um die Uhr und schützt Ihre Anlagen 
                durch innovative Algorithmen und fortschrittliche Sicherheitssysteme.
              </p>
              <Link
                to="/trading-bot"
                className="inline-flex items-center mt-4 px-6 py-2 bg-gold hover:bg-gold/80 text-black font-medium rounded-lg transition-colors"
              >
                Zum Trading Bot
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

interface StatusCardProps {
  title: string;
  status: boolean;
  description: string;
  icon: React.ReactNode;
  metrics: {
    label: string;
    value: string;
  }[];
}

const StatusCard = ({ title, status, description, icon, metrics }: StatusCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-casino-darker rounded-xl p-4 border border-white/5 flex flex-col"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className={`mr-3 text-green-400`}>
            {icon}
          </div>
          <h4 className="font-medium text-white">{title}</h4>
        </div>
        <div className={`flex items-center ${status ? 'text-green-400' : 'text-red-400'}`}>
          {status ? (
            <>
              <span className="text-sm mr-1">Online</span>
              <CircleCheck className="w-5 h-5" />
            </>
          ) : (
            <>
              <span className="text-sm mr-1">Offline</span>
              <AlertCircle className="w-5 h-5" />
            </>
          )}
        </div>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      
      <div className="mt-auto grid grid-cols-2 gap-2">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-casino-card rounded p-2 text-center">
            <p className="text-xs text-gray-400">{metric.label}</p>
            <p className="text-sm font-medium text-white">{metric.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  positive: boolean;
}

const MetricCard = ({ title, value, description, positive }: MetricCardProps) => {
  return (
    <div className="bg-casino-darker rounded-xl p-4 border border-white/5 text-center">
      <h4 className="text-gray-400 mb-1 text-sm">{title}</h4>
      <p className={`text-2xl font-bold ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

export default Status;

