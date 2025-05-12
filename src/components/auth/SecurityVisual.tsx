
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Key } from "lucide-react";

const SecurityVisual = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 bg-casino-dark border-r border-gold/10"
    >
      <div className="flex flex-col items-center justify-center h-full w-full">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="p-12 rounded-full bg-gradient-to-br from-gold/10 to-accent1/10 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse",
              duration: 8
            }}
          >
            <ShieldCheck className="h-24 w-24 text-gold" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-8 text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent"
        >
          Sichere Authentifizierung
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-4 text-gray-400 text-center max-w-sm"
        >
          Deine Daten sind bei uns sicher. Unser Anmeldesystem nutzt modernste Verschlüsselungstechnologie.
        </motion.p>
          
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-8 flex justify-center space-x-6"
        >
          <motion.div whileHover={{ scale: 1.1 }} className="p-3 bg-gold/10 rounded-full">
            <Lock className="h-5 w-5 text-gold" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="p-3 bg-accent1/10 rounded-full">
            <ShieldCheck className="h-5 w-5 text-accent1" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="p-3 bg-green-500/10 rounded-full">
            <Key className="h-5 w-5 text-green-400" />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecurityVisual;
