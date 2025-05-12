import { motion } from "framer-motion";
import BackgroundEffects from "./partners/BackgroundEffects";

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
    <section className="py-16 relative overflow-hidden bg-casino-darker">
      {/* Background elements */}
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Unsere Partner
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Wir arbeiten mit führenden Unternehmen der Krypto- und Fintech-Branche zusammen, um dir die beste Trading-Erfahrung zu bieten.
          </p>
        </motion.div>
        
        <div className="flex flex-wrap justify-center gap-8 mb-16">
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
              <div className="w-32 h-32 bg-gradient-to-br from-casino-card to-black border border-white/10 rounded-xl flex items-center justify-center shadow-lg relative group overflow-hidden">
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-accent1/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/10 to-accent1/10 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                
                {/* Logo placeholder */}
                <span className="text-3xl font-bold relative z-10 bg-gradient-to-br from-gray-200 to-white bg-clip-text text-transparent group-hover:from-gold group-hover:to-amber-500 transition-all duration-300">
                  {partner.logo}
                </span>
              </div>
              <p className="mt-2 text-gray-400 text-sm group-hover:text-white transition-colors duration-300">{partner.name}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-gradient-to-br from-casino-card to-black backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-lg shadow-black/40 relative overflow-hidden text-center"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl blur opacity-20"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent mb-2">5000+</div>
              <p className="text-gray-300">Aktive Nutzer</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-casino-card to-black backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-lg shadow-black/40 relative overflow-hidden text-center"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl blur opacity-20"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent mb-2">€1.2M+</div>
              <p className="text-gray-300">Trading Volumen/Monat</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-gradient-to-br from-casino-card to-black backdrop-blur-sm border border-white/5 rounded-xl p-6 shadow-lg shadow-black/40 relative overflow-hidden text-center"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-gold/10 rounded-xl blur opacity-20"></div>
            <div className="relative z-10">
              <div className="text-4xl font-bold bg-gradient-to-br from-gold to-gold-light bg-clip-text text-transparent mb-2">97%</div>
              <p className="text-gray-300">Kundenzufriedenheit</p>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0D0E] to-transparent"></div>
    </section>
  );
};

export default PartnersSection;
