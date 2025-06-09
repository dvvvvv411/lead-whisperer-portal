
import { motion } from "framer-motion";
import { Users, UserPlus, Gift, ArrowRight, Sparkles, Euro, Share2 } from "lucide-react";

const InviteFriendsVisualization = () => {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 rounded-full blur-xl"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-2">
            So funktioniert's
          </h2>
          <p className="text-gray-300 text-sm">
            In 3 einfachen Schritten zum Bonus
          </p>
        </motion.div>

        {/* Compact Process Flow */}
        <div className="space-y-4">
          {/* Step 1 - Share Code */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center bg-gradient-to-r from-casino-card/50 to-casino-dark/30 p-4 rounded-lg border border-gold/20"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-gold/30 to-gold/20 rounded-full flex items-center justify-center border border-gold/40 mr-4">
              <Share2 className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium text-sm">1. Code teilen</div>
              <div className="text-gray-400 text-xs">Sende deinen Code an Freunde</div>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-gold"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.div>

          {/* Step 2 - Friend Registers */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center bg-gradient-to-r from-casino-card/50 to-casino-dark/30 p-4 rounded-lg border border-blue-400/20"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/40 mr-4">
              <UserPlus className="h-6 w-6 text-blue-400" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-white font-medium text-sm">2. Freund registriert sich</div>
              <div className="text-gray-400 text-xs">Mit deinem Code + erste Einzahlung</div>
            </div>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="text-blue-400"
            >
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.div>

          {/* Step 3 - Both Get Rewards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-gradient-to-r from-green-500/20 to-gold/20 p-4 rounded-lg border border-gold/30"
          >
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-green-400/20 rounded-full flex items-center justify-center border border-green-400/40 mx-auto mb-2"
                >
                  <Gift className="h-6 w-6 text-green-400" />
                </motion.div>
                <div className="text-xs text-green-400 font-medium">Freund</div>
                <div className="text-lg font-bold text-green-400">50€</div>
              </div>

              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="mx-4"
              >
                <Sparkles className="h-6 w-6 text-gold" />
              </motion.div>

              <div className="text-center flex-1">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="w-12 h-12 bg-gradient-to-br from-gold/30 to-gold/20 rounded-full flex items-center justify-center border border-gold/40 mx-auto mb-2"
                >
                  <Users className="h-6 w-6 text-gold" />
                </motion.div>
                <div className="text-xs text-gold font-medium">Du</div>
                <div className="text-lg font-bold text-gold">50€</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Money Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -20, 0],
                x: [0, Math.sin(i) * 10, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3 + i * 0.5, 
                delay: i * 0.8 
              }}
              className={`absolute w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center
                ${i % 2 === 0 ? 'top-10 left-10' : i % 3 === 0 ? 'top-20 right-8' : 'bottom-16 left-16'}`}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 10)}%`
              }}
            >
              <Euro className="h-3 w-3 text-gold" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InviteFriendsVisualization;
