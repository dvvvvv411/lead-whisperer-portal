
import { motion } from 'framer-motion';
import { Users, Gift, Share2, TrendingUp } from 'lucide-react';

const InviteFriendsHeader = () => {
  return (
    <div className="relative h-full flex flex-col justify-center p-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent rounded-2xl" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-gold/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-16 h-16 bg-accent1/30 rounded-full blur-lg"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gold to-gold/70 rounded-full mb-6 shadow-lg">
            <Share2 className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Freunde einladen
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Verdiene mit jedem Freund, den du einlädst. 
            <span className="text-gold font-semibold"> 50€ für dich</span> und 
            <span className="text-gold font-semibold"> 50€ für deinen Freund</span>.
          </p>
        </motion.div>

        {/* Feature icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-3 gap-6 max-w-md mx-auto"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-sm text-gray-400">Freunde einladen</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-sm text-gray-400">Boni erhalten</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-gold" />
            </div>
            <p className="text-sm text-gray-400">Verdienen</p>
          </div>
        </motion.div>

        {/* Floating animation elements */}
        <motion.div
          className="absolute -top-10 -right-10 w-8 h-8 bg-gold/30 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-5 -left-5 w-6 h-6 bg-accent1/40 rounded-full"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
  );
};

export default InviteFriendsHeader;
