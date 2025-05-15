
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PaymentStatusViewDepositProps {
  status: 'pending' | 'completed' | 'rejected' | null;
}

const PaymentStatusViewDeposit = ({ status }: PaymentStatusViewDepositProps) => {
  // Set up container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  // Set up item animation
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <div className="p-6 h-full">
      <motion.div
        className="flex flex-col items-center justify-center h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          {status === 'completed' ? (
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          ) : status === 'rejected' ? (
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
          ) : (
            <div className="flex justify-center">
              <Loader2 className="h-16 w-16 text-amber-500 animate-spin" />
            </div>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-amber-500">
            {status === 'completed' ? (
              "Einzahlung bestätigt"
            ) : status === 'rejected' ? (
              "Einzahlung abgelehnt"
            ) : (
              "Einzahlung wird überprüft"
            )}
          </h2>
        </motion.div>
        
        <motion.div variants={itemVariants} className="mt-4 text-center max-w-md">
          {status === 'completed' ? (
            <p className="text-white/80">
              Ihre Einzahlung wurde bestätigt und Ihrem Konto gutgeschrieben.
            </p>
          ) : status === 'rejected' ? (
            <p className="text-white/80">
              Leider wurde Ihre Einzahlung abgelehnt. Bitte kontaktieren Sie unseren Support für weitere Informationen.
            </p>
          ) : (
            <p className="text-white/80">
              Ihre Einzahlung wird gerade überprüft. Dieser Vorgang kann einige Minuten dauern.
              Sobald die Überprüfung abgeschlossen ist, wird der Betrag Ihrem Konto gutgeschrieben.
            </p>
          )}
        </motion.div>
        
        {status === 'pending' && (
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <Card className="p-4 bg-black/40 border-gold/20 max-w-md">
              <p className="text-sm text-amber-300 font-medium flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Überprüfung in Bearbeitung
              </p>
              <p className="text-xs text-white/70 mt-2">
                Bitte haben Sie etwas Geduld. Sie können diese Seite geöffnet lassen oder später zurückkehren.
                Der Status wird automatisch aktualisiert.
              </p>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentStatusViewDeposit;
