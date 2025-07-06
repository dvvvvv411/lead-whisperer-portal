import { motion } from "framer-motion";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QuestStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

interface PayoutProgressQuestProps {
  currentStep: 'info' | 'fee-payment' | 'completed';
  feePaid: boolean;
}

export const PayoutProgressQuest = ({ currentStep, feePaid }: PayoutProgressQuestProps) => {
  const getQuestSteps = (): QuestStep[] => [
    {
      id: 1,
      title: "Informationen verstehen",
      description: "Service-Einstellung und Auszahlungsdetails prüfen",
      completed: currentStep !== 'info',
      current: currentStep === 'info'
    },
    {
      id: 2,
      title: "Guardian herausfordern",
      description: "Den Gebühren-Guardian in einem epischen Kampf besiegen",
      completed: feePaid,
      current: currentStep === 'fee-payment' && !feePaid
    },
    {
      id: 3,
      title: "Belohnung einsammeln",
      description: "Ihre vollständige Auszahlung freischalten",
      completed: feePaid,
      current: feePaid
    }
  ];

  const questSteps = getQuestSteps();
  const completedSteps = questSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / questSteps.length) * 100;

  return (
    <Card className="bg-casino-card/60 backdrop-blur-lg border-purple-500/30 mb-8">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Quest Header */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-400 mb-2">Auszahlungs-Quest</h3>
            <p className="text-gray-300">Schließen Sie alle Schritte ab, um Ihre Belohnung zu erhalten</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Quest Fortschritt</span>
              <span className="text-purple-400 font-medium">{completedSteps}/{questSteps.length} abgeschlossen</span>
            </div>
            <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Quest Steps */}
          <div className="space-y-4">
            {questSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-all ${
                  step.completed 
                    ? 'border-green-500/30 bg-green-900/20' 
                    : step.current 
                      ? 'border-purple-500/50 bg-purple-900/20' 
                      : 'border-gray-600/30 bg-gray-800/20'
                }`}
              >
                {/* Step Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500' 
                    : step.current 
                      ? 'bg-purple-500 animate-pulse' 
                      : 'bg-gray-600'
                }`}>
                  {step.completed ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : step.current ? (
                    <Clock className="w-5 h-5 text-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h4 className={`font-medium ${
                    step.completed 
                      ? 'text-green-400' 
                      : step.current 
                        ? 'text-purple-400' 
                        : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-sm text-gray-300 mt-1">{step.description}</p>
                </div>

                {/* Step Status */}
                {step.current && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-purple-400 text-sm font-medium"
                  >
                    Aktiv
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quest Completion Bonus */}
          {feePaid && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-gold/20 to-yellow-500/20 border border-gold/30 rounded-lg p-4 text-center"
            >
              <h4 className="text-gold font-bold mb-2">🎉 Quest Abgeschlossen! 🎉</h4>
              <p className="text-sm text-gray-300">
                Herzlichen Glückwunsch! Sie haben alle Herausforderungen gemeistert.
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};