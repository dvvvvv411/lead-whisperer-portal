
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { WalletForm } from "./WalletForm";

export interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

interface WalletTableProps {
  wallets: CryptoWallet[];
  onWalletUpdated: () => void;
}

export const WalletTable = ({ wallets, onWalletUpdated }: WalletTableProps) => {
  const { toast } = useToast();
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editWallet, setEditWallet] = useState<CryptoWallet | null>(null);

  const handleDeleteWallet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crypto_wallets')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      onWalletUpdated();
      
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

  if (wallets.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Keine Wallets vorhanden. Fügen Sie eine neue Wallet hinzu.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {editMode && editWallet && (
        <WalletForm 
          mode="edit"
          walletId={editWallet.id}
          initialData={{
            currency: editWallet.currency,
            wallet_address: editWallet.wallet_address
          }}
          onCancel={() => {
            setEditMode(null);
            setEditWallet(null);
          }}
          onSuccess={() => {
            setEditMode(null);
            setEditWallet(null);
            onWalletUpdated();
          }}
        />
      )}

      <Table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead>Währung</TableHead>
            <TableHead>Wallet-Adresse</TableHead>
            <TableHead>Letzte Änderung</TableHead>
            <TableHead className="text-right">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet) => (
            <TableRow key={wallet.id}>
              <TableCell className="font-medium">{wallet.currency}</TableCell>
              <TableCell>
                <code className="bg-gray-50 px-2 py-1 rounded">{wallet.wallet_address}</code>
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {new Date(wallet.updated_at).toLocaleString('de-DE')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditMode(wallet.id);
                      setEditWallet(wallet);
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
