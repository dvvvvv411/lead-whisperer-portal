
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Bitcoin, Bot, Star, Sparkles } from "lucide-react";
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
    <section id="hero" className="py-20 px-4 relative overflow-hidden">
      {/* Modern gradient background with more transparency */}
      <div className="absolute inset-0 bg-gradient-to-b from-casino-darker/80 via-[#0A0B0C]/70 to-black/60 z-0"></div>
      
      {/* Subtle animated grid pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated gold particles with more animation */}
        <motion.div 
          className="absolute top-20 left-1/4 w-1 h-1 rounded-full bg-gold"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-40 left-1/3 w-1 h-1 rounded-full bg-gold/50"
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.8, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div 
          className="absolute bottom-40 right-1/3 w-1 h-1 rounded-full bg-gold/30"
          animate={{ 
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.6, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div 
          className="absolute top-60 right-1/4 w-1 h-1 rounded-full bg-gold/40"
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.7, 1]
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        
        {/* Lilac glowing orbs */}
        <div className="absolute top-1/4 left-1/5 w-60 h-60 bg-[#9b87f5]/5 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/5 w-60 h-60 bg-[#8B5CF6]/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-2/3 left-1/3 w-40 h-40 bg-[#7E69AB]/5 rounded-full filter blur-2xl animate-pulse" style={{ animationDelay: "2s" }}></div>
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
            {/* Modern chart graphic with thinner lines and more transparency */}
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
              
              {/* Modern chart with thinner lines */}
              <div className="h-60 w-full relative">
                <svg width="100%" height="100%" viewBox="0 0 100 50" className="overflow-visible">
                  {/* Thinner grid lines */}
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
                  
                  {/* Chart line - thinner and with enhanced gradient */}
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                    d="M0,35 Q10,32 15,30 T30,25 T45,20 T60,15 T75,10 T100,15"
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                  />
                  
                  {/* Gradient area under line with more transparency */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    d="M0,35 Q10,32 15,30 T30,25 T45,20 T60,15 T75,10 T100,15 L100,50 L0,50 Z"
                    fill="url(#area-gradient)"
                    opacity="0.15"
                  />
                  
                  {/* Animated data points */}
                  {[
                    {x: 0, y: 35, delay: 0.7},
                    {x: 15, y: 30, delay: 0.9},
                    {x: 30, y: 25, delay: 1.1},
                    {x: 45, y: 20, delay: 1.3},
                    {x: 60, y: 15, delay: 1.5},
                    {x: 75, y: 10, delay: 1.7},
                    {x: 100, y: 15, delay: 1.9}
                  ].map((point, i) => (
                    <motion.circle 
                      key={i}
                      initial={{ opacity: 0, r: 0 }}
                      animate={{ opacity: 1, r: 0.7 }}
                      transition={{ delay: point.delay, duration: 0.5 }}
                      cx={point.x} 
                      cy={point.y} 
                      fill="#FFD700"
                    >
                      <animate attributeName="r" values="0.7;1.2;0.7" dur="3s" repeatCount="indefinite" begin={`${i * 0.2}s`} />
                    </motion.circle>
                  ))}
                  
                  {/* Animated dot */}
                  <motion.circle 
                    cx={count} 
                    cy={35 - count/4} 
                    r="1.2" 
                    fill="#FFD700"
                  >
                    <animate attributeName="r" values="1.2;1.8;1.2" dur="2s" repeatCount="indefinite" />
                  </motion.circle>
                  
                  {/* Enhanced gradients */}
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
                
                {/* Improved glowing line effect */}
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
              
              {/* Stats below chart with updated styling */}
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

              {/* Animated border effect */}
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

            {/* Floating animated elements */}
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
            
            {/* Add new floating elements */}
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
