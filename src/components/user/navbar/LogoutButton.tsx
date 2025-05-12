
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      window.location.href = "/admin";
    } catch (error: any) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className={cn(
        "border-gold/40 hover:bg-gold/20 text-white shadow-sm", 
        className
      )}
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span className="hidden md:inline">Abmelden</span>
    </Button>
  );
};

export default LogoutButton;
