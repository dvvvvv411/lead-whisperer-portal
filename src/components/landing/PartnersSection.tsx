
import { motion } from "framer-motion";
import ExchangeCard from "./partners/ExchangeCard";

const exchanges = [
  {
    id: 1,
    name: "Binance",
    logo: "https://i.imgur.com/DcdYgPH.png",
    description: "Die weltweit größte Kryptobörse nach Handelsvolumen mit einem umfassenden Angebot an Kryptowährungen und Finanzprodukten.",
    metrics: "Über 100 Millionen registrierte Nutzer und tägliches Handelsvolumen von mehreren Milliarden USD",
    websiteUrl: "https://binance.com"
  },
  {
    id: 2,
    name: "Kraken",
    logo: "https://i.imgur.com/xuMoK1U.png",
    description: "Eine der ältesten und sichersten Kryptobörsen mit Sitz in den USA, bekannt für ihre fortschrittliche Handelsplattform und hohe Sicherheitsstandards.",
    metrics: "Verfügbar in über 190 Ländern mit über 9 Millionen Nutzern weltweit",
    websiteUrl: "https://kraken.com"
  },
  {
    id: 3,
    name: "Coinbase",
    logo: "https://i.imgur.com/KjpkQA8.png",
    description: "Eine der benutzerfreundlichsten und vertrauenswürdigsten Kryptobörsen für Einsteiger und institutionelle Anleger, börsennotiert an der NASDAQ.",
    metrics: "Über 110 Millionen verifizierte Nutzer und Assets im Wert von über 90 Milliarden USD",
    websiteUrl: "https://coinbase.com"
  },
  {
    id: 4,
    name: "KuCoin",
    logo: "https://i.imgur.com/qU4hUzq.png",
    description: "Eine innovative Kryptobörse mit umfangreichem Angebot an Altcoins und DeFi-Tokens, bekannt als \"People's Exchange\".",
    metrics: "Über 30 Millionen registrierte Nutzer in mehr als 200 Ländern und Regionen",
    websiteUrl: "https://kucoin.com"
  },
  {
    id: 5,
    name: "Bitfinex",
    logo: "https://i.imgur.com/Oor3vTT.png",
    description: "Eine führende Börse für fortgeschrittene Krypto-Trader mit hoher Liquidität und fortschrittlichen Trading-Features.",
    metrics: "Eine der ältesten Kryptobörsen, gegründet 2012, mit täglichem Handelsvolumen im Milliardenbereich",
    websiteUrl: "https://bitfinex.com"
  },
  {
    id: 6,
    name: "OKX",
    logo: "https://i.imgur.com/242nn00.png",
    description: "Eine der weltweit führenden Kryptobörsen mit umfassenden Dienstleistungen für Spot- und Derivatehandel sowie DeFi-Integration.",
    metrics: "Über 50 Millionen Nutzer weltweit mit täglichem Handelsvolumen von mehreren Milliarden USD",
    websiteUrl: "https://okx.com"
  }
];

const PartnersSection = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-casino-card/50 border border-gold/10 rounded-xl p-6 mb-8"
      >
        <p className="text-center text-gray-300">
          Unser KI-Trading-System nutzt die Liquidität und fortschrittlichen APIs der weltweit führenden Kryptobörsen, 
          um Ihnen die bestmögliche Performance und Zuverlässigkeit zu bieten. Durch diese technischen Anbindungen 
          kann unser Bot rund um die Uhr auf den globalen Kryptomärkten handeln.
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 gap-6">
        {exchanges.map((exchange, index) => (
          <ExchangeCard
            key={exchange.id}
            name={exchange.name}
            logo={exchange.logo}
            description={exchange.description}
            metrics={exchange.metrics}
            websiteUrl={exchange.websiteUrl}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default PartnersSection;
