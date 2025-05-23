
import { motion } from "framer-motion";

const StatsSection = () => {
  return (
    <div className="space-y-6">
      <div className="border-l-4 border-gold pl-4">
        <h3 className="text-xl md:text-2xl font-bold mb-2">Warum wir limitieren</h3>
        <p className="text-gray-300">
          Unser KI-Algorithmus arbeitet am besten mit einer begrenzten Anzahl von gleichzeitigen Nutzern, um optimale Renditen zu erzielen und konstant hohe Performance für alle zu gewährleisten.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { title: "monatliche Rendite", value: "bis zu 30%" },
          { title: "Erfolgsrate", value: "über 90%" },
          { title: "Trades pro Monat", value: "1.460.000 +" },
          { title: "Aktivierungsgebühr", value: "250€" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
            className="bg-casino-card border border-white/10 p-4 rounded-lg"
          >
            <p className="text-gray-400 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-green-400">
          <span className="font-bold">🔒 Transparente Strategie:</span> Unser Bot nutzt bewährte Handelsalgorithmen mit regelmäßigen Performance-Berichten, damit Sie Ihre Investitionen stets nachvollziehen können.
        </p>
      </motion.div>
    </div>
  );
};

export default StatsSection;
