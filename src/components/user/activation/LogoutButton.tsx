
import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const LogoutButton = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      navigate("/");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Abmelden.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogout} 
      className="flex items-center gap-2 text-white"
      disabled={isLoggingOut}
    >
      <LogOut className="h-4 w-4" />
      <span>Abmelden</span>
    </Button>
  );
};

export default LogoutButton;
