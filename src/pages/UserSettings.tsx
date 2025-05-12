
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UserSettingsForm from "@/components/user/settings/UserSettingsForm";
import PasswordChangeForm from "@/components/user/settings/PasswordChangeForm";
import { ArrowLeft, Shield } from "lucide-react";
import UserNavbar from "@/components/user/UserNavbar";
import { useUserCredit } from "@/hooks/useUserCredit";
import SecurityNotice from "@/components/user/settings/SecurityNotice";

const UserSettings = () => {
  const navigate = useNavigate();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userCredit } = useUserCredit(user?.id);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getUser();
        
        if (data?.user) {
          setUser(data.user);
        } else {
          navigate("/admin");
        }
      } catch (error) {
        console.error("Error checking user:", error);
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [navigate]);

  const handleGoBack = () => {
    navigate("/nutzer");
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-casino-dark dark">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-gold/70 border-casino-card animate-spin mb-4"></div>
          <p className="text-gold/70">Wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-casino-dark dark">
      <UserNavbar userId={user?.id} userEmail={user?.email} />
      
      <div className="container mx-auto p-4 flex-1 relative overflow-hidden">
        <div className="absolute top-20 left-0 w-96 h-96 bg-gold/5 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-0 w-80 h-80 bg-accent1/5 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="flex items-center mb-6 relative z-10">
          <Button 
            variant="outline" 
            onClick={handleGoBack} 
            className="mr-2 border-gold/20 hover:bg-black/20 hover:border-gold/40 text-gold-light"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
            Kontoeinstellungen
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Card className="backdrop-blur-xl bg-black/30 border-gold/10 overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] shadow-lg">
            <CardHeader className="bg-black/40 border-b border-gold/10">
              <CardTitle className="text-gold-light">Profil-Informationen</CardTitle>
              <CardDescription className="text-white/70">Aktualisieren Sie Ihre persönlichen Daten</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <UserSettingsForm user={user} onSuccess={() => setUpdateSuccess(true)} />
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-black/30 border-gold/10 overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] shadow-lg">
            <CardHeader className="bg-black/40 border-b border-gold/10">
              <CardTitle className="text-gold-light">Passwort ändern</CardTitle>
              <CardDescription className="text-white/70">Aktualisieren Sie Ihr Passwort</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <PasswordChangeForm user={user} onSuccess={() => setUpdateSuccess(true)} />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 relative z-10">
          <SecurityNotice />
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
