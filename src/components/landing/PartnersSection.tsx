
import { motion } from "framer-motion";
import ExchangeCard from "./partners/ExchangeCard";

const exchanges = [
  {
    id: 1,
    name: "Binance",
    logo: "https://public.bnbstatic.com/20190405/eb2349c3-b2f8-4a93-a286-8f86a62ea9d8.png",
    websiteUrl: "https://binance.com"
  },
  {
    id: 2,
    name: "Kraken",
    logo: "https://www.theinvestorscentre.co.uk/wp-content/uploads/2023/11/kraken.jpeg",
    websiteUrl: "https://kraken.com"
  },
  {
    id: 3,
    name: "Coinbase",
    logo: "https://res.cloudinary.com/apideck/icons/coinbase",
    websiteUrl: "https://coinbase.com"
  },
  {
    id: 4,
    name: "KuCoin",
    logo: "https://s3-eu-west-1.amazonaws.com/tpd/logos/5a544749b894c90a88f69278/0x0.png",
    websiteUrl: "https://kucoin.com"
  },
  {
    id: 5,
    name: "Bitfinex",
    logo: "https://play-lh.googleusercontent.com/qIYACSe9ueSq2exLDNF4IDQ9GZ1IXof6KVcweJnNNsKa4-kG6vP02sJHILeOwLIO90s",
    websiteUrl: "https://bitfinex.com"
  },
  {
    id: 6,
    name: "OKX",
    logo: "https://www.l-iz.de/finanzen/wp-content/uploads/2023/03/Logo-OKX.png",
    websiteUrl: "https://okx.com"
  }
];

const PartnersSection = () => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {exchanges.map((exchange, index) => (
        <ExchangeCard
          key={exchange.id}
          name={exchange.name}
          logo={exchange.logo}
          websiteUrl={exchange.websiteUrl}
          index={index}
        />
      ))}
    </div>
  );
};

export default PartnersSection;
