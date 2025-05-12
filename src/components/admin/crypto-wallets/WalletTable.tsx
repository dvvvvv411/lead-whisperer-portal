
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { WalletForm } from "./WalletForm";
import { motion } from "framer-motion";

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
      <div className="text-center p-10 bg-casino-darker rounded-lg border border-gold/10">
        <p className="text-gray-400">Keine Wallets vorhanden. Fügen Sie eine neue Wallet hinzu.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      {editMode && editWallet && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="bg-casino-darker border border-green-500/20 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4 text-green-400">Wallet bearbeiten</h3>
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
          </div>
        </motion.div>
      )}

      <Table className="min-w-full rounded-lg overflow-hidden">
        <TableHeader className="bg-casino-darker border-b border-gold/10">
          <TableRow>
            <TableHead className="text-gray-300">Währung</TableHead>
            <TableHead className="text-gray-300">Wallet-Adresse</TableHead>
            <TableHead className="text-gray-300">Letzte Änderung</TableHead>
            <TableHead className="text-right text-gray-300">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {wallets.map((wallet, index) => (
            <motion.tr 
              key={wallet.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-t border-gold/10 hover:bg-casino-highlight"
            >
              <TableCell className="font-medium text-green-400">{wallet.currency}</TableCell>
              <TableCell>
                <code className="bg-casino-darker px-2 py-1 rounded text-gray-300 text-xs">{wallet.wallet_address}</code>
              </TableCell>
              <TableCell className="text-sm text-gray-400">
                {new Date(wallet.updated_at).toLocaleString('de-DE')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-blue-900/20 border-blue-500/30 hover:bg-blue-800/30 text-blue-400"
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
                    className="bg-red-900/20 border-red-500/30 hover:bg-red-800/30 text-red-400"
                    onClick={() => handleDeleteWallet(wallet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
