
import { motion } from "framer-motion";
import React from "react";

interface NavLinkProps {
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
  icon?: React.ReactNode;
}

const NavLink = ({ onClick, children, active = false, icon = null }: NavLinkProps) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    className={`text-white hover:text-gold transition-colors relative group flex items-center ${
      active ? 'text-gold font-medium' : ''
    }`}
  >
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
  </motion.button>
);

export default NavLink;
