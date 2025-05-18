
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
  BarChart2,
  ArrowUp,
  Coins,
  DollarSign,
  TrendingUp,
  FileText,
  Inbox
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminStats } from "@/hooks/useAdminStats";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export const AdminDashboard = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { 
    leads, users, credits, payments, withdrawals, 
    isLoading: statsLoading, refresh: refreshStats 
  } = useAdminStats();

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

  // Animation for stat counters
  const countAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8"
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
            <CardTitle className="text-xl text-gray-200 flex items-center justify-between">
              <span>System Übersicht</span>
              {statsLoading ? (
                <Badge variant="outline" className="bg-gold/10 text-gold text-xs">
                  Wird geladen...
                </Badge>
              ) : (
                <Badge 
                  variant="outline" 
                  className="bg-green-900/20 text-green-400 text-xs cursor-pointer hover:bg-green-900/30"
                  onClick={refreshStats}
                >
                  Aktualisiert {new Date().toLocaleTimeString()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Leads Stats */}
              <div className="p-4 rounded-lg bg-casino-darker border border-blue-500/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Leads Gesamt</p>
                  <BarChart2 className="w-5 h-5 text-blue-400/60" />
                </div>
                <motion.p 
                  className="text-2xl font-bold text-blue-400" 
                  {...countAnimation}
                >
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 bg-blue-400/20 rounded animate-pulse"></span>
                  ) : leads.total.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">
                    {statsLoading ? (
                      <span className="inline-block h-3 w-10 bg-green-400/20 rounded animate-pulse"></span>
                    ) : leads.today}
                  </span>
                  <span className="text-xs text-gray-400">heute</span>
                </div>
              </div>

              {/* Users Stats */}
              <div className="p-4 rounded-lg bg-casino-darker border border-gold/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Benutzer Gesamt</p>
                  <Users className="w-5 h-5 text-gold/60" />
                </div>
                <motion.p 
                  className="text-2xl font-bold text-gold" 
                  {...countAnimation}
                >
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 bg-gold/20 rounded animate-pulse"></span>
                  ) : users.total.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">
                    {statsLoading ? (
                      <span className="inline-block h-3 w-10 bg-green-400/20 rounded animate-pulse"></span>
                    ) : users.today}
                  </span>
                  <span className="text-xs text-gray-400">heute</span>
                </div>
              </div>

              {/* Credits Stats */}
              <div className="p-4 rounded-lg bg-casino-darker border border-green-500/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Kundenguthaben Gesamt</p>
                  <Coins className="w-5 h-5 text-green-400/60" />
                </div>
                <motion.p 
                  className="text-2xl font-bold text-green-400" 
                  {...countAnimation}
                >
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 bg-green-400/20 rounded animate-pulse"></span>
                  ) : formatCurrency(credits.totalEur)}
                </motion.p>
              </div>

              {/* Payments Stats - Total Amount */}
              <div className="p-4 rounded-lg bg-casino-darker border border-purple-500/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Einzahlungen Gesamt</p>
                  <DollarSign className="w-5 h-5 text-purple-400/60" />
                </div>
                <motion.p 
                  className="text-2xl font-bold text-purple-400" 
                  {...countAnimation}
                >
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 bg-purple-400/20 rounded animate-pulse"></span>
                  ) : formatCurrency(payments.totalAmount)}
                </motion.p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">
                    {statsLoading ? (
                      <span className="inline-block h-3 w-10 bg-green-400/20 rounded animate-pulse"></span>
                    ) : formatCurrency(payments.todayAmount)}
                  </span>
                  <span className="text-xs text-gray-400">heute</span>
                </div>
              </div>

              {/* Payments Stats - Count */}
              <div className="p-4 rounded-lg bg-casino-darker border border-teal-500/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Anzahl Transaktionen</p>
                  <FileText className="w-5 h-5 text-teal-400/60" />
                </div>
                <motion.p 
                  className="text-2xl font-bold text-teal-400" 
                  {...countAnimation}
                >
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 bg-teal-400/20 rounded animate-pulse"></span>
                  ) : payments.total.toLocaleString()}
                </motion.p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">
                    {statsLoading ? (
                      <span className="inline-block h-3 w-10 bg-green-400/20 rounded animate-pulse"></span>
                    ) : payments.todayCount}
                  </span>
                  <span className="text-xs text-gray-400">heute</span>
                </div>
              </div>

              {/* Withdrawals Stats */}
              <div className="p-4 rounded-lg bg-casino-darker border border-blue-500/10 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">Offene Auszahlungen</p>
                  <Inbox className="w-5 h-5 text-blue-400/60" />
                </div>
                <motion.p 
                  className="text-2xl font-bold text-blue-400" 
                  {...countAnimation}
                >
                  {statsLoading ? (
                    <span className="inline-block h-8 w-16 bg-blue-400/20 rounded animate-pulse"></span>
                  ) : withdrawals.pendingCount.toLocaleString()}
                </motion.p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
