
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
      
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-4 text-white/80 hover:text-white hover:bg-gold/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zurück zum Dashboard
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent animate-gradient-shift">
            Kontoeinstellungen
          </h1>
          {userCredit !== null && (
            <p className="text-lg text-gold-light mt-2">
              Aktuelles Guthaben: {userCredit.toFixed(2)}€
            </p>
          )}
        </div>
        
        {/* Updated grid layout: 2 cards side by side, 1 banner below */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left column - Profile settings */}
          <Card className="backdrop-blur-xl bg-black/40 border-gold/20 overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] shadow-lg">
            <CardHeader className="bg-black/40 border-b border-gold/10">
              <CardTitle className="text-gold-light">Profil-Informationen</CardTitle>
              <CardDescription className="text-white/70">Aktualisieren Sie Ihre persönlichen Daten</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <UserSettingsForm user={user} onSuccess={() => setUpdateSuccess(true)} />
            </CardContent>
          </Card>
            
          {/* Right column - Password change */}
          <Card className="backdrop-blur-xl bg-black/40 border-gold/20 overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] shadow-lg">
            <CardHeader className="bg-black/40 border-b border-gold/10">
              <CardTitle className="text-gold-light">Passwort ändern</CardTitle>
              <CardDescription className="text-white/70">Aktualisieren Sie Ihr Passwort</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <PasswordChangeForm user={user} onSuccess={() => setUpdateSuccess(true)} />
            </CardContent>
          </Card>
        </div>
          
        {/* Full width banner for Security notice */}
        <div className="col-span-full">
          <Card className="backdrop-blur-xl bg-black/40 border-gold/20 overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] shadow-lg">
            <CardHeader className="bg-black/40 border-b border-gold/10">
              <CardTitle className="text-gold-light flex items-center">
                <Shield className="mr-2 h-5 w-5 text-gold-light" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gold-light to-amber-500">Sicherheitshinweise</span>
              </CardTitle>
              <CardDescription className="text-white/70">
                Informationen zur Sicherheit Ihres Kontos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <SecurityNotice />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
