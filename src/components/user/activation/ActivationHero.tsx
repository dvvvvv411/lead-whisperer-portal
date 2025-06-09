
import { motion } from "framer-motion";
import { Bot, Zap, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvitationCodeMessage from "./InvitationCodeMessage";

const ActivationHero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Hero Content */}
      <div className="text-center lg:text-left space-y-6">
        <motion.h2 
          className="text-3xl lg:text-4xl font-bold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Aktivieren Sie Ihr{" "}
          <span className="text-transparent bg-gold-gradient bg-clip-text">
            KI-Trading Konto
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-lg text-gray-300 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Nutzen Sie modernste KI-Technologie für automatisierten Krypto-Handel. 
          Unser Algorithmus arbeitet 24/7 für Ihre Gewinne.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button className="bg-gold hover:bg-gold/80 text-black font-semibold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            Jetzt 250€ einzahlen & profitieren
          </Button>
        </motion.div>

        {/* Invitation Code Message */}
        <InvitationCodeMessage />
      </div>

      {/* Features Grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FeatureCard 
          icon={<Bot className="h-6 w-6" />}
          title="KI-Algorithmus"
          description="Automatisierte Marktanalyse"
        />
        <FeatureCard 
          icon={<Zap className="h-6 w-6" />}
          title="Sofortige Reaktion"
          description="Trades in Millisekunden"
        />
        <FeatureCard 
          icon={<TrendingUp className="h-6 w-6" />}
          title="Maximale Gewinne"
          description="Optimierte Rendite"
        />
        <FeatureCard 
          icon={<Shield className="h-6 w-6" />}
          title="100% Sicher"
          description="Reguliert & geschützt"
        />
      </motion.div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-gold/5 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
}) => (
  <motion.div 
    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm"
    whileHover={{ scale: 1.02, borderColor: "rgba(255, 193, 7, 0.3)" }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-gold/10 text-gold">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default ActivationHero;
