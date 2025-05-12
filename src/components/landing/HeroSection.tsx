import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Bitcoin, Bot, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const cryptoIcons = [
  {
    name: "Bitcoin",
    icon: <Bitcoin className="h-6 w-6 text-[#F7931A]" />,
    color: "from-[#F7931A]/30 to-[#F7931A]/5",
    delay: 0,
  },
  {
    name: "Ethereum",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="#627EEA">
        <path fillOpacity=".5" d="M16 4v8.8l7.2 3.2L16 4z" />
        <path fillOpacity=".5" d="M16 4L8.8 16l7.2-3.2V4z" />
        <path fillOpacity=".8" d="M16 21.7V28l7.2-10-7.2 3.7z" />
        <path fillOpacity=".8" d="M16 28v-6.3l-7.2-3.7L16 28z" />
        <path fillOpacity=".8" d="M16 20l7.2-4.2-7.2-3.2V20z" />
        <path fillOpacity=".8" d="M8.8 15.8L16 20v-7.4l-7.2 3.2z" />
      </svg>
    ),
    color: "from-[#627EEA]/30 to-[#627EEA]/5",
    delay: 2,
  },
  {
    name: "Ripple",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="16" cy="16" r="16" fill="#23292F" />
        <path d="M22.1 9.7c.6 0 1.1.2 1.5.6.4.3.6.8.6 1.4 0 .6-.2 1-.6 1.4-.4.4-.9.6-1.5.6s-1.1-.2-1.5-.6c-.4-.4-.6-.8-.6-1.4 0-.6.2-1 .6-1.4.4-.4.9-.6 1.5-.6zm-12.2 0c.6 0 1.1.2 1.5.6.4.3.6.8.6 1.4 0 .6-.2 1-.6 1.4-.4.4-.9.6-1.5.6s-1.1-.2-1.5-.6c-.4-.4-.6-.8-.6-1.4 0-.6.2-1 .6-1.4.4-.4.9-.6 1.5-.6zm6.1 3.2c.5 0 1 .1 1.4.4.4.3.6.7.6 1.1 0 .4-.2.8-.6 1.1-.4.3-.9.4-1.4.4-.5 0-1-.1-1.4-.4-.4-.3-.6-.7-.6-1.1 0-.4.2-.8.6-1.1.4-.3.9-.4 1.4-.4zm9.9 4.1c.4.4.5.9.5 1.5s-.1 1.1-.5 1.5c-.3.4-.8.6-1.3.6-.5 0-1-.2-1.3-.6-.4-.4-.5-.9-.5-1.5s.1-1.1.5-1.5c.3-.4.8-.6 1.3-.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6zM10 17c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6zm9.8 0c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6z" fill="#23292F" />
        <path fill="#fff" d="M17.1 12.9c.5 0 1 .1 1.4.4.4.3.6.7.6 1.1 0 .4-.2.8-.6 1.1-.4.3-.9.4-1.4.4-.5 0-1-.1-1.4-.4-.4-.3-.6-.7-.6-1.1 0-.4.2-.8.6-1.1.4-.3.9-.4 1.4-.4zm9.3 5.6c-.3.4-.8.6-1.3.6-.5 0-1-.2-1.3-.6-.3-.4-.5-.9-.5-1.4s.2-1 .5-1.4c.3-.4.8-.6 1.3-.6.5 0 1 .2 1.3.6.3.4.5.9.5 1.4s-.2 1-.5 1.4zM10 17c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6zm1-5.8c-.3.3-.4.7-.4 1.1 0 .4.1.8.4 1.1.3.3.6.4 1.1.4.4 0 .8-.1 1.1-.4.3-.3.4-.7.4-1.1 0-.4-.1-.8-.4-1.1-.3-.3-.6-.4-1.1-.4-.5.1-.8.2-1.1.4zm8.8 5.8c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6z" />
      </svg>
    ),
    color: "from-[#23292F]/30 to-[#23292F]/5",
    delay: 1.5,
  },
  {
    name: "Cardano",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="16" cy="16" r="16" fill="#0033AD" />
        <path d="M18.8 7.2a.9.9 0 11-1.8.1.9.9 0 011.8-.1zM21 8.4a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm2 1.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.7 1.8a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-8.3.1a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm1.7-3a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm5.3 6.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.2 2.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.8 2.4a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.2 2.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-.5 2.4a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1 2.3a.9.9 0 11-1.8.1.9.9 0 111.7-.1zm-1.6 2a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2 1.5a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.3 1a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.4.3a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.5-.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-2.3-1a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm-2-1.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1.6-2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1-2.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-.5-2.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.2-2.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.8-2.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.2-2.2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.7-2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm2-1.4a.9.9 0 11-1.7.1.9.9 0 111.8-.1zm-5.7 7.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm12.3 5.7a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm4.2-5.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-3-7.2a.9.9 0 11-1.7.2.9.9 0 111.8-.2zM13 17a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-2.4-5.2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm4.7-2.4a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-1.3 4.1a.9.9 0 11-1.7.1.9.9 0 111.7-.1zm2.4 2.2a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm2.5-2.4a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1.3-4a.9.9 0 11-1.7.1.9.9 0 111.7-.2zm4.8 2.5a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm-2.3 5.1a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-7.4 4.4a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm5 .1a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.5-2a.9.9 0 11-1.7.2.9.9 0 111.7-.2z" fill="#fff" />
      </svg>
    ),
    color: "from-[#0033AD]/30 to-[#0033AD]/5",
    delay: 3.5,
  },
  {
    name: "Litecoin",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="16" cy="16" r="16" fill="#BFBBBB" />
        <path fill="#fff" d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z" />
      </svg>
    ),
    color: "from-[#BFBBBB]/30 to-[#BFBBBB]/5",
    delay: 4,
  }
];

