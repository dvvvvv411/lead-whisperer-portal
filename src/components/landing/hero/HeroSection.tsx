
import { motion } from "framer-motion";
import BackgroundEffects from "./BackgroundEffects";
import HeroContent from "./HeroContent";
import ChartSection from "./ChartSection";
import CryptoIconBubbles from "./CryptoIconBubbles";

const HeroSection = () => {
  return (
    <section id="hero" className="py-20 px-4 relative overflow-hidden bg-[#0B0D0E]">
      <BackgroundEffects />
      
      {/* Hero content */}
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
          <HeroContent />
          <ChartSection />
          <CryptoIconBubbles />
        </div>
      </div>
      
      {/* Bottom gradient for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#12151E] to-transparent"></div>
    </section>
  );
};

export default HeroSection;
