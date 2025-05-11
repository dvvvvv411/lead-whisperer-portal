import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Components
import PaymentInfoCard from "@/components/user/activation/PaymentInfoCard";
import WalletSelector from "@/components/user/activation/WalletSelector";
import PaymentConfirmationDialog from "@/components/user/activation/PaymentConfirmationDialog";

// Hooks
import { useWallets } from "@/hooks/useWallets";

interface ActivationFormProps {
  user: any;
  creditThreshold?: number;
}

const ActivationForm = ({ user, creditThreshold = 250 }: ActivationFormProps) => {
  const { toast } = useToast();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Custom hooks
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  const handleSelectWallet = (currency: string) => {
    setSelectedWallet(currency);
  };

  const handleConfirmPayment = () => {
    setShowConfirmDialog(true);
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Konto aktivieren</CardTitle>
          <CardDescription className="text-center">
            Zahlen Sie mindestens {creditThreshold}€ ein, um Ihr Konto zu aktivieren.
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
    </div>
  );
};

export default ActivationForm;
