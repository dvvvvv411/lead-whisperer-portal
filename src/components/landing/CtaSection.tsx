
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users } from "lucide-react";

const CtaSection = () => {
  const [availablePlaces, setAvailablePlaces] = useState(50);
  const [activeUsers, setActiveUsers] = useState(38);
  const controls = useAnimation();
  
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
  
  // Pulse animation when places change
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    });
  }, [availablePlaces, controls]);

  return (
    <section id="cta" className="py-16 relative bg-casino-dark overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-30"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Limitierte Plätze verfügbar
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Unser KI Trading Bot ist nur für eine begrenzte Anzahl von Nutzern verfügbar, um optimale Performance zu gewährleisten.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-purple-500/20 rounded-xl blur opacity-30"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Exklusiver Zugang</h3>
                  <div className="flex items-center text-green-500">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{activeUsers} aktive Nutzer</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-300">Verfügbare Plätze:</span>
                      <motion.span 
                        animate={controls} 
                        className="font-bold text-gold"
                      >
                        {availablePlaces}
                      </motion.span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2.5">
                      <motion.div 
                        className="bg-gradient-to-r from-gold to-gold-light h-2.5 rounded-full"
                        style={{ width: `${(availablePlaces / 50) * 100}%` }}
                        animate={controls}
                      ></motion.div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
                    <AlertCircle className="text-gold shrink-0 mt-1" />
                    <p className="text-sm text-gray-300">
                      <span className="text-white font-medium">Wichtig:</span> Um die Qualität unserer KI-Prognosen zu gewährleisten, begrenzen wir die Anzahl der Nutzer. Sobald alle Plätze vergeben sind, schließen wir die Registrierung.
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="w-full bg-gold hover:bg-gold-light text-black text-lg py-6"
                  >
                    Jetzt deinen Platz sichern
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="border-l-4 border-gold pl-4">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Warum wir limitieren</h3>
              <p className="text-gray-300">
                Unser KI-Algorithmus arbeitet am besten mit einer begrenzten Anzahl von gleichzeitigen Nutzern, um optimale Renditen zu erzielen.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Durchschnittlicher Gewinn", value: "15.2%" },
                { title: "Erfolgsrate", value: "87%" },
                { title: "Trades pro Monat", value: "~120" },
                { title: "Minimale Einzahlung", value: "500€" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                  className="bg-casino-card border border-white/10 p-4 rounded-lg"
                >
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-green-400">
                <span className="font-bold">💰 ROI-Garantie:</span> Sollte der Bot im ersten Monat keine Gewinne erzielen, erstatten wir deine Servicegebühr zu 100% zurück.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
          <path 
            fill="#0B0D0E" 
            fillOpacity="1" 
            d="M0,64L60,58.7C120,53,240,43,360,48C480,53,600,75,720,80C840,85,960,75,1080,58.7C1200,43,1320,21,1380,10.7L1440,0L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default CtaSection;
