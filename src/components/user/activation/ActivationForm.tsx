
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

// Components
import PaymentInfoCard from "@/components/user/activation/PaymentInfoCard";
import WalletSelector from "@/components/user/activation/WalletSelector";
import PaymentConfirmationDialog from "@/components/user/activation/PaymentConfirmationDialog";

// Hooks
import { useWallets } from "@/hooks/useWallets";

interface ActivationFormProps {
  user: any;
  creditThreshold?: number;
  onStepChange?: (step: number) => void;
}

const ActivationForm = ({ user, creditThreshold = 250, onStepChange }: ActivationFormProps) => {
  const { toast } = useToast();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Custom hooks
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  const handleSelectWallet = (currency: string) => {
    setSelectedWallet(currency);
    onStepChange?.(0); // Update to wallet selection step
  };

  const handleConfirmPayment = () => {
    setShowConfirmDialog(true);
    onStepChange?.(1); // Update to payment confirmation step
  };

  const handleCompletePayment = async () => {
    try {
      const selectedWalletObj = wallets.find(w => w.currency === selectedWallet);
      if (!selectedWalletObj) throw new Error("Keine gültige Wallet ausgewählt");
      
      if (!user || !user.id) {
        throw new Error("Benutzer nicht authentifiziert");
      }

      console.log("Inserting payment with user_id:", user.id);
      
      // Zahlung in der Datenbank speichern
      const { data, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          user_email: user.email,
          amount: 25000, // 250€ in Cent
          wallet_id: selectedWalletObj.id,
          wallet_currency: selectedWalletObj.currency,
          status: 'pending'
        })
        .select('id')
        .single();

      if (paymentError) {
        console.error("Payment error details:", paymentError);
        throw paymentError;
      }

      toast({
        title: "Zahlung erfolgreich gemeldet",
        description: "Vielen Dank! Ihre Zahlung wurde erfolgreich gemeldet und wird überprüft.",
      });

      // Set payment as submitted and store payment ID
      setPaymentSubmitted(true);
      setPaymentId(data.id);
      onStepChange?.(2); // Update to activation step
      
    } catch (error: any) {
      console.error("Fehler bei der Zahlungsmeldung:", error);
      toast({
        title: "Zahlung fehlgeschlagen",
        description: "Es gab ein Problem bei der Zahlungsmeldung: " + error.message,
        variant: "destructive"
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border-gold/20 bg-slate-900/60 shadow-xl">
        <CardHeader>
          <CardTitle className="text-center gradient-text">Konto aktivieren</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Zahlen Sie {creditThreshold}€ ein, um Ihr Konto zu aktivieren und mit KI-Trading zu beginnen.
          </CardDescription>
        </CardHeader>
        <PaymentInfoCard />
        
        <WalletSelector 
          wallets={wallets}
          walletsLoading={walletsLoading}
          walletError={walletError}
          selectedWallet={selectedWallet}
          onSelectWallet={handleSelectWallet}
          onConfirmPayment={handleConfirmPayment}
          onRetryWallets={fetchWallets}
        />

        <PaymentConfirmationDialog
          showDialog={showConfirmDialog}
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={handleCompletePayment}
          selectedWallet={selectedWallet}
        />
        
        {/* Return payment values to parent component */}
        {paymentSubmitted && paymentId && (
          <input type="hidden" id="payment-submitted" value={paymentId} />
        )}
      </Card>
    </motion.div>
  );
};

export default ActivationForm;
