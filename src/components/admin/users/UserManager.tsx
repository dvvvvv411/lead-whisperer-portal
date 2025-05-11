
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "../AdminNavbar";
import { UserTable } from "./UserTable";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  activated: boolean;
  credit?: number | null;
}

export const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Benutzer-Session abrufen
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, []);

  // Benutzer und deren Guthaben abrufen
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Benutzer aus der auth.users Tabelle abrufen (nur für Admins möglich)
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const usersData = data as UserData[];
        
        // Für jeden Benutzer das Guthaben abrufen
        for (const user of usersData) {
          try {
            const { data: creditData, error: creditError } = await supabase
              .from('user_credits')
              .select('amount')
              .eq('user_id', user.id)
              .single();
            
            if (!creditError && creditData) {
              // Konvertiere von Cent zu Euro
              user.credit = creditData.amount / 100;
            } else {
              user.credit = 0;
            }
          } catch (creditFetchError) {
            console.error(`Fehler beim Abrufen des Guthabens für ${user.email}:`, creditFetchError);
            user.credit = 0;
          }
        }
        
        setUsers(usersData);
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen der Benutzer:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Benutzerdaten konnten nicht geladen werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load of users
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
        <p className="text-gray-600">Eingeloggt als: {currentUser?.email}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Wird geladen...</p>
        </div>
      ) : (
        <UserTable users={users} onUserUpdated={fetchUsers} />
      )}
    </div>
  );
};
