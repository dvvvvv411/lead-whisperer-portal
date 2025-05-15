import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

interface NavLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
  to?: string;
}

const NavLink = ({ onClick, children, active = false, icon = null, to }: NavLinkProps) => {
  const linkContent = (
    <>
      {icon}
      {children}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300 ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}></span>
      {active && (
        <motion.span 
          className="absolute -right-2 -top-1 flex h-5 w-5"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold/30 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </motion.span>
      )}
    </>
  );

  // If we have a 'to' prop, use Link component from react-router-dom
  if (to) {
    return (
      <Link to={to}>
        <motion.span
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          className={`text-white hover:text-gold transition-colors relative group flex items-center ${
            active ? 'text-gold font-medium' : ''
          }`}
        >
          {linkContent}
        </motion.span>
      </Link>
    );
  }

  // Otherwise, use button for internal scrolling
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      className={`text-white hover:text-gold transition-colors relative group flex items-center ${
        active ? 'text-gold font-medium' : ''
      }`}
    >
      {linkContent}
    </motion.button>
  );
};

export default NavLink;
