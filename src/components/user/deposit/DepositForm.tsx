
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaymentConfirmationDialog from "@/components/user/activation/PaymentConfirmationDialog";
import WalletSelector from "@/components/user/deposit/WalletSelector";
import WalletAddressDisplay from "@/components/user/deposit/WalletAddressDisplay";
import AmountInput from "@/components/user/deposit/AmountInput";
import WalletLoadingState from "@/components/user/deposit/WalletLoadingState";
import { depositFormSchema, DepositFormValues } from "@/components/user/deposit/depositFormSchema";

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
}

interface DepositFormProps {
  wallets: CryptoWallet[];
  walletsLoading: boolean;
  walletError: string | null;
  onRetryWallets: () => void;
  onSubmit: (amount: number, walletCurrency: string, walletId: string) => void;
}

const DepositForm = ({
  wallets,
  walletsLoading,
  walletError,
  onRetryWallets,
  onSubmit
}: DepositFormProps) => {
  const { toast } = useToast();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  
  // Initialize form with react-hook-form
  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: 100,
      walletCurrency: ""
    },
  });

  // Handle form submission
  const handleFormSubmit = (values: DepositFormValues) => {
    if (walletsLoading || walletError) {
      toast({
        title: "Zahlungsmethoden nicht geladen",
        description: "Bitte warten Sie, bis die Zahlungsmethoden geladen wurden.",
        variant: "destructive"
      });
      return;
    }
    
    const wallet = wallets.find(w => w.currency === values.walletCurrency);
    if (!wallet) {
      toast({
        title: "Fehler",
        description: "Bitte wählen Sie eine gültige Kryptowährung.",
        variant: "destructive"
      });
      return;
    }

    setSelectedWallet(values.walletCurrency);
    setSelectedWalletId(wallet.id);
    setShowConfirmation(true);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    const values = form.getValues();
    if (selectedWalletId) {
      onSubmit(values.amount, values.walletCurrency, selectedWalletId);
      setShowConfirmation(false);
    } else {
      toast({
        title: "Fehler",
        description: "Wallet ID konnte nicht ermittelt werden.",
        variant: "destructive"
      });
    }
  };

  // Handle wallet selection change to capture wallet ID
  const handleWalletChange = (currency: string) => {
    const wallet = wallets.find(w => w.currency === currency);
    if (wallet) {
      setSelectedWalletId(wallet.id);
      form.setValue("walletCurrency", currency);
    }
  };

  // Find the selected wallet address
  const selectedWalletAddress = 
    wallets.find(w => w.currency === form.watch("walletCurrency"))?.wallet_address || "";

  return (
    <>
      <WalletLoadingState 
        loading={walletsLoading} 
        error={walletError} 
        onRetry={onRetryWallets} 
      />
      
      {!walletsLoading && !walletError && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="space-y-4">
              <AmountInput control={form.control} />
              
              <WalletSelector 
                control={form.control} 
                wallets={wallets} 
                onWalletChange={handleWalletChange} 
              />
              
              {form.watch("walletCurrency") && (
                <WalletAddressDisplay 
                  currency={form.watch("walletCurrency")} 
                  address={selectedWalletAddress}
                  amount={form.watch("amount")}
                />
              )}
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-accent1 to-accent1-light hover:from-accent1-light hover:to-accent1"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Zahlung bestätigen
              </Button>
            </div>
          </form>
        </Form>
      )}
      
      <PaymentConfirmationDialog
        showDialog={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmPayment}
        selectedWallet={selectedWallet}
      />
    </>
  );
};

export default DepositForm;
