import { motion } from "framer-motion";
import { Coins, TrendingUp, Award, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PayoutRewardsProps {
  balance: number;
  currency: string;
  walletAddress: string;
  isUnlocked: boolean;
}

export const PayoutRewards = ({ balance, currency, walletAddress, isUnlocked }: PayoutRewardsProps) => {
  const achievements = [
    { icon: TrendingUp, title: "Erfolgreicher Trader", description: "Beständige Gewinne erzielt" },
    { icon: Award, title: "KI-Partner Veteran", description: "Mit unserem Bot gehandelt" },
    { icon: Sparkles, title: "Quest Meister", description: "Alle Herausforderungen gemeistert" }
  ];

  return (
    <Card className="bg-casino-card/80 backdrop-blur-lg border-gold/20 overflow-hidden">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-gold flex items-center justify-center text-2xl">
          <Coins className="mr-3 h-8 w-8" />
          Ihre Belohnung
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Reward Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Treasure Chest Effect */}
          <div className="bg-gradient-to-br from-gold/20 to-yellow-600/20 border-2 border-gold/40 rounded-2xl p-8 text-center relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent animate-shimmer"></div>
            
            {/* Lock/Unlock Overlay */}
            {!isUnlocked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-500/20 border-2 border-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      🔒
                    </motion.div>
                  </div>
                  <p className="text-orange-400 font-medium">Schatz noch versiegelt</p>
                  <p className="text-sm text-gray-400 mt-1">Besiegen Sie den Guardian!</p>
                </div>
              </div>
            )}

            <div className="relative z-10">
              <motion.div
                animate={isUnlocked ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <h3 className="text-4xl font-bold text-gold mb-2">{balance.toFixed(2)}€</h3>
                <p className="text-gray-300 text-lg">Ihr Trading-Gewinn</p>
              </motion.div>

              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 space-y-4"
                >
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Auszahlungswährung:</span>
                        <span className="text-white font-medium">{currency.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-1">Wallet-Adresse:</span>
                        <div className="bg-casino-darker p-3 rounded font-mono text-xs break-all border">
                          {walletAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Achievement Showcase */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-purple-400 text-center">Errungenschaften</h4>
          <div className="grid gap-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center space-x-3 bg-purple-900/20 border border-purple-500/30 rounded-lg p-3"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <achievement.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h5 className="font-medium text-purple-400">{achievement.title}</h5>
                  <p className="text-xs text-gray-400">{achievement.description}</p>
                </div>
                <div className="ml-auto">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    ✓
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center text-green-400">
              <Sparkles className="mr-2 h-6 w-6" />
              <span className="font-medium text-lg">Auszahlung freigeschaltet!</span>
            </div>
            <p className="text-sm text-gray-300">
              Ihre Auszahlung wird in Kürze bearbeitet. Vielen Dank für Ihr Vertrauen!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};