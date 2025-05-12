
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Bot, 
  ChartLine,
  Globe
} from "lucide-react";

const benefits = [
  {
    icon: <TrendingUp className="h-10 w-10 text-gold" />,
    title: "Höhere Renditen",
    description: "Erziele überdurchschnittliche Renditen durch KI-gestützte Handelsentscheidungen, die auf komplexen Marktanalysen basieren."
  },
  {
    icon: <Bot className="h-10 w-10 text-gold" />,
    title: "Vollständig automatisiert",
    description: "Unser KI-Bot handelt vollautomatisch für dich - du musst keine Zeit investieren oder Marktkenntnisse besitzen."
  },
  {
    icon: <Shield className="h-10 w-10 text-gold" />,
    title: "Risikomanagement",
    description: "Fortschrittliche Algorithmen minimieren dein Risiko durch diversifizierte Handelsstrategien und Stop-Loss-Mechanismen."
  },
  {
    icon: <ChartLine className="h-10 w-10 text-gold" />,
    title: "Datengestützte Entscheidungen",
    description: "Unser Bot analysiert Tausende von Marktdaten in Echtzeit und trifft präzise Handelsentscheidungen ohne emotionale Einflüsse."
  },
  {
    icon: <Globe className="h-10 w-10 text-gold" />,
    title: "24/7 Marktüberwachung",
    description: "Der Bot überwacht den Kryptomarkt rund um die Uhr und reagiert sofort auf profitable Handelsmöglichkeiten."
  },
  {
    icon: <Zap className="h-10 w-10 text-gold" />,
    title: "Blitzschnelle Ausführung",
    description: "Sekundenbruchteile entscheiden über Profit oder Verlust - unser Bot handelt mit minimaler Latenz für optimale Ergebnisse."
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
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
              Deine Vorteile auf einen Blick
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Warum sich immer mehr Trader für unseren KI-gestützten Bot entscheiden und damit überdurchschnittliche Renditen erzielen.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-casino-card border border-white/10 rounded-xl p-6 shadow-lg relative overflow-hidden group"
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gold/10 to-purple-500/10 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              {/* Corner decoration */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-md"></div>
              
              <div className="relative">
                {/* Icon */}
                <div className="bg-white/5 rounded-xl p-3 inline-block mb-4">
                  {benefit.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 bg-gradient-to-r from-casino-card to-casino-darker border border-gold/20 rounded-xl p-8 shadow-lg relative overflow-hidden"
        >
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent blur-sm"></div>
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent blur-sm"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Bereit für den nächsten Schritt?</h3>
              <p className="text-gray-300 max-w-lg">
                Melde dich jetzt an und starte deine automatisierte Trading-Reise mit unserem KI Bot.
              </p>
            </div>
            
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-3 bg-gold hover:bg-gold-light text-black font-medium rounded-lg shadow-lg shadow-gold/20 transition-all"
            >
              Jetzt registrieren
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
