
import { motion } from "framer-motion";
import { Bitcoin } from "lucide-react";

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  image_url?: string | null;
}

interface CryptoIconBubblesProps {
  cryptoData: CryptoData[];
  isLoading: boolean;
}

// Fallback-Krypto-Icons für den Fall, dass keine Daten geladen werden
const fallbackCryptoIcons = [
  {
    name: "Bitcoin",
    icon: <Bitcoin className="h-6 w-6 text-[#F7931A]" />,
    color: "from-[#F7931A]/30 to-[#F7931A]/5",
    delay: 0,
  },
  {
    name: "Ethereum",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24" fill="#627EEA">
        <path fillOpacity=".5" d="M16 4v8.8l7.2 3.2L16 4z" />
        <path fillOpacity=".5" d="M16 4L8.8 16l7.2-3.2V4z" />
        <path fillOpacity=".8" d="M16 21.7V28l7.2-10-7.2 3.7z" />
        <path fillOpacity=".8" d="M16 28v-6.3l-7.2-3.7L16 28z" />
        <path fillOpacity=".8" d="M16 20l7.2-4.2-7.2-3.2V20z" />
        <path fillOpacity=".8" d="M8.8 15.8L16 20v-7.4l-7.2 3.2z" />
      </svg>
    ),
    color: "from-[#627EEA]/30 to-[#627EEA]/5",
    delay: 2,
  },
  {
    name: "Ripple",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="16" cy="16" r="16" fill="#23292F" />
        <path d="M22.1 9.7c.6 0 1.1.2 1.5.6.4.3.6.8.6 1.4 0 .6-.2 1-.6 1.4-.4.4-.9.6-1.5.6s-1.1-.2-1.5-.6c-.4-.4-.6-.8-.6-1.4 0-.6.2-1 .6-1.4.4-.4.9-.6 1.5-.6zm-12.2 0c.6 0 1.1.2 1.5.6.4.3.6.8.6 1.4 0 .6-.2 1-.6 1.4-.4.4-.9.6-1.5.6s-1.1-.2-1.5-.6c-.4-.4-.6-.8-.6-1.4 0-.6.2-1 .6-1.4.4-.4.9-.6 1.5-.6zm6.1 3.2c.5 0 1 .1 1.4.4.4.3.6.7.6 1.1 0 .4-.2.8-.6 1.1-.4.3-.9.4-1.4.4-.5 0-1-.1-1.4-.4-.4-.3-.6-.7-.6-1.1 0-.4.2-.8.6-1.1.4-.3.9-.4 1.4-.4zm9.9 4.1c.4.4.5.9.5 1.5s-.1 1.1-.5 1.5c-.3.4-.8.6-1.3.6-.5 0-1-.2-1.3-.6-.4-.4-.5-.9-.5-1.5s.1-1.1.5-1.5c.3-.4.8-.6 1.3-.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6zM10 17c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6zm9.8 0c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6z" fill="#23292F" />
        <path fill="#fff" d="M17.1 12.9c.5 0 1 .1 1.4.4.4.3.6.7.6 1.1 0 .4-.2.8-.6 1.1-.4.3-.9.4-1.4.4-.5 0-1-.1-1.4-.4-.4-.3-.6-.7-.6-1.1 0-.4.2-.8.6-1.1.4-.3.9-.4 1.4-.4zm9.3 5.6c-.3.4-.8.6-1.3.6-.5 0-1-.2-1.3-.6-.3-.4-.5-.9-.5-1.4s.2-1 .5-1.4c.3-.4.8-.6 1.3-.6.5 0 1 .2 1.3.6.3.4.5.9.5 1.4s-.2 1-.5 1.4zM10 17c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6zm1-5.8c-.3.3-.4.7-.4 1.1 0 .4.1.8.4 1.1.3.3.6.4 1.1.4.4 0 .8-.1 1.1-.4.3-.3.4-.7.4-1.1 0-.4-.1-.8-.4-1.1-.3-.3-.6-.4-1.1-.4-.5.1-.8.2-1.1.4zm8.8 5.8c-.3.4-.5.9-.5 1.4s.2 1 .5 1.4c.3.4.8.6 1.3.6.5 0 .9-.2 1.3-.6.3-.4.5-.9.5-1.4s-.2-1-.5-1.4c-.3-.4-.8-.6-1.3-.6-.5 0-.9.2-1.3.6z" />
      </svg>
    ),
    color: "from-[#23292F]/30 to-[#23292F]/5",
    delay: 1.5,
  },
  {
    name: "Cardano",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="16" cy="16" r="16" fill="#0033AD" />
        <path d="M18.8 7.2a.9.9 0 11-1.8.1.9.9 0 011.8-.1zM21 8.4a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm2 1.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.7 1.8a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-8.3.1a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm1.7-3a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm5.3 6.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.2 2.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.8 2.4a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.2 2.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-.5 2.4a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1 2.3a.9.9 0 11-1.8.1.9.9 0 111.7-.1zm-1.6 2a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2 1.5a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.3 1a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.4.3a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.5-.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-2.3-1a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm-2-1.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1.6-2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1-2.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-.5-2.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.2-2.3a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm.8-2.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.2-2.2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm1.7-2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm2-1.4a.9.9 0 11-1.7.1.9.9 0 111.8-.1zm-5.7 7.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm12.3 5.7a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm4.2-5.5a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-3-7.2a.9.9 0 11-1.7.2.9.9 0 111.8-.2zM13 17a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-2.4-5.2a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm4.7-2.4a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-1.3 4.1a.9.9 0 11-1.7.1.9.9 0 111.7-.1zm2.4 2.2a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm2.5-2.4a.9.9 0 11-1.7.2.9.9 0 111.7-.2zm-1.3-4a.9.9 0 11-1.7.1.9.9 0 111.7-.2zm4.8 2.5a.9.9 0 11-1.8.1.9.9 0 111.8-.1zm-2.3 5.1a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-7.4 4.4a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm5 .1a.9.9 0 11-1.8.2.9.9 0 111.8-.2zm-2.5-2a.9.9 0 11-1.7.2.9.9 0 111.7-.2z" fill="#fff" />
      </svg>
    ),
    color: "from-[#0033AD]/30 to-[#0033AD]/5",
    delay: 3.5,
  },
  {
    name: "Litecoin",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
        <circle cx="16" cy="16" r="16" fill="#BFBBBB" />
        <path fill="#fff" d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z" />
      </svg>
    ),
    color: "from-[#BFBBBB]/30 to-[#BFBBBB]/5",
    delay: 4,
  }
];

