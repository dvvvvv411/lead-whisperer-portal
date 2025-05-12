
import { motion } from "framer-motion";

const partners = [
  { id: 1, name: "CryptoX", logo: "CX" },
  { id: 2, name: "BlockChain Capital", logo: "BC" },
  { id: 3, name: "AlgoTrade", logo: "AT" },
  { id: 4, name: "FinTech Solutions", logo: "FT" },
  { id: 5, name: "Digital Assets", logo: "DA" },
  { id: 6, name: "CoinVenture", logo: "CV" },
];

const PartnersSection = () => {
  return (
    <section className="py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-casino-darker to-casino-card opacity-80"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Unsere Partner
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Wir arbeiten mit führenden Unternehmen der Krypto- und Fintech-Branche zusammen, um dir die beste Trading-Erfahrung zu bieten.
          </p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-casino-card border border-white/10 rounded-xl flex items-center justify-center shadow-lg relative group">
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Logo placeholder */}
                <span className="text-3xl font-bold relative z-10 bg-gradient-to-br from-gray-200 to-white bg-clip-text text-transparent group-hover:from-gold group-hover:to-amber-500 transition-all duration-300">
                  {partner.logo}
                </span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{partner.name}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl font-bold text-gold mb-2">5000+</div>
            <p className="text-gray-300">Aktive Nutzer</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl font-bold text-gold mb-2">€1.2M+</div>
            <p className="text-gray-300">Trading Volumen/Monat</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="text-4xl font-bold text-gold mb-2">97%</div>
            <p className="text-gray-300">Kundenzufriedenheit</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
