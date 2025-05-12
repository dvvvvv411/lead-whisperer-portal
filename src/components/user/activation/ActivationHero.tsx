
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, DollarSign, LineChart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActivationHero = () => {
  const [profitCount, setProfitCount] = useState(0);
  
  // Animation für steigenden Gewinn
  useEffect(() => {
    const interval = setInterval(() => {
      if (profitCount < 2500) {
        setProfitCount(prev => Math.min(prev + 50, 2500));
      } else {
        clearInterval(interval);
        setTimeout(() => setProfitCount(0), 2000);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [profitCount]);

  return (
    <div className="px-6 py-8 md:p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-gold/20 relative overflow-hidden">
      {/* Hintergrund-Effekt */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/5 rounded-full blur-2xl" />
      
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
        <span className="gradient-text">Aktivieren</span> Sie Ihren KI-Trader
      </h2>

      <p className="text-gray-300 mb-6">
        Zahlen Sie einmalig 250€ ein und starten Sie mit professionellem KI-Trading
      </p>
      
      {/* Gewinn-Animation */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center py-4 mb-6"
      >
        <div className="text-center relative">
          <div className="absolute inset-0 bg-gold/10 blur-xl rounded-full" />
          <LineChart className="h-16 w-16 text-gold mb-2 mx-auto" />
          <div className="text-3xl font-bold text-white">+{profitCount.toLocaleString('de-DE')}€</div>
          <p className="text-gray-400 text-sm">Potenzielle KI-generierte Gewinne</p>
        </div>
      </motion.div>

      {/* Vorteile */}
      <div className="space-y-4 mb-6">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center"
        >
          <div className="mr-3 p-2 bg-gold/10 rounded-full">
            <Award className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-medium text-white">Fortgeschrittene KI-Handelsalgorithmen</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center"
        >
          <div className="mr-3 p-2 bg-gold/10 rounded-full">
            <TrendingUp className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-medium text-white">Echtzeit-Marktanalysen & Handelssignale</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center"
        >
          <div className="mr-3 p-2 bg-gold/10 rounded-full">
            <Users className="h-5 w-5 text-gold" />
          </div>
          <div>
            <p className="font-medium text-white">Exklusiver Zugang zur Trading-Community</p>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-4"
      >
        <Button 
          size="lg" 
          className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black font-bold"
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Jetzt 250€ einzahlen & profitieren
        </Button>
      </motion.div>
    </div>
  );
};

export default ActivationHero;
