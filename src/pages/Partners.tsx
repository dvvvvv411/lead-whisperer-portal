
import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import PartnersSection from "@/components/landing/PartnersSection";
import IntroSection from "@/components/landing/partners/IntroSection";
import BackgroundEffects from "@/components/landing/partners/BackgroundEffects";
import CtaBanner from "@/components/landing/CtaBanner";

const Partners = () => {
  return (
    <PageLayout 
      title="Unsere Partner" 
      description="Für eine zuverlässige Performance arbeitet unsere KI ausschließlich mit führenden internationalen Börsenplattformen zusammen."
    >
      <div className="relative">
        <BackgroundEffects />
        
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-14 text-gray-300 max-w-3xl mx-auto"
          >
            Hier findest du eine einfache Anleitung zum Kauf deiner ersten Kryptowährungen sowie eine Übersicht über 
            unsere unterstützten Anbieter, die den Zugang zu den weltweiten Kryptomärkten ermöglichen.
          </motion.p>
          
          <IntroSection />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-white">
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                Unterstützte Börsen
              </span>
            </h2>
            <p className="text-center text-gray-300 max-w-3xl mx-auto mb-10">
              Unsere KI arbeitet mit den folgenden führenden Kryptobörsen zusammen, um dir den
              bestmöglichen Service zu bieten. Du kannst mit jeder dieser Börsen starten.
            </p>
          </motion.div>
          
          <PartnersSection />
          
          <div className="mt-16">
            <CtaBanner />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Partners;
