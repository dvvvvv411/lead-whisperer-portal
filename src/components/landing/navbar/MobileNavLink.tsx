
import { motion } from "framer-motion";
import React from "react";

interface MobileNavLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}

const MobileNavLink = ({ onClick, children, active = false }: MobileNavLinkProps) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`text-white hover:text-gold transition-colors py-2 px-4 rounded-md ${
      active ? 'bg-gold/10 text-gold font-medium border-l-2 border-gold' : ''
    }`}
  >
    {children}
  </motion.button>
);

export default MobileNavLink;
