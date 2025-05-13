
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "../AdminNavbar";
import { UserTable } from "./UserTable";
import { motion } from "framer-motion";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  role: string;
  activated: boolean;
  credit?: number | null;
  phone?: string | null;
}

export const UserManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
  const [isLeadsOnlyUser, setIsLeadsOnlyUser] = useState<boolean>(false);

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
          // Prüfen, ob es sich um den speziellen Leads-Only-Benutzer handelt
          setIsLeadsOnlyUser(data.user.id === "7eccf781-5911-4d90-a683-1df251069a2f");
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
        
        console.log(`Fetched ${usersData.length} users, now fetching credit and phone numbers for each...`);
        
        // Für jeden Benutzer das Guthaben und die Telefonnummer abrufen
        const usersWithExtras = await Promise.all(usersData.map(async (user) => {
          try {
            // Guthaben abrufen
            const { data: creditData, error: creditError } = await supabase
              .from('user_credits')
              .select('amount')
              .eq('user_id', user.id)
              .maybeSingle();
            
            // Telefonnummer aus der leads-Tabelle abrufen
            const { data: leadData, error: leadError } = await supabase
              .from('leads')
              .select('phone')
              .eq('email', user.email)
              .maybeSingle();
            
            // Konvertiere von Cent zu Euro für Guthaben
            const creditInEuros = (!creditError && creditData) 
              ? creditData.amount / 100 
              : 0;
            
            // Telefonnummer hinzufügen, falls vorhanden
            const phone = (!leadError && leadData && leadData.phone) 
              ? leadData.phone 
              : null;
            
            if (creditError && creditError.code !== 'PGRST116') {
              console.error(`Error fetching credit for user ${user.email}:`, creditError);
            }
            
            if (leadError && leadError.code !== 'PGRST116') {
              console.error(`Error fetching phone for user ${user.email}:`, leadError);
            }
            
            console.log(`User ${user.email}: Credit=${creditInEuros}€, Phone=${phone || 'not found'}`);
            
            return { ...user, credit: creditInEuros, phone };
          } catch (fetchError) {
            console.error(`Fehler beim Abrufen der Daten für ${user.email}:`, fetchError);
            return { ...user, credit: 0, phone: null };
          }
        }));
        
        setUsers(usersWithExtras);
        console.log("Users data with credit and phone numbers updated successfully");
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
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">Benutzerverwaltung</h1>
          <p className="text-gray-400">Eingeloggt als: {currentUser?.email}</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
                <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
              </div>
              <p>Wird geladen...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-casino-card p-6 rounded-lg border border-gold/10 shadow-lg">
              <UserTable users={users} onUserUpdated={handleUserUpdated} isLeadsOnlyUser={isLeadsOnlyUser} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
