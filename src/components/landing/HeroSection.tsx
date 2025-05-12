
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Bitcoin, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => (prevCount < 100 ? prevCount + 1 : prevCount));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="min-h-screen pt-24 pb-8 px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        
        {/* Grid lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="inline-block rounded-full bg-gold/20 px-4 py-1.5 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-gold flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> KI-gestütztes Trading
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className="block">Revolutioniere dein</span>
              <span className="bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent animate-gradient-shift">Krypto-Trading</span>
              <span className="block">mit KI-Technologie</span>
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Unser fortschrittlicher KI-Algorithmus analysiert Markttrends in Echtzeit und führt automatisch profitable Trades durch. Erziele bis zu 15% monatliche Rendite - vollständig automatisiert.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Button 
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-gold hover:bg-gold-light text-black font-medium text-lg px-6 py-6 rounded-lg shadow-gold/20 shadow-lg flex items-center gap-2"
              >
                Jetzt starten <ArrowRight className="h-5 w-5" />
              </Button>
              
              <Button 
                onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-gold/50 text-gold hover:bg-gold/10 text-lg px-6 py-6 rounded-lg"
              >
                Mehr erfahren
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Animated chart graphic */}
            <div className="relative bg-casino-card rounded-2xl p-6 shadow-lg shadow-purple-500/5 border border-white/5 backdrop-blur-sm">
              <div className="absolute -top-3 -left-3 bg-casino-darker p-3 rounded-lg border border-gold/20">
                <Bitcoin className="h-6 w-6 text-gold" />
              </div>
              
              <div className="absolute -top-3 -right-3 bg-casino-darker p-3 rounded-lg border border-gold/20">
                <Bot className="h-6 w-6 text-gold" />
              </div>
              
              <h3 className="text-xl font-bold text-gold mb-4">Live Trading Performance</h3>
              
              {/* Simulated chart */}
              <div className="h-60 w-full relative">
                <svg width="100%" height="100%" viewBox="0 0 100 50">
                  <path
                    d="M0,35 Q10,20 20,30 T40,25 T60,15 T80,5 T100,15"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Animated dots on the chart */}
                <div 
                  className="absolute top-1/4 left-0 h-2 w-2 rounded-full bg-gold animate-pulse"
                  style={{ left: `${count}%` }}
                />
                
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-gold/10 to-transparent" />
              </div>
              
              {/* Stats below chart */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-400">24h Gewinn</p>
                  <p className="text-lg font-bold text-green-500">+2.4%</p>
                </div>
                
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-400">Erfolgsrate</p>
                  <p className="text-lg font-bold text-gold">87%</p>
                </div>
                
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <p className="text-xs text-gray-400">Monatlich</p>
                  <p className="text-lg font-bold text-green-500">+15.2%</p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <motion.div
              className="absolute -top-6 -right-6 p-3 bg-casino-card rounded-lg shadow-lg shadow-purple-500/10 border border-white/10"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <TrendingUp className="h-6 w-6 text-green-500" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
