
import { motion } from "framer-motion";
import { Bitcoin, CreditCard, Lock, Shield, UserPlus } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const steps = [
  {
    id: 1,
    title: "Konto eröffnen",
    icon: UserPlus,
    description: "Registriere dich bei einer renommierten Kryptobörse wie Binance, Kraken oder Coinbase. Der Anmeldeprozess ist in der Regel schnell und unkompliziert.",
    tip: "Wähle eine Börse mit einer benutzerfreundlichen Oberfläche und gutem Support für Anfänger."
  },
  {
    id: 2,
    title: "Identität verifizieren",
    icon: Shield,
    description: "Schließe den KYC-Prozess (Know Your Customer) ab, indem du einen Personalausweis und ggf. einen Adressnachweis hochlädst.",
    tip: "Diese Verifizierung ist gesetzlich vorgeschrieben und schützt alle Nutzer vor Betrug und Geldwäsche."
  },
  {
    id: 3,
    title: "Zahlungsmethode wählen",
    icon: CreditCard,
    description: "Füge eine Zahlungsmethode hinzu, z.B. Banküberweisung (SEPA), Kreditkarte oder andere Online-Zahlungsdienste.",
    tip: "Banküberweisung hat oft niedrigere Gebühren, Kreditkarte ermöglicht dagegen sofortige Käufe."
  },
  {
    id: 4,
    title: "Erste Kryptowährung kaufen",
    icon: Bitcoin,
    description: "Starte mit bekannten Kryptowährungen wie Bitcoin oder Ethereum. Wähle einen Betrag, mit dem du dich wohlfühlst.",
    tip: "Du kannst auch mit kleinen Beträgen beginnen. Es ist nicht nötig, eine ganze Einheit zu kaufen."
  },
  {
    id: 5,
    title: "Sichere Aufbewahrung",
    icon: Lock,
    description: "Überlege dir, ob du deine Kryptowährungen auf der Börse lassen oder in eine eigene Wallet übertragen möchtest.",
    tip: "Aktiviere unbedingt die Zwei-Faktor-Authentifizierung (2FA) für zusätzliche Sicherheit."
  }
];

const IntroSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-14">
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold mb-6 text-center text-white"
      >
        So kaufst du deine ersten Kryptowährungen
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center text-gray-300 max-w-3xl mx-auto mb-10"
      >
        Der Einstieg in die Welt der Kryptowährungen ist einfacher, als du vielleicht denkst. 
        Folge dieser Schritt-für-Schritt-Anleitung, um sicher und unkompliziert deine ersten 
        Kryptowährungen zu erwerben.
      </motion.p>
      
      <div className="max-w-2xl mx-auto relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[31px] top-14 bottom-14 w-1 bg-gradient-to-b from-gold/30 via-gold to-gold/30 z-0 hidden md:block"></div>
        
        {/* Steps displayed vertically */}
        {steps.map((step, index) => (
          <div key={step.id} className="mb-8 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row items-start gap-5"
            >
              {/* Step indicator with icon */}
              <div className="flex flex-col items-center z-10">
                <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center shadow-glow">
                  <step.icon className="h-8 w-8 text-gold" />
                </div>
                {index < steps.length - 1 && (
                  <div className="h-6 w-1 bg-gold/30 my-1 md:hidden"></div>
                )}
              </div>
              
              {/* Card content */}
              <div 
                className="bg-casino-card border border-white/10 rounded-lg p-6 shadow-lg hover:border-gold/30 transition-all w-full"
                style={{ maxWidth: isMobile ? "100%" : "calc(100% - 80px)" }}
              >
                <h3 className="text-xl font-semibold text-gold mb-3">
                  Schritt {step.id}: {step.title}
                </h3>
                <p className="text-gray-300 mb-4">{step.description}</p>
                <div className="bg-black/30 border border-gold/10 rounded-md p-3 mt-auto">
                  <p className="text-sm text-gray-300">
                    <span className="text-gold font-medium">Tipp:</span> {step.tip}
                  </p>
                </div>
              </div>
            </motion.div>
            
            {/* Arrow connector between steps (visible only on mobile) */}
            {index < steps.length - 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index + 0.5) * 0.1 }}
                className="flex justify-center my-2 md:hidden"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5L12 19M12 19L5 12M12 19L19 12" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntroSection;
