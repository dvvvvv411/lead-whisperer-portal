
import { Check, ChevronUp, ChevronDown, Gift, UserPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const PaymentInfoCard = () => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="mb-8 border border-gold/30 bg-gradient-to-br from-slate-800 to-slate-900">
      <CardContent className="p-0">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center">
            <div className="mr-3 p-1.5 rounded-full bg-gold text-black">
              <Gift className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center">
                Premium Konto 
                <span className="ml-3 px-2 py-0.5 text-xs rounded bg-gold text-black">EINMALIG</span>
              </h3>
              <p className="text-sm text-gray-400">Vollzugang zum KI-Trading</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gold mr-2">250€</span>
            {expanded ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
          </div>
        </div>
        
        {/* Invitation Code Message */}
        <div className="px-4 pb-2">
          <motion.div 
            className="p-3 rounded-lg bg-green-900/20 border border-green-700/30"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="mr-3 p-1.5 rounded-full bg-green-600 text-white">
                <UserPlus className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-400">
                  Einladungscode verwendet!
                </p>
                <p className="text-sm text-green-300">
                  Sie haben den Einladungscode %CODE% verwendet und erhalten deshalb 50€ Startguthaben.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-2 border-t border-slate-700/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3">Funktionen</h4>
                    <ul className="space-y-2">
                      <BenefitItem text="KI-Handelsalgorithmus" />
                      <BenefitItem text="Unbegrenzte Trades" />
                      <BenefitItem text="Echtzeit-Marktanalyse" />
                      <BenefitItem text="Kryptowährungen handeln" />
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3">Vorteile</h4>
                    <ul className="space-y-2">
                      <BenefitItem text="Automatische Gewinnerzielung" />
                      <BenefitItem text="Persönlicher Support" />
                      <BenefitItem text="VIP Trading Community" />
                      <BenefitItem text="Garantierter ROI" special={true} />
                    </ul>
                  </div>
                </div>
                
                <motion.div 
                  className="mt-4 p-3 rounded-lg bg-green-900/20 border border-green-700/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-green-400">
                    <span className="font-bold">Einzahlung 100% sicher:</span> Sie können Ihre Einlage jederzeit wieder auszahlen lassen.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const BenefitItem = ({ text, special = false }: { text: string; special?: boolean }) => (
  <motion.li 
    className="flex items-start"
    initial={{ x: -10, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <div className={cn(
      "rounded-full p-0.5 mr-2 mt-0.5",
      special ? "bg-gold" : "bg-green-500/20"
    )}>
      <Check className={cn(
        "h-3 w-3",
        special ? "text-black" : "text-green-500"
      )} />
    </div>
    <span className={cn(
      "text-xs",
      special ? "text-gold font-medium" : "text-gray-300"
    )}>
      {text}
    </span>
  </motion.li>
);

export default PaymentInfoCard;
