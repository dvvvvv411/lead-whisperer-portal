
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
    <section id="hero" className="py-24 px-4 relative overflow-hidden">
      {/* Modern gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-casino-darker via-[#0A0B0C] to-black z-0"></div>
      
      {/* Subtle animated grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Animated gold particles */}
        <div className="absolute top-20 left-1/4 w-1 h-1 rounded-full bg-gold animate-pulse"></div>
        <div className="absolute top-40 left-1/3 w-2 h-2 rounded-full bg-gold/50 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute bottom-40 right-1/3 w-1 h-1 rounded-full bg-gold/30 animate-pulse" style={{ animationDelay: "0.8s" }}></div>
        <div className="absolute top-60 right-1/4 w-2 h-2 rounded-full bg-gold/40 animate-pulse" style={{ animationDelay: "1.2s" }}></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/5 w-60 h-60 bg-purple-500/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/5 w-60 h-60 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div 
              className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
            >
              <span className="text-gold flex items-center gap-2 text-sm">
                <TrendingUp className="h-3.5 w-3.5" /> KI-gestütztes Trading
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Revolutioniere dein
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-gold to-yellow-300 bg-clip-text text-transparent animate-gradient-shift"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Krypto-Trading
              </motion.span>
              <motion.span 
                className="block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                mit KI-Technologie
              </motion.span>
            </motion.h1>
            
            <motion.p
              className="text-lg text-gray-300 mb-8 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Unser fortschrittlicher KI-Algorithmus analysiert Markttrends in Echtzeit und führt automatisch profitable Trades durch. Erziele bis zu 15% monatliche Rendite - vollständig automatisiert.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <Button 
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-gold hover:bg-gold/90 text-black font-medium text-base px-6 py-5 rounded-md shadow-lg shadow-gold/10 hover:shadow-gold/20 flex items-center gap-2 border border-transparent transition-all duration-300"
              >
                Jetzt starten <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
                variant="outline"
                className="border-gold/30 text-gold hover:bg-gold/5 text-base px-6 py-5 rounded-md transition-all duration-300"
              >
                Mehr erfahren
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            {/* Modern chart graphic with thin lines */}
            <div className="relative bg-gradient-to-br from-casino-card/80 to-casino-card rounded-xl p-6 backdrop-blur-md border border-white/5 shadow-lg shadow-black/20">
              {/* Accent elements */}
              <motion.div 
                className="absolute -top-3 -left-3 bg-black/40 p-3 rounded-lg border border-gold/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <Bitcoin className="h-5 w-5 text-gold" />
              </motion.div>
              
              <motion.div 
                className="absolute -top-3 -right-3 bg-black/40 p-3 rounded-lg border border-gold/20 backdrop-blur-sm"
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(255,215,0,0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <Bot className="h-5 w-5 text-gold" />
              </motion.div>
              
              <h3 className="text-lg font-medium text-white mb-4">Live Trading Performance</h3>
              
              {/* Modern chart with thin lines */}
              <div className="h-60 w-full relative">
                <svg width="100%" height="100%" viewBox="0 0 100 50" className="overflow-visible">
                  {/* Grid lines */}
                  <g className="grid-lines">
                    {[0, 10, 20, 30, 40, 50].map((line) => (
                      <line 
                        key={`h-${line}`} 
                        x1="0" 
                        y1={line} 
                        x2="100" 
                        y2={line} 
                        stroke="rgba(255,255,255,0.05)" 
                        strokeWidth="0.5"
                      />
                    ))}
                    {[0, 20, 40, 60, 80, 100].map((line) => (
                      <line 
                        key={`v-${line}`} 
                        x1={line} 
                        y1="0" 
                        x2={line} 
                        y2="50" 
                        stroke="rgba(255,255,255,0.05)" 
                        strokeWidth="0.5"
                      />
                    ))}
                  </g>
                  
                  {/* Chart line */}
                  <path
                    d="M0,35 Q10,30 20,28 T40,23 T60,18 T80,10 T100,15"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="1"
                  />
                  
                  {/* Gradient area under line */}
                  <path
                    d="M0,35 Q10,30 20,28 T40,23 T60,18 T80,10 T100,15 L100,50 L0,50 Z"
                    fill="url(#area-gradient)"
                    opacity="0.2"
                  />
                  
                  {/* Data points */}
                  {[
                    {x: 0, y: 35},
                    {x: 20, y: 28},
                    {x: 40, y: 23},
                    {x: 60, y: 18},
                    {x: 80, y: 10},
                    {x: 100, y: 15}
                  ].map((point, i) => (
                    <circle 
                      key={i} 
                      cx={point.x} 
                      cy={point.y} 
                      r="0.8" 
                      fill="#FFD700"
                    />
                  ))}
                  
                  {/* Animated dot */}
                  <circle 
                    cx={count} 
                    cy={35 - count/4} 
                    r="1.5" 
                    fill="#FFD700"
                  >
                    <animate attributeName="r" values="1.5;2.5;1.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Gradients */}
                  <defs>
                    <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFC107" />
                    </linearGradient>
                    <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="rgba(255, 215, 0, 0)" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Glowing line effect */}
                <div className="absolute top-12 left-1/2 w-20 h-1 bg-gold/20 blur-md animate-pulse"></div>
                
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-casino-card/80 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Stats below chart */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <motion.div 
                  className="text-center p-2 bg-white/5 rounded-md border border-white/5"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <p className="text-xs text-gray-400">24h Gewinn</p>
                  <p className="text-lg font-semibold text-green-400">+2.4%</p>
                </motion.div>
                
                <motion.div 
                  className="text-center p-2 bg-white/5 rounded-md border border-white/5"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <p className="text-xs text-gray-400">Erfolgsrate</p>
                  <p className="text-lg font-semibold text-gold">87%</p>
                </motion.div>
                
                <motion.div 
                  className="text-center p-2 bg-white/5 rounded-md border border-white/5"
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <p className="text-xs text-gray-400">Monatlich</p>
                  <p className="text-lg font-semibold text-green-400">+15.2%</p>
                </motion.div>
              </div>
            </div>

            {/* Floating gold elements */}
            <motion.div 
              className="absolute -bottom-2 right-12 w-12 h-12 bg-transparent border border-gold/30 rounded-full"
              animate={{ 
                y: [0, -10, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            <motion.div 
              className="absolute -bottom-4 right-4 w-4 h-4 bg-gold/10 rounded-full"
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.2, 0.5, 0.2] 
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            
            <motion.div 
              className="absolute -bottom-2 left-20 w-6 h-6 bg-transparent border border-gold/20 rounded-full"
              animate={{ 
                y: [0, -8, 0],
                opacity: [0.1, 0.4, 0.1] 
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
