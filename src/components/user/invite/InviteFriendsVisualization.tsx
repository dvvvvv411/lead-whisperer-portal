
import { motion } from "framer-motion";
import { Users, UserPlus, Gift, ArrowRight, Sparkles } from "lucide-react";

const InviteFriendsVisualization = () => {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gold/10 rounded-full blur-xl"></div>
      
      {/* Main Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent mb-4">
            Freunde einladen & Verdienen
          </h2>
          <p className="text-gray-300 text-lg">
            Teile deine Erfolgsgeschichte und verdiene dabei
          </p>
        </motion.div>

        {/* Animation Sequence */}
        <div className="space-y-8">
          {/* Step 1 - You */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center"
          >
            <div className="bg-gradient-to-br from-gold/20 to-gold/10 p-6 rounded-full border border-gold/30">
              <Users className="h-12 w-12 text-gold" />
            </div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center"
          >
            <ArrowRight className="h-6 w-6 text-gold animate-pulse" />
          </motion.div>

          {/* Step 2 - Invite */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="flex items-center justify-center space-x-4"
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-400/10 p-4 rounded-full border border-blue-400/30">
              <UserPlus className="h-8 w-8 text-blue-400" />
            </div>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-gray-300"
            >
              Freund registriert sich
            </motion.div>
          </motion.div>

          {/* Arrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="flex justify-center"
          >
            <ArrowRight className="h-6 w-6 text-gold animate-pulse" />
          </motion.div>

          {/* Step 3 - Rewards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex items-center justify-center space-x-6"
          >
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-500/20 to-green-400/10 p-4 rounded-full border border-green-400/30 mb-2">
                <Gift className="h-8 w-8 text-green-400 mx-auto" />
              </div>
              <div className="text-sm text-gray-300">Freund erhält 50€</div>
            </div>
            
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="bg-gradient-to-br from-gold/20 to-gold/10 p-4 rounded-full border border-gold/30 mb-2"
              >
                <Sparkles className="h-8 w-8 text-gold mx-auto" />
              </motion.div>
              <div className="text-sm text-gold font-semibold">Du erhältst 50€</div>
            </div>
          </motion.div>
        </div>

        {/* Floating coins animation */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-20 left-10 w-8 h-8 bg-gold/30 rounded-full flex items-center justify-center"
        >
          <span className="text-gold text-sm">€</span>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 4, delay: 1 }}
          className="absolute top-32 right-16 w-6 h-6 bg-gold/20 rounded-full flex items-center justify-center"
        >
          <span className="text-gold text-xs">€</span>
        </motion.div>
        
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 2 }}
          className="absolute bottom-20 left-20 w-7 h-7 bg-gold/25 rounded-full flex items-center justify-center"
        >
          <span className="text-gold text-sm">€</span>
        </motion.div>
      </div>
    </div>
  );
};

export default InviteFriendsVisualization;
