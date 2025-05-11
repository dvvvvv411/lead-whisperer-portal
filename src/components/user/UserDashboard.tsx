
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UserDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setLoading(false);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Wird geladen...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Benutzer Dashboard</h1>
        <div className="flex items-center gap-2">
          {user && <span className="text-sm text-gray-600">Angemeldet als: {user.email}</span>}
          <Button variant="outline" onClick={handleLogout}>Abmelden</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Sie sind als regulärer Benutzer angemeldet. Diese Seite ist für zukünftige Benutzer-Features reserviert.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
