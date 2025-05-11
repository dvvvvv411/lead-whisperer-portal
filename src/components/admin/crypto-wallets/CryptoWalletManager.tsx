
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminNavbar } from "../AdminNavbar";
import { Plus } from "lucide-react";
import { WalletTable, CryptoWallet } from "./WalletTable";
import { WalletForm } from "./WalletForm";

export const CryptoWalletManager = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [addMode, setAddMode] = useState(false);

  // Benutzer-Session abrufen
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

  // Wallets abrufen
  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .order('currency');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setWallets(data as CryptoWallet[]);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Wallets:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Wallet-Daten konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load of wallets
  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold">Krypto Wallet-Verwaltung</h1>
          <p className="text-gray-600">Eingeloggt als: {user?.email}</p>
        </div>
        <Button 
          onClick={() => {
            setAddMode(true);
          }}
          disabled={addMode}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Neue Wallet hinzufügen
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Wird geladen...</p>
        </div>
      ) : (
        <>
          {addMode && (
            <WalletForm 
              mode="add"
              onCancel={() => {
                setAddMode(false);
              }}
              onSuccess={() => {
                setAddMode(false);
                fetchWallets();
              }}
            />
          )}

          <WalletTable 
            wallets={wallets} 
            onWalletUpdated={fetchWallets} 
          />
        </>
      )}
    </div>
  );
};
