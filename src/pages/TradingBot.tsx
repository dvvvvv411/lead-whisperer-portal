import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { Activity, Lock, TrendingUp, WalletCards } from "lucide-react";
import CtaBanner from "@/components/landing/CtaBanner";

const steps = [
  {
    id: 1,
    title: "Registrierung",
    description: "Schnell & einfach Konto anlegen",
    icon: <WalletCards className="w-12 h-12 text-gold" />,
    details: "Erstellen Sie Ihr Konto in weniger als 2 Minuten. Keine komplizierte Verifizierung nötig - nur E-Mail und Passwort, und Sie können sofort loslegen."
  },
  {
    id: 2,
    title: "Einzahlung / Aktivierung",
    description: "Einmalige Zahlung von 250 €, wird vollständig als Startkapital verwendet",
    icon: <Lock className="w-12 h-12 text-gold" />,
    details: "Ihre Aktivierungsgebühr wird zu 100% als Startkapital für Ihre Trading-Aktivitäten verwendet. Keine versteckten Kosten oder Gebühren."
  },
  {
    id: 3,
    title: "Marktanalyse durch KI",
    description: "Rund um die Uhr aktive Algorithmen, basierend auf Echtzeitdaten",
    icon: <Activity className="w-12 h-12 text-gold" />,
    details: "Unsere fortschrittlichen KI-Algorithmen analysieren kontinuierlich den Kryptomarkt und identifizieren profitable Trading-Möglichkeiten mit einer Erfolgsrate von über 90%."
  },
  {
    id: 4,
    title: "Automatische Gewinne",
    description: "Bot handelt automatisch, Gewinne werden täglich optimiert",
    icon: <TrendingUp className="w-12 h-12 text-gold" />,
    details: "Der Bot führt automatisch Trades durch und optimiert Ihr Portfolio für maximale Rendite. Sie können die Performance in Echtzeit verfolgen und Gewinne jederzeit abheben."
  }
];

const TradingBot = () => {
  return (
    <PageLayout 
      title="Trading Bot – So funktioniert's" 
      description="In nur wenigen einfachen Schritten zu automatisierten Krypto-Gewinnen"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12 mt-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute left-9 top-24 bottom-0 w-1 bg-gradient-to-b from-gold/50 to-gold/5 h-[calc(100%-4rem)]"></div>
              )}
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Step number and icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-casino-card border border-gold/20 flex items-center justify-center shadow-lg shadow-gold/5 relative z-10">
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center font-bold text-lg">
                      {step.id}
                    </div>
                    {step.icon}
                  </div>
                </div>
                
                {/* Step content */}
                <div className="flex-1">
                  <div className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gold mb-2">{step.title}</h3>
                    <p className="text-white/90 mb-4">{step.description}</p>
                    <p className="text-gray-400">{step.details}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <CtaBanner />
      </div>
    </PageLayout>
  );
};

export default TradingBot;
