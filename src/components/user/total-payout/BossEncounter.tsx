import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sword, Heart, Zap, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWallets } from "@/hooks/useWallets";

interface BossEncounterProps {
  feePercentage: number;
  feeAmount: number;
  onFeePaymentConfirm: (currency: string) => void;
  processing: boolean;
  selectedCurrency: string;
  onCurrencySelect: (currency: string) => void;
}

export const BossEncounter = ({ 
  feePercentage, 
  feeAmount, 
  onFeePaymentConfirm, 
  processing, 
  selectedCurrency, 
  onCurrencySelect 
}: BossEncounterProps) => {
  const { wallets } = useWallets();
  const [battlePhase, setBattlePhase] = useState<'preparation' | 'battle' | 'victory'>('preparation');
  const [bossHealth, setBossHealth] = useState(100);

  const selectedWallet = wallets.find(w => w.currency === selectedCurrency);

  useEffect(() => {
    if (selectedCurrency && battlePhase === 'preparation') {
      setBattlePhase('battle');
    }
  }, [selectedCurrency, battlePhase]);

  const handleAttack = () => {
    if (!selectedCurrency) return;
    
    // Animate boss taking damage
    setBossHealth(0);
    setTimeout(() => {
      setBattlePhase('victory');
      onFeePaymentConfirm(selectedCurrency);
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Battle Arena Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-purple-900/20 to-black/40 rounded-2xl"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1)_0%,transparent_70%)] rounded-2xl"></div>
      
      <Card className="relative bg-casino-card/80 backdrop-blur-lg border-red-500/30 overflow-hidden">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {battlePhase === 'preparation' && (
              <motion.div
                key="preparation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-6"
              >
                {/* Boss Encounter Title */}
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="space-y-2"
                >
                  <h2 className="text-3xl font-bold text-red-400 flex items-center justify-center">
                    <Shield className="mr-3 h-8 w-8" />
                    Final Boss: Gebühren-Guardian
                    <Shield className="ml-3 h-8 w-8" />
                  </h2>
                  <p className="text-gray-300">
                    Ein mächtiger Guardian bewacht Ihre Auszahlung. Wählen Sie Ihre Waffe!
                  </p>
                </motion.div>

                {/* Boss Visual */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="relative mx-auto w-32 h-32"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-800 rounded-full animate-pulse shadow-2xl shadow-red-500/50"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-red-600 to-red-900 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-12 h-12 text-white animate-bounce" />
                  </div>
                </motion.div>

                {/* Boss Stats */}
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-400 font-bold">Guardian Level</span>
                    <span className="text-white font-bold">{feePercentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-bold">Tribute Required</span>
                    <span className="text-white font-bold">{feeAmount.toFixed(2)}€</span>
                  </div>
                </div>

                {/* Weapon Selection */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gold flex items-center justify-center">
                    <Sword className="mr-2 h-6 w-6" />
                    Wählen Sie Ihre Waffe
                  </h3>
                  <div className="grid gap-3">
                    {wallets.map((wallet) => (
                      <motion.button
                        key={wallet.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onCurrencySelect(wallet.currency)}
                        className={`p-4 rounded-lg border transition-all ${
                          selectedCurrency === wallet.currency
                            ? 'border-gold bg-gold/20 text-gold'
                            : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gold/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Zap className="w-5 h-5 mr-3" />
                            <span className="font-medium">{wallet.currency.toUpperCase()}-Schwert</span>
                          </div>
                          {selectedCurrency === wallet.currency && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-gold rounded-full flex items-center justify-center"
                            >
                              <Shield className="w-4 h-4 text-black" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {battlePhase === 'battle' && (
              <motion.div
                key="battle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-6"
              >
                {/* Battle Interface */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-red-400">Kampf im Gange!</h2>
                  
                  {/* Boss Health Bar */}
                  <div className="bg-gray-800 rounded-full h-4 overflow-hidden border border-red-500/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600"
                      initial={{ width: "100%" }}
                      animate={{ width: `${bossHealth}%` }}
                      transition={{ duration: 2 }}
                    />
                  </div>
                  <p className="text-sm text-gray-400">Guardian Lebenspunkte: {bossHealth}%</p>
                </div>

                {/* Selected Weapon Display */}
                {selectedWallet && (
                  <div className="bg-gold/20 border border-gold/30 rounded-lg p-4">
                    <h4 className="font-medium text-gold mb-2">Gewählte Waffe</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Währung: </span>
                        <span className="text-white">{selectedWallet.currency.toUpperCase()}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Zieladresse:</span>
                        <div className="bg-casino-darker p-2 rounded mt-1 break-all font-mono text-xs">
                          {selectedWallet.wallet_address}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Attack Button */}
                <Button
                  onClick={handleAttack}
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 text-lg"
                >
                  {processing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="flex items-center"
                    >
                      <Sword className="w-6 h-6 mr-2" />
                      Angriff läuft...
                    </motion.div>
                  ) : (
                    <>
                      <Sword className="w-6 h-6 mr-2" />
                      Finaler Angriff!
                    </>
                  )}
                </Button>
              </motion.div>
            )}

            {battlePhase === 'victory' && (
              <motion.div
                key="victory"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <h2 className="text-3xl font-bold text-gold">Sieg!</h2>
                  <p className="text-green-400 text-lg">Der Guardian wurde besiegt!</p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mx-auto w-24 h-24 bg-gradient-to-br from-gold to-yellow-600 rounded-full flex items-center justify-center"
                >
                  <Heart className="w-12 h-12 text-black" />
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="text-gray-300"
                >
                  Ihre Auszahlung wird nun freigeschaltet...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};