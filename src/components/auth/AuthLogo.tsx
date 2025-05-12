
import { motion } from "framer-motion";

const AuthLogo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-8"
    >
      <img 
        src="https://i.imgur.com/hNtMxev.png" 
        alt="KRYPTO AI Logo" 
        className="h-16 object-contain"
      />
    </motion.div>
  );
};

export default AuthLogo;
