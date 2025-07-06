import { motion } from "framer-motion";
import { TrendingUp, Shield, Clock, CheckCircle2 } from "lucide-react";

interface TotalPayoutHeroProps {
  userBalance: number;
  status: string;
  feePaid: boolean;
}

export const TotalPayoutHero = ({ userBalance, status, feePaid }: TotalPayoutHeroProps) => {
  const balanceInEuros = userBalance / 100;

  const getStatusInfo = () => {
    if (feePaid) {
      return {
        icon: CheckCircle2,
        title: "Auszahlung freigegeben",
        subtitle: "Ihre Auszahlung wird bearbeitet",
        color: "text-green-400",
        bgColor: "bg-green-900/20"
      };
    } else if (status === "pending") {
      return {
        icon: Clock,
        title: "Auszahlung ausstehend",
        subtitle: "bitloon stellt seinen Service ein",
        color: "text-orange-400",
        bgColor: "bg-orange-900/20"
      };
    } else {
      return {
        icon: TrendingUp,
        title: "Zahlen Sie ihr gesamtes Guthaben aus",
        subtitle: "Ihr Guthaben wird ausgezahlt",
        color: "text-gold",
        bgColor: "bg-gold/10"
      };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-casino-darker via-casino-dark to-casino-darker rounded-2xl border border-gold/20 p-8 mb-8">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent1/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`inline-flex items-center px-4 py-2 rounded-full ${statusInfo.bgColor} border border-current/20 mb-6`}
          >
            <StatusIcon className={`w-5 h-5 mr-2 ${statusInfo.color}`} />
            <span className={`font-medium ${statusInfo.color}`}>
              {statusInfo.title}
            </span>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-white mb-3">
              Zahlen Sie ihr gesamtes Guthaben aus
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              {statusInfo.subtitle}
            </p>
          </motion.div>

          {/* Balance Display */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative"
          >
            <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-gold/10 to-gold-light/10 border border-gold/30 backdrop-blur-sm">
              <div className="flex items-center justify-center space-x-3">
                <Shield className="w-8 h-8 text-gold" />
                <div className="text-left">
                  <p className="text-sm text-gray-400 font-medium">Ihr Guthaben</p>
                  <p className="text-5xl font-bold text-gold">
                    {balanceInEuros.toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};