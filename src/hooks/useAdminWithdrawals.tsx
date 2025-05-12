
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Withdrawal {
  id: string;
  user_id: string;
  user_email: string;
  amount: number;
  currency: string;
  wallet_currency: string;
  wallet_address: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useAdminWithdrawals() {
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    getUser();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);

      // Fetch withdrawals using the secure RPC function (admin only)
      const { data, error } = await supabase.rpc('get_all_withdrawals');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setWithdrawals(data as Withdrawal[]);
      }
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Auszahlungsdaten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  return {
    withdrawals,
    loading,
    fetchWithdrawals,
    user
  };
}
