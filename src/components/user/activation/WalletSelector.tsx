
import { useState } from "react";
import { Bitcoin, AlertCircle, Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
}

interface WalletSelectorProps {
  wallets: CryptoWallet[];
  walletsLoading: boolean;
  walletError: string | null;
  onSelectWallet: (currency: string, walletId?: string) => void;
  selectedWallet: string | null;
  onConfirmPayment: () => void;
  onRetryWallets: () => void;
}

const WalletSelector = ({
  wallets,
  walletsLoading,
  walletError,
  onSelectWallet,
  selectedWallet,
  onConfirmPayment,
  onRetryWallets
}: WalletSelectorProps) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  
  const handleWalletSelect = (currency: string) => {
    const wallet = wallets.find(w => w.currency === currency);
    if (wallet) {
      setSelectedWalletId(wallet.id);
      onSelectWallet(currency, wallet.id);
    } else {
      onSelectWallet(currency);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Zahlungsmethode auswählen</CardTitle>
        <CardDescription>Wählen Sie eine der verfügbaren Kryptowährungen</CardDescription>
      </CardHeader>
      <CardContent>
        {walletsLoading ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg flex flex-col items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
            <p>Zahlungsmethoden werden geladen...</p>
          </div>
        ) : walletError ? (
          <div className="text-center p-6 bg-red-50 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{walletError}</p>
            <Button variant="outline" className="mt-4" onClick={onRetryWallets}>
              Erneut versuchen
            </Button>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Keine Zahlungsmethoden verfügbar. Bitte kontaktieren Sie den Support.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Bitcoin className="h-6 w-6 mr-2 text-primary" />
              <h3 className="text-lg font-medium">Kryptowährungen</h3>
            </div>
            
            <Select onValueChange={handleWalletSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Kryptowährung auswählen" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.currency}>
                    {wallet.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedWallet && wallets.find(w => w.currency === selectedWallet) && (
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium mb-2">{selectedWallet} Wallet Adresse:</h4>
                <div className="bg-white p-3 rounded border break-all">
                  <code>{wallets.find(w => w.currency === selectedWallet)?.wallet_address}</code>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Bitte senden Sie genau 250€ in {selectedWallet} an die oben angegebene Adresse.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={onConfirmPayment} 
          disabled={!selectedWallet || wallets.length === 0 || walletsLoading || !!walletError}
          className="flex items-center"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Zahlung bestätigen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletSelector;