const HeroSection = () => {
  const [chartData, setChartData] = useState([
    {x: 0, y: 35},
    {x: 15, y: 30},
    {x: 30, y: 25},
    {x: 45, y: 20},
    {x: 60, y: 15},
    {x: 75, y: 10},
    {x: 100, y: 15}
  ]);

  // Animation for the chart to simulate trading activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Create subtle random variations for each point to animate the chart
      const newData = chartData.map(point => {
        const variance = (Math.random() - 0.5) * 2; // Random value between -1 and 1
        return {
          ...point,
          y: Math.max(5, Math.min(40, point.y + variance)) // Keep within reasonable bounds
        };
      });
      
      setChartData(newData);
    }, 500);
    
    return () => clearInterval(interval);
  }, [chartData]);

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
            
            <div className="mb-6">
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
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
                
                {/* Fixed gold animated text with horizontal gradient animation */}
                <motion.span 
                  className="block gold-gradient-text relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  style={{
                    backgroundImage: "linear-gradient(90deg, #FFD700, #FEC6A1, #FFD700)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                    animation: "goldGradientShift 3s linear infinite"
                  }}
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
            </div>
            
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
              {/* Enhanced CTA button with stronger pulse and glow effect */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 rounded-md bg-gold/30"
                  animate={{ 
                    boxShadow: ["0 0 0px rgba(255, 215, 0, 0)", "0 0 20px rgba(255, 215, 0, 0.7)", "0 0 0px rgba(255, 215, 0, 0)"]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut" 
                  }}
                />
                <Button 
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gold hover:bg-gold/90 text-black font-medium text-base px-6 py-5 rounded-md shadow-lg border border-transparent transition-all duration-300 relative z-10"
                >
                  <motion.span
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="flex items-center gap-2"
                  >
                    Jetzt starten <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Button>
              </motion.div>
              
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
            className="md:col-span-2 relative"
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
              
              {/* Updated chart with animated path */}
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
                  
                  {/* Animated chart line that updates with chartData */}
                  <motion.path
                    d={`M${chartData.map(point => `${point.x},${point.y}`).join(' L')}`}
                    fill="none"
                    stroke="url(#line-gradient)"
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    animate={{ d: `M${chartData.map(point => `${point.x},${point.y}`).join(' L')}` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  
                  {/* Animated gradient area under chart line */}
                  <motion.path
                    d={`M${chartData[0].x},${chartData[0].y} L${chartData.map(point => `${point.x},${point.y}`).join(' L')} L${chartData[chartData.length-1].x},50 L${chartData[0].x},50 Z`}
                    fill="url(#area-gradient)"
                    opacity="0.15"
                    animate={{ d: `M${chartData[0].x},${chartData[0].y} L${chartData.map(point => `${point.x},${point.y}`).join(' L')} L${chartData[chartData.length-1].x},50 L${chartData[0].x},50 Z` }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                  
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

            {/* Animated Cryptocurrency bubbles around chart only */}
            {cryptoIcons.map((crypto, index) => (
              <motion.div
                key={crypto.name}
                className={`absolute z-10 rounded-full bg-gradient-to-r ${crypto.color} p-3 backdrop-blur-sm border border-white/10 shadow-lg`}
                initial={{ 
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: [0, 10 * (index % 2 === 0 ? 1 : -1), 0],
                  y: [0, 15 * (index % 3 === 0 ? 1 : -1), 0],
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  delay: 1 + crypto.delay * 0.3,
                  duration: 3 + index,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: "easeInOut"
                }}
                style={{
                  // Position bubbles only around the chart
                  top: `${(index * 20 + 10) % 100}%`,
                  left: index % 2 === 0 
                    ? `${index < 2 ? -10 : 105}%` 
                    : `${index < 3 ? 105 : -10}%`,
                }}
                whileHover={{
                  scale: 1.2,
                  boxShadow: "0 0 15px rgba(155,135,245,0.5)"
                }}
              >
                {crypto.icon}
              </motion.div>
            ))}

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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
