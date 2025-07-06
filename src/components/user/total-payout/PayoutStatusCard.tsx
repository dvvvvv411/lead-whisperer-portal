import { motion } from "framer-motion";
import { Lock, Unlock, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

interface PayoutStatusCardProps {
  feePaid: boolean;
  status: string;
  feePercentage: number;
  userBalance: number;
}

export const PayoutStatusCard = ({ feePaid, status, feePercentage, userBalance }: PayoutStatusCardProps) => {
  const balanceInEuros = userBalance / 100;
  const feeAmount = (balanceInEuros * feePercentage) / 100;

  const getStatusConfig = () => {
    if (feePaid) {
      return {
        icon: Unlock,
        title: "Auszahlung freigeschaltet",
        description: "Ihre Auszahlung wird nun bearbeitet und in Kürze übertragen.",
        bgColor: "bg-green-900/20",
        borderColor: "border-green-500/30",
        iconColor: "text-green-400",
        textColor: "text-green-400"
      };
    } else {
      return {
        icon: Lock,
        title: "Auszahlung gesperrt",
        description: `Zahlen Sie die Service-Gebühr von ${feeAmount.toFixed(2)}€ (${feePercentage}%) um Ihre Auszahlung freizuschalten.`,
        bgColor: "bg-orange-900/20",
        borderColor: "border-orange-500/30",
        iconColor: "text-orange-400",
        textColor: "text-orange-400"
      };
    }
  };

  const config = getStatusConfig();
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 relative overflow-hidden`}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`w-32 h-32 ${config.bgColor} rounded-full blur-2xl absolute top-0 right-0`}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            animate={{
              rotate: feePaid ? 0 : [0, -10, 10, 0],
              scale: feePaid ? 1 : [1, 1.1, 1]
            }}
            transition={{
              duration: feePaid ? 0 : 2,
              repeat: feePaid ? 0 : Infinity
            }}
            className={`p-3 rounded-full ${config.bgColor} border ${config.borderColor}`}
          >
            <StatusIcon className={`w-8 h-8 ${config.iconColor}`} />
          </motion.div>
        </div>

        <h3 className={`text-xl font-bold ${config.textColor} text-center mb-3`}>
          {config.title}
        </h3>

        <p className="text-gray-300 text-center text-sm leading-relaxed">
          {config.description}
        </p>

        {feePaid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium text-sm">
              Gebühr erfolgreich bezahlt
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};