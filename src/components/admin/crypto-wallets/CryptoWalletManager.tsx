
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminNavbar } from "../AdminNavbar";
import { Plus } from "lucide-react";
import { WalletTable, CryptoWallet } from "./WalletTable";
import { WalletForm } from "./WalletForm";
import { motion } from "framer-motion";

export const CryptoWalletManager = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [addMode, setAddMode] = useState(false);

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          console.log("CryptoWalletManager: User found", data.user.email);
          setCurrentUser(data.user);
        } else {
          console.log("CryptoWalletManager: No user found");
        }
      } catch (error) {
        console.error("CryptoWalletManager: Error getting user:", error);
      }
    };
    
    getUser();
  }, []);

  // Fetch wallets
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
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-green-300 to-green-400 bg-clip-text text-transparent">
              Krypto Wallet-Verwaltung
            </h1>
            <p className="text-gray-400">Eingeloggt als: {currentUser?.email}</p>
          </div>
          <Button 
            onClick={() => {
              setAddMode(true);
            }}
            disabled={addMode}
            className="flex items-center gap-2 bg-green-900/40 border border-green-500/30 hover:bg-green-800/30 text-green-300"
          >
            <Plus className="h-4 w-4" />
            Neue Wallet hinzufügen
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-green-500/20 rounded-full mb-4 flex items-center justify-center">
                <div className="h-6 w-6 bg-green-500/60 rounded-full animate-ping"></div>
              </div>
              <p>Wird geladen...</p>
            </div>
          </div>
        ) : (
          <>
            {addMode && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <div className="bg-casino-card border border-green-500/20 p-6 rounded-lg shadow-lg">
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
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="bg-casino-card p-6 rounded-lg border border-gold/10 shadow-lg">
                <WalletTable 
                  wallets={wallets} 
                  onWalletUpdated={fetchWallets} 
                />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
