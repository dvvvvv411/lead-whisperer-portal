import { motion, useAnimation } from "framer-motion";
import { useState, useEffect } from "react";
import ContactForm from "@/components/ContactForm";
import { Bitcoin, TrendingUp, CircleCheck, ShieldCheck } from "lucide-react";
import BackgroundEffects from "./contact/BackgroundEffects";

const ContactSection = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [tradingState, setTradingState] = useState(0);
  const cryptoBoxControls = useAnimation();
  
  // Simuliere den Handelsprozess
  useEffect(() => {
    const interval = setInterval(() => {
      setTradingState((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animiere die Krypto-Box basierend auf dem Trading-Status
  useEffect(() => {
    const animateBox = async () => {
      if (tradingState === 1) {
        await cryptoBoxControls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 0.5 }
        });
      } else if (tradingState === 3) {
        await cryptoBoxControls.start({
          y: [0, -10, 0],
          transition: { duration: 0.7 }
        });
      }
    };
    
    animateBox();
  }, [tradingState, cryptoBoxControls]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  // Trading status message based on state
  const getTradingStatusMessage = () => {
    switch(tradingState) {
      case 0: return "Analysiere Marktdaten...";
      case 1: return "Gelegenheit erkannt!";
      case 2: return "Führe Trade aus...";
      case 3: return "Gewinn realisiert! +3.2%";
      default: return "KI-Bot aktiv";
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-casino-darker">
      {/* Background elements */}
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Der KI-Bot handelt für dich
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Unser KI-Trading Bot analysiert den Markt rund um die Uhr und führt automatisch gewinnbringende Trades für dich durch.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Trading Bot Animation Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <motion.div
              style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-gradient-to-br from-casino-card to-black border border-white/10 rounded-xl p-6 shadow-lg shadow-black/40 relative overflow-hidden h-full"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-accent1/20 rounded-xl blur opacity-20"></div>
              
              <div className="relative">
                {/* Bot Status Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <h3 className="text-xl font-bold text-white">KI-Trading Bot</h3>
                  </div>
                  <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-md">
                    Live Demo
                  </div>
                </div>
                
                {/* Bot Interface */}
                <div className="space-y-6">
                  {/* Trading Status Display */}
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Status:</span>
                      <span className="text-green-400 animate-pulse font-medium">Aktiv</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className={`w-2 h-2 rounded-full ${tradingState === 3 ? 'bg-green-500' : 'bg-blue-500'} mr-2 animate-pulse`}></div>
                      <span className="text-white text-sm">{getTradingStatusMessage()}</span>
                    </div>
                    <div className="mt-3 bg-black/30 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-gold to-amber-500"
                        animate={{ width: ['25%', '50%', '75%', '100%', '25%'] }}
                        transition={{ 
                          repeat: Infinity, 
                          duration: 12,
                          times: [0, 0.25, 0.5, 0.75, 1],
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Trading Simulation */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Crypto Card 1 */}
                    <motion.div 
                      className="bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden"
                      animate={cryptoBoxControls}
                    >
                      <div className="absolute top-0 right-0 p-1 bg-black/50 text-xs text-green-400 rounded-bl">
                        +2.4%
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#F7931A]/10 flex items-center justify-center mr-2">
                          <Bitcoin className="h-5 w-5 text-[#F7931A]" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Bitcoin</p>
                          <p className="text-xs text-gray-400">BTC</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Wert:</span>
                          <span className="text-sm text-white font-medium">€42.685</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">24h:</span>
                          <span className="text-xs text-green-400">+€986</span>
                        </div>
                      </div>
                      
                      {/* Simplified chart */}
                      <div className="mt-2 h-10 relative">
                        <svg width="100%" height="100%" viewBox="0 0 100 30">
                          <path
                            d="M0,20 C10,18 15,10 25,12 C35,14 40,5 50,7 C60,9 65,15 75,13 C85,11 90,5 100,3"
                            fill="none"
                            stroke="#F7931A"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </motion.div>
                    
                    {/* Crypto Card 2 */}
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-1 bg-black/50 text-xs text-green-400 rounded-bl">
                        +3.8%
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#627EEA]/10 flex items-center justify-center mr-2">
                          {/* ETH Icon simplified */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="#627EEA">
                            <path fillOpacity=".5" d="M16 4v8.8l7.2 3.2L16 4z" />
                            <path fillOpacity=".5" d="M16 4L8.8 16l7.2-3.2V4z" />
                            <path fillOpacity=".8" d="M16 21.7V28l7.2-10-7.2 3.7z" />
                            <path fillOpacity=".8" d="M16 28v-6.3l-7.2-3.7L16 28z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white font-medium">Ethereum</p>
                          <p className="text-xs text-gray-400">ETH</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">Wert:</span>
                          <span className="text-sm text-white font-medium">€2.345</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-400">24h:</span>
                          <span className="text-xs text-green-400">+€89</span>
                        </div>
                      </div>
                      
                      {/* Simplified chart */}
                      <div className="mt-2 h-10 relative">
                        <svg width="100%" height="100%" viewBox="0 0 100 30">
                          <path
                            d="M0,15 C10,10 20,20 30,15 C40,10 50,18 60,13 C70,8 80,12 90,7 C95,4 100,3 100,3"
                            fill="none"
                            stroke="#627EEA"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trading Activity */}
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 text-gold mr-2" />
                      Letzte Aktivitäten
                    </h4>
                    <div className="space-y-2">
                      {[
                        { action: "Kauf", crypto: "ETH", amount: "0.214", time: "vor 2 Min", profit: null },
                        { action: "Verkauf", crypto: "BTC", amount: "0.008", time: "vor 15 Min", profit: "+3.2%" }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                          <div className="flex items-center">
                            <span className={`text-xs ${activity.action === "Kauf" ? "text-blue-400" : "text-green-400"} mr-2`}>{activity.action}</span>
                            <span className="text-white text-sm">{activity.crypto}</span>
                            <span className="text-gray-400 text-xs ml-2">{activity.amount}</span>
                          </div>
                          <div className="flex items-center">
                            {activity.profit && (
                              <span className="text-green-400 text-xs mr-2">{activity.profit}</span>
                            )}
                            <span className="text-gray-400 text-xs">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Key Benefits */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      { icon: <CircleCheck className="h-4 w-4 text-green-400" />, text: "Automatische Trades" },
                      { icon: <ShieldCheck className="h-4 w-4 text-blue-400" />, text: "Verlustschutz" },
                      { icon: <TrendingUp className="h-4 w-4 text-gold" />, text: "Profit-Maximierung" },
                      { icon: <Bitcoin className="h-4 w-4 text-amber-400" />, text: "Multi-Coin Support" },
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className="flex items-center bg-black/20 px-3 py-2 rounded-md"
                      >
                        <span className="mr-2">{item.icon}</span>
                        <span className="text-xs text-gray-300">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-br from-black to-casino-card backdrop-blur-md rounded-xl shadow-xl border border-white/5 p-6 h-full flex items-center"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
      
      {/* Top pattern */}
      <div className="absolute inset-x-0 top-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12">
          <path fill="#21283B" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ContactSection;