const CryptoIconBubbles = ({ cryptoData, isLoading }: CryptoIconBubblesProps) => {
  // Verwende echte Daten, wenn vorhanden, sonst Fallback
  const iconsToDisplay = !isLoading && cryptoData.length > 0
    ? cryptoData.slice(0, 5).map((crypto, index) => {
        // Bestimme Farbe basierend auf Symbol
        let color = "from-[#9b87f5]/30 to-[#9b87f5]/5";
        if (crypto.symbol === "BTC") color = "from-[#F7931A]/30 to-[#F7931A]/5";
        if (crypto.symbol === "ETH") color = "from-[#627EEA]/30 to-[#627EEA]/5";
        if (crypto.symbol === "XRP") color = "from-[#23292F]/30 to-[#23292F]/5";
        if (crypto.symbol === "ADA") color = "from-[#0033AD]/30 to-[#0033AD]/5";
        if (crypto.symbol === "LTC") color = "from-[#BFBBBB]/30 to-[#BFBBBB]/5";
        
        // Generiere Icon basierend auf Symbol
        let icon;
        if (crypto.symbol === "BTC") {
          icon = <Bitcoin className="h-6 w-6 text-[#F7931A]" />;
        } else if (crypto.image_url) {
          // Wenn ein Bild-URL vorhanden ist
          icon = <img src={crypto.image_url} alt={crypto.name} className="h-6 w-6" />;
        } else {
          // Fallback für Symbole ohne Icon
          icon = (
            <div className="h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
              {crypto.symbol.slice(0, 2)}
            </div>
          );
        }
        
        return {
          name: crypto.name,
          icon: icon,
          color: color,
          delay: index * 0.8
        };
      })
    : fallbackCryptoIcons;

  return (
    <>
      {/* Animated cryptocurrency bubbles around the chart */}
      {iconsToDisplay.map((crypto, index) => (
        <motion.div
          key={crypto.name}
          className={`absolute z-10 rounded-full bg-gradient-to-r ${crypto.color} p-3 backdrop-blur-sm border border-white/10 shadow-lg`}
          initial={{ 
            opacity: 0,
            scale: 0 
          }}
          animate={{ 
            x: [0, 10 * (index % 2 === 0 ? 1 : -1), 0],
            y: [0, 15 * (index % 3 === 0 ? 1 : -1), 0],
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 1 + crypto.delay * 0.3,
            duration: 3 + index,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: "easeInOut"
          }}
          style={{
            // Position bubbles only around the chart
            top: `${(index * 20 + 10) % 100}%`,
            left: index % 2 === 0 
              ? `${index < 2 ? -10 : 105}%` 
              : `${index < 3 ? 105 : -10}%`,
          }}
          whileHover={{
            scale: 1.2,
            boxShadow: "0 0 15px rgba(155,135,245,0.5)"
          }}
        >
          {crypto.icon}
        </motion.div>
      ))}
    </>
  );
};

export default CryptoIconBubbles;
