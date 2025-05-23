
import { motion } from "framer-motion";
import BackgroundEffects from "./BackgroundEffects";
import HeroContent from "./HeroContent";
import ChartSection from "./ChartSection";
import CryptoIconBubbles from "./CryptoIconBubbles";

const HeroSection = () => {
  return (
    <section id="hero" className="py-36 md:py-40 px-4 relative overflow-hidden">
      <BackgroundEffects />
      
      {/* Hero content */}
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <HeroContent />
          <div className="md:col-span-2 relative">
            <ChartSection />
            <CryptoIconBubbles />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
