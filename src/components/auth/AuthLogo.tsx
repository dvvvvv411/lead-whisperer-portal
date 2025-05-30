
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AuthLogo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8 flex flex-col items-center gap-4"
    >
      <Link to="/">
        <img 
          src="https://i.imgur.com/Q191f5z.png" 
          alt="KRYPTO AI Logo" 
          className="h-20 object-contain"
        />
      </Link>
      
      {/* Back to homepage button */}
      <Link 
        to="/"
        className="text-sm text-gold/80 hover:text-gold transition-colors flex items-center gap-1"
      >
        <span className="inline-block transform rotate-180">➔</span> Zurück zur Startseite
      </Link>
    </motion.div>
  );
};

export default AuthLogo;
