
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroContent = () => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      className="md:col-span-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {/* Don't display this badge on mobile since it's now in the navbar */}
      {!isMobile && (
        <motion.div 
          className="inline-flex items-center rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.1)" }}
        >
          <span className="text-gold flex items-center gap-2 text-sm">
            <TrendingUp className="h-3.5 w-3.5" /> KI-gestütztes Trading
          </span>
        </motion.div>
      )}
      
      <div className="mb-6">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.span 
            className="block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Revolutioniere dein
          </motion.span>
          
          {/* Gold text with shine effect */}
          <motion.span 
            className="block text-gold relative overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{ position: 'relative' }}
          >
            Krypto-Trading
            
            {/* Shine effect overlay */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                repeat: Infinity, 
                repeatDelay: 4,
                duration: 1.5,
                ease: "easeInOut"
              }}
              style={{ 
                mixBlendMode: 'overlay', 
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
              }}
            />
          </motion.span>
          
          <motion.span 
            className="block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            mit KI-Technologie
          </motion.span>
        </motion.h1>
      </div>
      
      <motion.p
        className="text-lg text-gray-300 mb-8 max-w-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        Unser fortschrittlicher KI-Algorithmus analysiert Markttrends in Echtzeit und führt automatisch profitable Trades durch. Erziele bis zu 15% monatliche Rendite - vollständig automatisiert.
      </motion.p>
      
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
      >
        {/* Enhanced CTA button with pulse and glow effect - fixing size for consistency */}
        <motion.div
          whileHover={{ scale: isMobile ? 1 : 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full sm:w-auto"
        >
          <motion.div
            className="absolute inset-0 rounded-md bg-gold/30"
            animate={{ 
              boxShadow: ["0 0 0px rgba(255, 215, 0, 0)", "0 0 20px rgba(255, 215, 0, 0.7)", "0 0 0px rgba(255, 215, 0, 0)"]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          />
          <Button 
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full bg-gold hover:bg-gold/90 text-black font-medium text-base px-6 py-5 rounded-md shadow-lg border border-transparent transition-all duration-300 relative z-10"
          >
            <motion.span
              animate={{
                x: [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="flex items-center gap-2"
            >
              Jetzt starten <ArrowRight className="h-4 w-4" />
            </motion.span>
          </Button>
        </motion.div>
        
        <Button 
          onClick={() => document.getElementById("benefits")?.scrollIntoView({ behavior: "smooth" })}
          variant="outline"
          className="w-full border-gold/30 text-gold hover:bg-gold/5 text-base px-6 py-5 rounded-md transition-all duration-300"
        >
          Mehr erfahren
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
