
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import AdminLogo from "./AdminLogo";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  ArrowDownToLine, 
  Wallet, 
  FileText,
  LogOut,
  MessageSquare,
  Share2
} from "lucide-react";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Fehler beim Abmelden",
        description: error.message || "Ein Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/leads", label: "Leads", icon: MessageSquare },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/payments", label: "Payments", icon: CreditCard },
    { to: "/admin/withdrawals", label: "Withdrawals", icon: ArrowDownToLine },
    { to: "/admin/wallets", label: "Wallets", icon: Wallet },
    { to: "/admin/affiliate", label: "Affiliate", icon: Share2 },
    { to: "/admin/legal", label: "Legal", icon: FileText },
  ];

  return (
    <header className="w-full border-b border-gold/30 bg-casino-darker px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <AdminLogo />
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold/20 text-gold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-gold/30 text-gold hover:bg-gold hover:text-black"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Mobile navigation */}
      <nav className="lg:hidden mt-4 border-t border-gold/30 pt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-gold/20 text-gold"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-center">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
