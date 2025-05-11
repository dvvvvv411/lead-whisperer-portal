
import { useState, useEffect, useCallback } from "react";
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
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  // Benutzer-Session abrufen
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          throw error;
        }
        
        if (data?.user) {
          setCurrentUser(data.user);
        } else {
          // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
          window.location.href = "/admin";
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        toast({
          title: "Fehler beim Laden des Benutzers",
          description: "Ihre Sitzung könnte abgelaufen sein. Bitte melden Sie sich erneut an.",
          variant: "destructive"
        });
        
        // Redirect to login on error
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, [toast]);

  // Benutzer und deren Guthaben abrufen
  const fetchUsers = useCallback(async () => {
    try {
      console.log(`Fetching all users data... (update triggered at ${new Date().toISOString()})`);
      setIsLoading(true);
      
      // Benutzer aus der auth.users Tabelle abrufen (nur für Admins möglich)
      const { data, error } = await supabase.rpc('get_all_users');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const usersData = data as UserData[];
        
        console.log(`Fetched ${usersData.length} users, now fetching credit for each...`);
        
        // Für jeden Benutzer das Guthaben abrufen
        const usersWithCredit = await Promise.all(usersData.map(async (user) => {
          try {
            const { data: creditData, error: creditError } = await supabase
              .from('user_credits')
              .select('amount')
              .eq('user_id', user.id)
              .maybeSingle();
            
            if (!creditError && creditData) {
              // Konvertiere von Cent zu Euro
              const creditInEuros = creditData.amount / 100;
              console.log(`User ${user.email} has ${creditInEuros}€ credit (${creditData.amount} cents)`);
              return { ...user, credit: creditInEuros };
            } else {
              if (creditError && creditError.code !== 'PGRST116') {
                console.error(`Error fetching credit for user ${user.email}:`, creditError);
              } else {
                console.log(`No credit found for user ${user.email}, defaulting to 0`);
              }
              return { ...user, credit: 0 };
            }
          } catch (creditFetchError) {
            console.error(`Fehler beim Abrufen des Guthabens für ${user.email}:`, creditFetchError);
            return { ...user, credit: 0 };
          }
        }));
        
        setUsers(usersWithCredit);
        console.log("Users data with credit updated successfully");
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
  }, [toast]);
  
  // Function to trigger refresh with a timestamp to avoid stale data
  const handleUserUpdated = useCallback(() => {
    console.log("User update triggered, refreshing data...");
    setLastUpdateTime(Date.now());
  }, []);
  
  // Initial load of users and when lastUpdateTime changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, lastUpdateTime]);

  // Setup subscription for credit updates
  useEffect(() => {
    console.log("Setting up subscription for credit updates");
    
    const channel = supabase
      .channel('user_credits_changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_credits'
        },
        (payload) => {
          console.log('Credit change detected:', payload);
          // Use the timestamp approach to refresh
          handleUserUpdated();
        }
      )
      .subscribe();
    
    return () => {
      console.log("Cleaning up subscription");
      supabase.removeChannel(channel);
    };
  }, [handleUserUpdated]);

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
        <UserTable users={users} onUserUpdated={handleUserUpdated} />
      )}
    </div>
  );
};
