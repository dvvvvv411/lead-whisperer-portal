
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import SharedBackgroundEffects from "./common/SharedBackgroundEffects";

const benefits = [
  {
    id: 1,
    title: "KI-gestützte Analyse",
    description: "Unser algorithmischer Bot analysiert kontinuierlich Markttrends und identifiziert profitable Trading-Möglichkeiten.",
    icon: "🧠"
  },
  {
    id: 2,
    title: "Automatisierte Trades",
    description: "Trades werden automatisch und rund um die Uhr ausgeführt, ohne dass du Erfahrung benötigst.",
    icon: "⚙️"
  },
  {
    id: 3,
    title: "Risikominimierung",
    description: "Integrierte Schutzmaßnahmen und Stop-Loss-Mechanismen reduzieren potenzielle Verluste.",
    icon: "🛡️"
  },
  {
    id: 4,
    title: "Hohe Erfolgsquote",
    description: "Unsere Handelsalgorithmen erzielen täglich bis zu 20% Rendite mit einer Erfolgsquote von über 95%.",
    icon: "📈"
  },
  {
    id: 5,
    title: "Einfache Bedienung",
    description: "Keine komplizierten Einstellungen notwendig - der Bot übernimmt die komplexe Arbeit.",
    icon: "🔍"
  },
  {
    id: 6,
    title: "Transparente Ergebnisse",
    description: "Verfolge alle Trades und Gewinne in Echtzeit über dein persönliches Dashboard.",
    icon: "📊"
  }
];

const BenefitsSection = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <section id="benefits" className="py-20 relative overflow-hidden bg-casino-darker">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <SharedBackgroundEffects 
          variant="primary"
          showTopGradient={true}
          showBottomGradient={true}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Vorteile des KI-Tradings
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Unsere fortschrittliche KI-Trading-Technologie bietet dir zahlreiche Vorteile
            gegenüber herkömmlichen Trading-Methoden.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-gradient-to-br from-casino-card to-black backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-lg shadow-black/40 relative overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-accent1/20 rounded-xl blur opacity-20"></div>
              
              <div className="relative">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mr-3 text-2xl">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-gray-300">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-6 py-3 rounded-full bg-gold/10 border border-gold/20 text-white">
            <span className="text-gold font-medium">KI-Trading</span> – Die Zukunft des automatisierten Handels
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
