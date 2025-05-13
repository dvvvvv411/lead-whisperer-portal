
import { motion } from "framer-motion";
import { ShieldCheck, Lock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SecurityAssurance = () => {
  return (
    <div className="space-y-4 mt-6 mb-6">
      {/* Header section with shield icon */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-amber-500/30 rounded-full blur-md"
            animate={{ 
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <div className="bg-black/40 p-4 rounded-full relative border border-gold/30">
            <ShieldCheck className="h-10 w-10 text-gold" />
          </div>
        </div>
      </motion.div>
      
      {/* Main security message */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent mb-2">
          Sichere Einzahlungen
        </h3>
        <p className="text-white/70 text-sm">
          Ihre Einzahlungen sind durch modernste Verschlüsselung gesichert
        </p>
      </motion.div>
      
      {/* Security badges */}
      <motion.div 
        className="grid grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="bg-black/30 p-3 rounded-lg border border-gold/10 flex items-center">
          <div className="bg-gold/10 p-1.5 rounded-full mr-3">
            <Lock className="h-4 w-4 text-gold-light" />
          </div>
          <div>
            <p className="text-xs text-white/90 font-medium">SSL Verschlüsselt</p>
            <p className="text-xs text-white/60">256-Bit Sicherheit</p>
          </div>
        </div>
        
        <div className="bg-black/30 p-3 rounded-lg border border-gold/10 flex items-center">
          <div className="bg-gold/10 p-1.5 rounded-full mr-3">
            <CheckCircle className="h-4 w-4 text-gold-light" />
          </div>
          <div>
            <p className="text-xs text-white/90 font-medium">Verifiziert</p>
            <p className="text-xs text-white/60">Sichere Transaktionen</p>
          </div>
        </div>
      </motion.div>
      
      {/* Certification badges */}
      <motion.div 
        className="flex justify-center space-x-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Badge variant="outline" className="bg-black/40 border-gold/20 text-gold-light text-xs py-1 flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Geprüfte Sicherheit
        </Badge>
        <Badge variant="outline" className="bg-black/40 border-gold/20 text-gold-light text-xs py-1 flex items-center gap-1">
          <div className="w-2 h-2 bg-gold rounded-full"></div>
          100% Versichert
        </Badge>
      </motion.div>
      
      {/* Bottom note */}
      <div className="text-center text-xs text-white/50 mt-4">
        <p>Alle Transaktionen werden sicher verarbeitet und sind vollständig versichert.</p>
      </div>
    </div>
  );
};

export default SecurityAssurance;
