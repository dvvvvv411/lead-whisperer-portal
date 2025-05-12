
import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import PartnersSection from "@/components/landing/PartnersSection";
import CtaBanner from "@/components/landing/CtaBanner";

const Partners = () => {
  return (
    <PageLayout 
      title="Unsere Partner" 
      description="Für eine zuverlässige Performance arbeitet unsere KI ausschließlich mit führenden internationalen Börsenplattformen zusammen."
    >
      <div className="max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-10 text-gray-300"
        >
          Hier finden Sie eine Übersicht über unsere unterstützten Anbieter, die uns den Zugang zu den weltweiten Kryptomärkten ermöglichen.
        </motion.p>
        
        <PartnersSection />
        
        <div className="mt-16">
          <CtaBanner />
        </div>
      </div>
    </PageLayout>
  );
};

export default Partners;
