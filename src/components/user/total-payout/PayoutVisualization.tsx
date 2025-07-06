import { motion } from "framer-motion";
import { ArrowRight, Wallet, CreditCard, CheckCircle2, Clock } from "lucide-react";

interface PayoutVisualizationProps {
  currentStep: 'info' | 'fee-payment' | 'completed';
  feePaid: boolean;
}

export const PayoutVisualization = ({ currentStep, feePaid }: PayoutVisualizationProps) => {
  const steps = [
    {
      id: 'info',
      title: 'Auszahlungsdetails',
      description: 'Währung & Wallet-Adresse',
      icon: Wallet,
      completed: currentStep !== 'info'
    },
    {
      id: 'fee-payment',
      title: 'Gebührenzahlung',
      description: 'Service-Gebühr bezahlen',
      icon: CreditCard,
      completed: feePaid
    },
    {
      id: 'completed',
      title: 'Auszahlung',
      description: 'Guthaben wird übertragen',
      icon: CheckCircle2,
      completed: feePaid
    }
  ];

  const getStepStatus = (step: typeof steps[0], index: number) => {
    if (step.completed) return 'completed';
    if (currentStep === 'info' && index === 0) return 'active';
    if (currentStep === 'fee-payment' && index === 1) return 'active';
    if (feePaid && index === 2) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-casino-card/60 backdrop-blur-sm border border-gold/10 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-semibold text-white mb-6 text-center">
        Auszahlungsvorgang
      </h3>
      
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-700 z-0">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-gold-light"
            initial={{ width: "0%" }}
            animate={{ 
              width: feePaid ? "100%" : currentStep === 'fee-payment' ? "50%" : "0%"
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const status = getStepStatus(step, index);
          const StepIcon = step.icon;
          
          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${status === 'completed' 
                    ? 'bg-green-500 border-green-400 text-white' 
                    : status === 'active'
                    ? 'bg-gold border-gold text-black animate-pulse'
                    : 'bg-casino-darker border-gray-600 text-gray-400'
                  }
                `}
              >
                {status === 'completed' ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : status === 'active' ? (
                  <Clock className="w-6 h-6 animate-spin" />
                ) : (
                  <StepIcon className="w-6 h-6" />
                )}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className="mt-3 text-center"
              >
                <p className={`font-medium text-sm ${
                  status === 'completed' || status === 'active' 
                    ? 'text-white' 
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Animated Arrows */}
      <div className="flex justify-center items-center mt-8 space-x-4">
        {[1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 10, 0],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          >
            <ArrowRight className="w-4 h-4 text-gold/60" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};