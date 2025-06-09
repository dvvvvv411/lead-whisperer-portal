
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Wallet, TrendingDown, Menu, X, Home, Users2, Settings, Database } from "lucide-react";
import { AdminLogo } from "./AdminLogo";
import { LogoutButton } from "./LogoutButton";
import { motion, AnimatePresence } from "framer-motion";

export const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Leads", href: "/admin/leads", icon: Users },
    { name: "Benutzer", href: "/admin/nutzer", icon: Users2 },
    { name: "Einzahlungen", href: "/admin/einzahlungen", icon: Wallet },
    { name: "Auszahlungen", href: "/admin/auszahlungen", icon: TrendingDown },
    { name: "Affiliate", href: "/admin/affiliate", icon: Users2 },
    { name: "Crypto Wallets", href: "/admin/crypto-wallets", icon: Database },
    { name: "Rechtstexte", href: "/admin/rechtstexte", icon: Settings }
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-casino-darker border-b border-teal-500/30 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <AdminLogo />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                  isActive(item.href)
                    ? "bg-teal-500/20 text-teal-300"
                    : "text-gray-300 hover:bg-teal-500/10 hover:text-teal-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center space-x-4">
          <LogoutButton />
          
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-teal-300 hover:bg-teal-500/10 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-3 pb-3 border-t border-teal-500/30"
          >
            <div className="space-y-1 pt-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-teal-500/20 text-teal-300"
                        : "text-gray-300 hover:bg-teal-500/10 hover:text-teal-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
