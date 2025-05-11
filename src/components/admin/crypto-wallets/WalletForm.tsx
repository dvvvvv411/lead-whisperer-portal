
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface WalletFormProps {
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: { currency: string; wallet_address: string };
  mode: 'add' | 'edit';
  walletId?: string;
}

export const WalletForm = ({ onCancel, onSuccess, initialData, mode, walletId }: WalletFormProps) => {
  const { toast } = useToast();
  const [walletData, setWalletData] = useState({
    currency: initialData?.currency || "",
    wallet_address: initialData?.wallet_address || ""
  });

  const handleSubmit = async () => {
    if (!walletData.currency || !walletData.wallet_address) {
      toast({
        title: "Eingabe fehlt",
        description: "Bitte geben Sie eine Währung und eine Wallet-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (mode === 'add') {
        const { data, error } = await supabase
          .from('crypto_wallets')
          .insert({ 
            currency: walletData.currency.toUpperCase(), 
            wallet_address: walletData.wallet_address 
          })
          .select();
        
        if (error) throw error;
        
        toast({
          title: "Wallet hinzugefügt",
          description: `Die ${walletData.currency.toUpperCase()} Wallet wurde erfolgreich hinzugefügt.`
        });
      } else if (mode === 'edit' && walletId) {
        const { error } = await supabase
          .from('crypto_wallets')
          .update({ 
            currency: walletData.currency.toUpperCase(), 
            wallet_address: walletData.wallet_address,
            updated_at: new Date().toISOString()
          })
          .eq('id', walletId);
        
        if (error) throw error;
        
        toast({
          title: "Wallet aktualisiert",
          description: "Die Wallet wurde erfolgreich aktualisiert."
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error(`Fehler beim ${mode === 'add' ? 'Hinzufügen' : 'Aktualisieren'} der Wallet:`, error);
      toast({
        title: "Fehler",
        description: `Die Wallet konnte nicht ${mode === 'add' ? 'hinzugefügt' : 'aktualisiert'} werden.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
      <h2 className="text-xl font-medium mb-4">
        {mode === 'add' ? 'Neue Wallet hinzufügen' : 'Wallet bearbeiten'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="currency-input" className="block text-sm font-medium mb-1">Währung</label>
          <Input
            id="currency-input"
            value={walletData.currency}
            onChange={(e) => setWalletData({...walletData, currency: e.target.value})}
            placeholder="BTC, ETH, ..."
            maxLength={10}
          />
        </div>
        <div>
          <label htmlFor="wallet-address-input" className="block text-sm font-medium mb-1">Wallet-Adresse</label>
          <Input
            id="wallet-address-input"
            value={walletData.wallet_address}
            onChange={(e) => setWalletData({...walletData, wallet_address: e.target.value})}
            placeholder="Wallet-Adresse"
          />
        </div>
      </div>
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Abbrechen
        </Button>
        <Button onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Speichern
        </Button>
      </div>
    </div>
  );
};
