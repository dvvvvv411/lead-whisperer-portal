
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import UserAuthWrapper from "@/components/user/auth/UserAuthWrapper";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import UserSettingsForm from "@/components/user/settings/UserSettingsForm";
import PasswordChangeForm from "@/components/user/settings/PasswordChangeForm";
import { ArrowLeft } from "lucide-react";

const UserSettings = () => {
  const navigate = useNavigate();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleGoBack = () => {
    navigate("/nutzer");
  };

  return (
    <UserAuthWrapper redirectTo="/admin" minCredit={0}>
      {(user) => (
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleGoBack} className="mr-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Zurück
              </Button>
              <h1 className="text-2xl font-bold">Kontoeinstellungen</h1>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil-Informationen</CardTitle>
                <CardDescription>Aktualisieren Sie Ihre persönlichen Daten</CardDescription>
              </CardHeader>
              <CardContent>
                <UserSettingsForm user={user} onSuccess={() => setUpdateSuccess(true)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Passwort ändern</CardTitle>
                <CardDescription>Aktualisieren Sie Ihr Passwort</CardDescription>
              </CardHeader>
              <CardContent>
                <PasswordChangeForm user={user} onSuccess={() => setUpdateSuccess(true)} />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Link to="/nutzer">
              <Button variant="outline">Zurück zum Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </UserAuthWrapper>
  );
};

export default UserSettings;
