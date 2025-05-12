
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AlertCircle, Users, ArrowRight } from "lucide-react";

interface AccessCardProps {
  availablePlaces: number;
  activeUsers: number;
  onPlacesChange: () => void;
}

const AccessCard = ({ availablePlaces, activeUsers, onPlacesChange }: AccessCardProps) => {
  const controls = useAnimation();
  
  // Pulse animation when places change
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    });
    onPlacesChange();
  }, [availablePlaces, controls, onPlacesChange]);
  
  return (
    <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden h-full">
      {/* Enhanced glow effect */}
      <motion.div 
        className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-purple-500/20 rounded-xl blur opacity-30"
        animate={{
          opacity: [0.2, 0.4, 0.2],
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative h-full flex flex-col">
        {/* Title inside the left box */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            Limitierte Plätze verfügbar
          </span>
        </h2>
        <p className="text-gray-300 mb-6">
          Unser KI Trading Bot ist nur für 200 Neuanmeldungen täglich verfügbar, um optimale Performance für alle Nutzer zu gewährleisten.
        </p>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Exklusiver Zugang</h3>
          <div className="flex items-center text-green-500">
            <Users className="h-5 w-5 mr-2" />
            <span>über 20.000 aktive Nutzer</span>
          </div>
        </div>
        
        <div className="space-y-6 flex-grow">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Verfügbare Plätze:</span>
              <motion.span 
                animate={controls} 
                className="font-bold text-gold"
              >
                unter 20
              </motion.span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <motion.div 
                className="bg-gradient-to-r from-gold to-gold-light h-2.5 rounded-full"
                style={{ width: `${(19 / 200) * 100}%` }}
                animate={controls}
              ></motion.div>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/10">
            <AlertCircle className="text-gold shrink-0 mt-1" />
            <p className="text-sm text-gray-300">
              <span className="text-white font-medium">Wichtig:</span> Um die Qualität unserer KI-Prognosen und optimale Performance für alle Nutzer zu gewährleisten, begrenzen wir die täglichen Neuanmeldungen auf 200. Sobald alle Plätze vergeben sind, schließt die Registrierung für heute.
            </p>
          </div>
          
          <div className="mt-auto">
            {/* Enhanced animated button */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Button 
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="w-full bg-gold hover:bg-gold-light text-black text-lg py-6 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
                  Jetzt deinen Platz sichern
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                </span>
                
                {/* Enhanced shine effect animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{
                    x: ["120%", "-120%"],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessCard;
