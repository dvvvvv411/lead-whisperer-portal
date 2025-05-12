
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Menubar, 
  MenubarContent, 
  MenubarItem, 
  MenubarMenu, 
  MenubarTrigger 
} from "../ui/menubar";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Wallet, 
  CreditCard,
  ArrowUpRight,
  Menu
} from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

export const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full border-b border-gold/10 mb-6 bg-casino-darker/80 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto">
        <Menubar className="py-3 px-4 w-full bg-transparent border-none">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <img 
                src="https://i.imgur.com/lL2FhfD.png" 
                alt="KRYPTO AI Logo" 
                className="h-8 object-contain hidden md:block" 
              />
              <span className="text-gold font-bold text-lg hidden md:block">Admin Dashboard</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              <NavItem to="/admin" icon={<LayoutDashboard className="w-4 h-4 mr-2" />} label="Dashboard" />
              <NavItem to="/admin/leads" icon={<FileText className="w-4 h-4 mr-2" />} label="Leads" />
              <NavItem to="/admin/crypto-wallets" icon={<Wallet className="w-4 h-4 mr-2" />} label="Krypto Wallets" />
              <NavItem to="/admin/users" icon={<Users className="w-4 h-4 mr-2" />} label="Benutzer" />
              <NavItem to="/admin/payments" icon={<CreditCard className="w-4 h-4 mr-2" />} label="Zahlungen" />
              <NavItem to="/admin/withdrawals" icon={<ArrowUpRight className="w-4 h-4 mr-2" />} label="Auszahlungen" />
            </div>
            
            {/* Mobile Navigation Trigger */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gold hover:text-gold/80"
                onClick={() => setIsOpen(!isOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Menubar>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-casino-card border border-gold/10 rounded-lg shadow-lg p-2 mb-4 mx-2"
          >
            <MobileNavItem to="/admin" icon={<LayoutDashboard className="w-4 h-4 mr-2" />} label="Dashboard" onClick={() => setIsOpen(false)} />
            <MobileNavItem to="/admin/leads" icon={<FileText className="w-4 h-4 mr-2" />} label="Leads" onClick={() => setIsOpen(false)} />
            <MobileNavItem to="/admin/crypto-wallets" icon={<Wallet className="w-4 h-4 mr-2" />} label="Krypto Wallets" onClick={() => setIsOpen(false)} />
            <MobileNavItem to="/admin/users" icon={<Users className="w-4 h-4 mr-2" />} label="Benutzer" onClick={() => setIsOpen(false)} />
            <MobileNavItem to="/admin/payments" icon={<CreditCard className="w-4 h-4 mr-2" />} label="Zahlungen" onClick={() => setIsOpen(false)} />
            <MobileNavItem to="/admin/withdrawals" icon={<ArrowUpRight className="w-4 h-4 mr-2" />} label="Auszahlungen" onClick={() => setIsOpen(false)} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Desktop Navigation Item
const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg flex items-center text-sm font-medium transition-colors relative
        ${isActive 
          ? 'text-gold bg-gold/10' 
          : 'text-gray-300 hover:text-gold hover:bg-gold/5'}`
      }
    >
      {icon}
      {label}
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
          initial={false}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
};

// Mobile Navigation Item
const MobileNavItem = ({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) => {
  const isActive = window.location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-3 py-2 my-1 rounded-lg flex items-center text-sm font-medium transition-colors w-full
        ${isActive 
          ? 'text-gold bg-gold/10' 
          : 'text-gray-300 hover:text-gold hover:bg-gold/5'}`
      }
      onClick={onClick}
    >
      {icon}
      {label}
    </Link>
  );
};
