import { motion } from "framer-motion";
import { Shield, Zap, Trophy } from "lucide-react";

export const PayoutHeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-casino-darker via-casino-dark to-casino-darker rounded-2xl border border-gold/20 mb-8">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gold/5 to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          {/* Crown Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center shadow-2xl"
          >
            <Trophy className="w-10 h-10 text-black" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold via-yellow-400 to-gold bg-clip-text text-transparent"
          >
            Finale Auszahlung
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Ihre Trading-Reise war ein Erfolg! Bereiten Sie sich auf die finale Herausforderung vor,
            um Ihr gesamtes Guthaben freizuschalten.
          </motion.p>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center space-x-6 mt-8"
          >
            <div className="flex items-center space-x-2 bg-green-900/30 border border-green-500/30 rounded-full px-4 py-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Verified Trader</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-900/30 border border-blue-500/30 rounded-full px-4 py-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-medium">AI Partner</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};