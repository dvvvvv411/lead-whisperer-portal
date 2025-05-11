
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminNavbar } from "./AdminNavbar";
import { Pencil, Trash2, Save, Plus, X } from "lucide-react";

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export const CryptoWalletManager = () => {
  const { toast } = useToast();
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [addMode, setAddMode] = useState(false);
  const [newWallet, setNewWallet] = useState({ currency: "", wallet_address: "" });
  const [editWallet, setEditWallet] = useState<CryptoWallet | null>(null);

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

  const handleAddWallet = async () => {
    if (!newWallet.currency || !newWallet.wallet_address) {
      toast({
        title: "Eingabe fehlt",
        description: "Bitte geben Sie eine Währung und eine Wallet-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('crypto_wallets')
        .insert({ 
          currency: newWallet.currency.toUpperCase(), 
          wallet_address: newWallet.wallet_address 
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      setWallets([...wallets, data[0] as CryptoWallet]);
      setAddMode(false);
      setNewWallet({ currency: "", wallet_address: "" });
      
      toast({
        title: "Wallet hinzugefügt",
        description: `Die ${newWallet.currency.toUpperCase()} Wallet wurde erfolgreich hinzugefügt.`
      });
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Wallet:", error);
      toast({
        title: "Fehler",
        description: "Die Wallet konnte nicht hinzugefügt werden.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateWallet = async (id: string) => {
    if (!editWallet) return;

    try {
      const { error } = await supabase
        .from('crypto_wallets')
        .update({ 
          currency: editWallet.currency.toUpperCase(), 
          wallet_address: editWallet.wallet_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setWallets(wallets.map(wallet => 
        wallet.id === id ? 
          { ...wallet, currency: editWallet.currency.toUpperCase(), wallet_address: editWallet.wallet_address } : 
          wallet
      ));
      setEditMode(null);
      setEditWallet(null);
      
      toast({
        title: "Wallet aktualisiert",
        description: "Die Wallet wurde erfolgreich aktualisiert."
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Wallet:", error);
      toast({
        title: "Fehler",
        description: "Die Wallet konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteWallet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crypto_wallets')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setWallets(wallets.filter(wallet => wallet.id !== id));
      
      toast({
        title: "Wallet gelöscht",
        description: "Die Wallet wurde erfolgreich gelöscht."
      });
    } catch (error) {
      console.error("Fehler beim Löschen der Wallet:", error);
      toast({
        title: "Fehler",
        description: "Die Wallet konnte nicht gelöscht werden.",
        variant: "destructive"
      });
    }
  };

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
            setEditMode(null);
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
              <h2 className="text-xl font-medium mb-4">Neue Wallet hinzufügen</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new-currency" className="block text-sm font-medium mb-1">Währung</label>
                  <Input
                    id="new-currency"
                    value={newWallet.currency}
                    onChange={(e) => setNewWallet({...newWallet, currency: e.target.value})}
                    placeholder="BTC, ETH, ..."
                    maxLength={10}
                  />
                </div>
                <div>
                  <label htmlFor="new-address" className="block text-sm font-medium mb-1">Wallet-Adresse</label>
                  <Input
                    id="new-address"
                    value={newWallet.wallet_address}
                    onChange={(e) => setNewWallet({...newWallet, wallet_address: e.target.value})}
                    placeholder="Wallet-Adresse"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 gap-2">
                <Button variant="outline" onClick={() => {
                  setAddMode(false);
                  setNewWallet({ currency: "", wallet_address: "" });
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Abbrechen
                </Button>
                <Button onClick={handleAddWallet}>
                  <Save className="h-4 w-4 mr-2" />
                  Speichern
                </Button>
              </div>
            </div>
          )}

          {wallets.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Keine Wallets vorhanden. Fügen Sie eine neue Wallet hinzu.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Währung</th>
                    <th className="px-4 py-3 text-left">Wallet-Adresse</th>
                    <th className="px-4 py-3 text-left">Letzte Änderung</th>
                    <th className="px-4 py-3 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.map((wallet) => (
                    <tr key={wallet.id} className="border-t">
                      <td className="px-4 py-3">
                        {editMode === wallet.id ? (
                          <Input
                            value={editWallet?.currency || ""}
                            onChange={(e) => setEditWallet({...editWallet!, currency: e.target.value})}
                            maxLength={10}
                          />
                        ) : (
                          <span className="font-medium">{wallet.currency}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editMode === wallet.id ? (
                          <Input
                            value={editWallet?.wallet_address || ""}
                            onChange={(e) => setEditWallet({...editWallet!, wallet_address: e.target.value})}
                          />
                        ) : (
                          <code className="bg-gray-50 px-2 py-1 rounded">{wallet.wallet_address}</code>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(wallet.updated_at).toLocaleString('de-DE')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {editMode === wallet.id ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditMode(null);
                                setEditWallet(null);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateWallet(wallet.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setEditMode(wallet.id);
                                setEditWallet(wallet);
                                setAddMode(false);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteWallet(wallet.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
