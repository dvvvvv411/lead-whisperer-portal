
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

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
    <section id="benefits" className="py-20 relative overflow-hidden bg-[#090B0D]">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-[#0C0E10] to-transparent"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        {/* Animated particles */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent1/5 rounded-full filter blur-3xl"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full filter blur-3xl"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.15, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Animated gold particles */}
        <motion.div 
          className="absolute top-20 left-1/3 w-1 h-1 rounded-full bg-gold/70"
          animate={{ 
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-40 right-1/4 w-1 h-1 rounded-full bg-gold/60"
          animate={{ 
            opacity: [0.2, 0.7, 0.2],
            scale: [1, 1.8, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
        />
        
        {/* Transition gradient to the next section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#080A0C] to-transparent"></div>
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
      
      {/* Bottom pattern */}
      <div className="absolute inset-x-0 bottom-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none" className="w-full h-12">
          <path fill="#0B0D0E" d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,64C672,64,768,64,864,53.3C960,43,1056,21,1152,16C1248,11,1344,21,1392,26.7L1440,32L1440,100L1392,100C1344,100,1248,100,1152,100C1056,100,960,100,864,100C768,100,672,100,576,100C480,100,384,100,288,100C192,100,96,100,48,100L0,100Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default BenefitsSection;
