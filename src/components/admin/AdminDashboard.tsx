
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LayoutDashboard, 
  List, 
  Wallet,
  Users,
  CreditCard,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      }
      setLoading(false);
    };
    
    getUser();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-darker text-gray-300">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
            <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
          </div>
          <p>Wird geladen...</p>
        </div>
      </div>
    );
  }

  const adminModules = [
    {
      title: "Leads",
      description: "Leads verwalten und bearbeiten",
      icon: <List className="w-12 h-12 text-blue-400" />,
      link: "/admin/leads",
      bgClass: "bg-gradient-to-br from-blue-900/40 to-blue-800/20"
    },
    {
      title: "Krypto Wallets",
      description: "Krypto Wallets verwalten",
      icon: <Wallet className="w-12 h-12 text-green-400" />,
      link: "/admin/crypto-wallets",
      bgClass: "bg-gradient-to-br from-green-900/40 to-green-800/20"
    },
    {
      title: "Benutzer",
      description: "Benutzerkonten verwalten",
      icon: <Users className="w-12 h-12 text-gold" />,
      link: "/admin/users",
      bgClass: "bg-gradient-to-br from-amber-900/40 to-amber-800/20"
    },
    {
      title: "Zahlungen",
      description: "Zahlungen verwalten und bestätigen",
      icon: <CreditCard className="w-12 h-12 text-purple-400" />,
      link: "/admin/payments",
      bgClass: "bg-gradient-to-br from-purple-900/40 to-purple-800/20"
    },
    {
      title: "Auszahlungen",
      description: "Auszahlungsanträge verwalten",
      icon: <ArrowUpRight className="w-12 h-12 text-teal-400" />,
      link: "/admin/withdrawals",
      bgClass: "bg-gradient-to-br from-teal-900/40 to-teal-800/20"
    },
    {
      title: "Rechtstexte",
      description: "Impressum und Rechtstexte bearbeiten",
      icon: <Info className="w-12 h-12 text-red-400" />,
      link: "/admin/rechtstexte",
      bgClass: "bg-gradient-to-br from-red-900/40 to-red-800/20"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">Admin Dashboard</h1>
          {currentUser && <p className="text-gray-400">Angemeldet als: {currentUser.email}</p>}
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {adminModules.map((module) => (
            <motion.div key={module.title} variants={item}>
              <Link to={module.link} className="block no-underline h-full">
                <Card className={`h-full hover:shadow-lg hover:shadow-gold/5 transition-all border-gold/10 bg-casino-card hover:border-gold/30 ${module.bgClass}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg text-gray-200">{module.title}</CardTitle>
                    <div className="p-2 rounded-full bg-casino-darker/50 backdrop-blur-sm">{module.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Stats Summary Card */}
        <Card className="border-gold/10 bg-casino-card bg-gradient-to-br from-casino-dark to-casino-card">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200">System Übersicht</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-casino-darker border border-gold/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Gesamt Benutzer</p>
                <p className="text-2xl font-bold text-gold">--</p>
              </div>
              <Users className="w-10 h-10 text-gold/40" />
            </div>
            <div className="p-4 rounded-lg bg-casino-darker border border-gold/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Aktive Wallets</p>
                <p className="text-2xl font-bold text-green-400">--</p>
              </div>
              <Wallet className="w-10 h-10 text-green-400/40" />
            </div>
            <div className="p-4 rounded-lg bg-casino-darker border border-gold/10 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Offene Auszahlungen</p>
                <p className="text-2xl font-bold text-blue-400">--</p>
              </div>
              <ArrowUpRight className="w-10 h-10 text-blue-400/40" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
