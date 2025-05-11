
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LayoutDashboard, List, Menu, LogOut, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminDashboard = () => {
  const { toast } = useToast();
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      window.location.href = "/admin";
    } catch (error: any) {
      console.error("Fehler beim Abmelden:", error);
      toast({
        title: "Fehler beim Abmelden",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  const adminModules = [
    {
      title: "Leads",
      description: "Leads verwalten und bearbeiten",
      icon: <List className="w-10 h-10 text-blue-500" />,
      link: "/admin/leads"
    },
    {
      title: "Krypto Wallets",
      description: "Krypto Wallets verwalten",
      icon: <LayoutDashboard className="w-10 h-10 text-green-500" />,
      link: "/admin/crypto-wallets"
    },
    {
      title: "Benutzer",
      description: "Benutzerkonten verwalten",
      icon: <Menu className="w-10 h-10 text-orange-500" />,
      link: "/admin/users"
    },
    {
      title: "Zahlungen",
      description: "Zahlungen verwalten und bestätigen",
      icon: <LayoutDashboard className="w-10 h-10 text-purple-500" />,
      link: "/admin/payments"
    },
    {
      title: "Auszahlungen",
      description: "Auszahlungsanträge verwalten",
      icon: <Wallet className="w-10 h-10 text-teal-500" />,
      link: "/admin/withdrawals"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {currentUser && <p className="text-gray-600">Angemeldet als: {currentUser.email}</p>}
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Abmelden
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {adminModules.map((module) => (
          <Link to={module.link} key={module.title} className="block no-underline">
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <div className="p-2">{module.icon}</div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{module.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
