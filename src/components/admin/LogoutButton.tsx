
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
}

const LogoutButton = ({ className, variant = "outline" }: LogoutButtonProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      navigate("/admin");
    } catch (error: any) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button 
      variant={variant}
      onClick={handleLogout}
      className={cn(
        "border-gold/40 hover:bg-gold/20 text-white shadow-sm", 
        className
      )}
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">Abmelden</span>
    </Button>
  );
};

export default LogoutButton;
