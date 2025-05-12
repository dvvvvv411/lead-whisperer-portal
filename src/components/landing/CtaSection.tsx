
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
    // This is extracted from the original component where the controls.start was called
  };

  return (
    <section id="cta" className="py-16 relative bg-casino-dark overflow-hidden">
      <BackgroundEffects />
      
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
