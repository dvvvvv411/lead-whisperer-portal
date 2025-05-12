
import { motion } from "framer-motion";
import { useEffect } from "react";
import BackgroundEffects from "./BackgroundEffects";
import HeroContent from "./HeroContent";
import ChartSection from "./ChartSection";
import CryptoIconBubbles from "./CryptoIconBubbles";
import { useCryptos } from "@/hooks/useCryptos";

const HeroSection = () => {
  const { cryptos, loading, fetchCryptos } = useCryptos();

  // Automatische Aktualisierung alle 10 Minuten
  useEffect(() => {
    // Initial fetching
    fetchCryptos();
    
    // Alle 10 Minuten aktualisieren (600.000ms)
    const interval = setInterval(() => {
      fetchCryptos();
    }, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchCryptos]);

  return (
    <section id="hero" className="py-36 md:py-40 px-4 relative overflow-hidden">
      <BackgroundEffects />
      
      {/* Hero content */}
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <HeroContent />
          <ChartSection cryptoData={cryptos} isLoading={loading} />
          <CryptoIconBubbles cryptoData={cryptos} isLoading={loading} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
