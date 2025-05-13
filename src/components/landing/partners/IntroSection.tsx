
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
      
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'} max-w-6xl mx-auto`}>
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-casino-card border border-white/10 rounded-lg p-6 shadow-lg hover:border-gold/30 transition-all"
            whileHover={{
              y: -5,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
              borderColor: "rgba(255, 215, 0, 0.4)"
            }}
          >
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center mr-4 shadow-glow">
                <step.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="text-xl font-semibold text-gold">
                {step.id}. {step.title}
              </h3>
            </div>
            
            <p className="text-gray-300 mb-4">{step.description}</p>
            
            <div className="bg-black/30 border border-gold/10 rounded-md p-3 mt-auto">
              <p className="text-sm text-gray-300">
                <span className="text-gold font-medium">Tipp:</span> {step.tip}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default IntroSection;
