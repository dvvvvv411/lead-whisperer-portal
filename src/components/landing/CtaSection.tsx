
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BackgroundEffects from "./cta/BackgroundEffects";
import AccessCard from "./cta/AccessCard";
import StatsSection from "./cta/StatsSection";

const CtaSection = () => {
  const [availablePlaces, setAvailablePlaces] = useState(50);
  const [activeUsers, setActiveUsers] = useState(38);
  
  // Reduce available places over time
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (availablePlaces > 3) {
        setAvailablePlaces(prev => prev - 1);
      }
    }, 25000); // Reduce every 25 seconds
    
    return () => clearTimeout(timeout);
  }, [availablePlaces]);
  
  // Simulate active users fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      setActiveUsers(prev => Math.min(Math.max(prev + change, 35), 42));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handlePlacesChange = () => {
    // Placeholder for any additional logic when places change
  };

  return (
    <section id="cta" className="py-16 relative bg-[#0B0D0E] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black/30 to-transparent"></div>
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#12151E] to-transparent"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Animated gradients */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent1/5 rounded-full filter blur-3xl"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full filter blur-3xl"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Gold particles */}
        <motion.div 
          className="absolute top-20 right-1/3 w-1 h-1 rounded-full bg-gold/80"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/4 w-1 h-1 rounded-full bg-gold/60"
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.8, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AccessCard 
              availablePlaces={availablePlaces}
              activeUsers={activeUsers}
              onPlacesChange={handlePlacesChange}
            />
          </motion.div>
          
          {/* Right section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <StatsSection />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
