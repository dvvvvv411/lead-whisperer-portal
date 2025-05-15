import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

interface MobileNavLinkProps {
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
  to?: string;
}

const MobileNavLink = ({ onClick, children, active = false, to }: MobileNavLinkProps) => {
  const linkContent = (
    <motion.span
      whileTap={{ scale: 0.95 }}
      className={`text-white hover:text-gold transition-colors py-2 px-4 rounded-md ${
        active ? 'bg-gold/10 text-gold font-medium border-l-2 border-gold' : ''
      }`}
    >
      {children}
    </motion.span>
  );

  // If we have a 'to' prop, use Link component from react-router-dom
  if (to) {
    return (
      <Link to={to} className="block">
        {linkContent}
      </Link>
    );
  }

  // Otherwise, use button for internal scrolling or other functions
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left"
    >
      {linkContent}
    </motion.button>
  );
};

export default MobileNavLink;
