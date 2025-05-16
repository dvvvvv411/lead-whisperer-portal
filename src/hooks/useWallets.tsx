
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
}

export const useWallets = () => {
  const { toast } = useToast();
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [walletError, setWalletError] = useState<string | null>(null);
  
  const fetchWallets = async () => {
    try {
      setWalletsLoading(true);
      setWalletError(null);
      
      console.log("Fetching crypto wallets...");
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .order('currency');
      
      if (error) {
        console.error("Error fetching wallets:", error);
        throw error;
      }
      
      console.log("Fetched wallets:", data);
      if (data) {
        if (data.length === 0) {
          setWalletError("Keine Zahlungsmethoden verfügbar. Bitte kontaktieren Sie den Support.");
        } else {
          setWallets(data);
        }
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen der Wallets:", error);
      setWalletError("Die Zahlungsmethoden konnten nicht geladen werden: " + error.message);
      toast({
        title: "Fehler beim Laden",
        description: "Die Zahlungsmethoden konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setWalletsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchWallets();
  }, [toast]);
  
  return { wallets, walletsLoading, walletError, fetchWallets };
};
