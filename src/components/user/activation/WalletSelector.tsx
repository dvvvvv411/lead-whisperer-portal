
import { useState, useEffect } from "react";
import { Bitcoin, AlertCircle, Loader2, CreditCard, Check, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

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
  remainingAmount?: number;
}

const WalletSelector = ({
  wallets,
  walletsLoading,
  walletError,
  onSelectWallet,
  selectedWallet,
  onConfirmPayment,
  onRetryWallets,
  remainingAmount = 250
}: WalletSelectorProps) => {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAffiliateCode = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: invitationData } = await supabase
          .from('affiliate_invitations')
          .select('affiliate_code')
          .eq('invited_user_id', data.session.user.id)
          .eq('bonus_paid_to_invited', true)
          .single();
        
        if (invitationData) {
          setAffiliateCode(invitationData.affiliate_code);
        }
      }
    };
    
    fetchAffiliateCode();
  }, []);
  
  const handleWalletSelect = (currency: string) => {
    const wallet = wallets.find(w => w.currency === currency);
    if (wallet) {
      setSelectedWalletId(wallet.id);
      onSelectWallet(currency, wallet.id);
    } else {
      onSelectWallet(currency);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-white">Zahlungsmethode auswählen</CardTitle>
        <CardDescription>Wählen Sie eine der verfügbaren Kryptowährungen</CardDescription>
      </CardHeader>
      <CardContent>
        {affiliateCode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 p-4 bg-green-900/20 border border-green-700/30 rounded-lg"
          >
            <div className="flex items-center mb-2">
              <Gift className="h-5 w-5 text-green-400 mr-2" />
              <h4 className="font-medium text-green-400">Einladungscode verwendet!</h4>
            </div>
            <p className="text-sm text-green-300">
              Sie haben den Einladungscode <span className="font-bold text-green-200">{affiliateCode}</span> verwendet und erhalten deshalb 50€ Startguthaben.
            </p>
          </motion.div>
        )}
        
        {walletsLoading ? (
          <div className="text-center p-6 bg-slate-800/50 rounded-lg flex flex-col items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gold mb-2" />
            <p className="text-gray-300">Zahlungsmethoden werden geladen...</p>
          </div>
        ) : walletError ? (
          <div className="text-center p-6 bg-red-900/20 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <p className="text-red-400">{walletError}</p>
            <Button variant="outline" className="mt-4" onClick={onRetryWallets}>
              Erneut versuchen
            </Button>
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center p-6 bg-slate-800/50 rounded-lg">
            <p className="text-gray-400">Keine Zahlungsmethoden verfügbar. Bitte kontaktieren Sie den Support.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center mb-4">
              <Bitcoin className="h-6 w-6 mr-2 text-gold" />
              <h3 className="text-lg font-medium text-white">Kryptowährungen</h3>
            </div>
            
            <Select onValueChange={handleWalletSelect}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 border border-slate-700 rounded-lg bg-slate-800"
              >
                <h4 className="font-medium mb-2 text-white">{selectedWallet} Wallet Adresse:</h4>
                <div className="bg-slate-900 p-3 rounded border border-slate-700 break-all relative">
                  <code className="text-gold text-sm">{wallets.find(w => w.currency === selectedWallet)?.wallet_address}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "absolute right-1 top-1 h-6 w-6 p-0", 
                      copied && "text-green-500"
                    )}
                    onClick={() => copyToClipboard(wallets.find(w => w.currency === selectedWallet)?.wallet_address || "")}
                  >
                    {copied ? <Check className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                  </Button>
                </div>
                <motion.p 
                  className="mt-4 text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Bitte senden Sie genau <span className="text-gold font-bold">{remainingAmount.toFixed(2)}€</span> in {selectedWallet} an die oben angegebene Adresse.
                </motion.p>
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={onConfirmPayment} 
          disabled={!selectedWallet || wallets.length === 0 || walletsLoading || !!walletError}
          className="bg-gold hover:bg-gold/80 text-black"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Zahlung bestätigen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalletSelector;
