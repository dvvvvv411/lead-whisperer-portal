
import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CtaBanner = () => {
  const [availablePlaces, setAvailablePlaces] = useState(18);
  const controls = useAnimation();
  
  // Reduce available places over time for animation effect
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (availablePlaces > 2) {
        setAvailablePlaces(prev => prev - 1);
      }
    }, 30000); // Reduce every 30 seconds
    
    return () => clearTimeout(timeout);
  }, [availablePlaces]);

  // Pulse animation when places change
  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { duration: 0.5 }
    });
  }, [availablePlaces, controls]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
      className="mt-16 text-center"
    >
      <div className="p-6 bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg border border-gold/20 shadow-lg relative overflow-hidden">
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
        
        <div className="relative">
          <h3 className="text-xl font-bold text-gold mb-4">Jetzt mit KI Kryptohandel beginnen</h3>
          <p className="text-gray-300 mb-2">Sichern Sie sich jetzt ihren Zugang</p>
          
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Verfügbare Plätze:</span>
              <motion.span 
                animate={controls} 
                className="font-bold text-gold"
              >
                nur noch {availablePlaces}
              </motion.span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <motion.div 
                className="bg-gradient-to-r from-gold to-gold-light h-2.5 rounded-full"
                style={{ width: `${(availablePlaces / 200) * 100}%` }}
                animate={controls}
              ></motion.div>
            </div>
          </div>
          
          {/* Enhanced animated button */}
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="bg-gold hover:bg-gold-dark text-black font-bold py-3 px-8 rounded-lg shadow-lg shadow-gold/20 transition-all relative overflow-hidden group"
            onClick={() => window.location.href = '/#contact'}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Jetzt Zugang sichern
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
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CtaBanner;
