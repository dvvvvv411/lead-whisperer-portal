
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { withdrawalFormSchema, WithdrawalFormValues } from "./withdrawalFormSchema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AmountInput from "../deposit/AmountInput";
import WalletSelector from "../deposit/WalletSelector";
import WalletAddressInput from "./WalletAddressInput";
import WalletLoadingState from "../deposit/WalletLoadingState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WithdrawalFormProps {
  wallets: any[];
  walletsLoading: boolean;
  walletError: string | null;
  onRetryWallets: () => void;
  userCredit: number;
  onSubmit: (amount: number, walletCurrency: string, walletAddress: string) => void;
}

const WithdrawalForm = ({
  wallets,
  walletsLoading,
  walletError,
  onRetryWallets,
  userCredit,
  onSubmit
}: WithdrawalFormProps) => {
  const { toast } = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedWalletCurrency, setSelectedWalletCurrency] = useState<string>("");
  
  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: 50,
      walletCurrency: "",
      walletAddress: ""
    }
  });
  
  const handleWalletChange = (currency: string) => {
    setSelectedWalletCurrency(currency);
    form.setValue("walletCurrency", currency);
  };
  
  const onFormSubmit = (values: WithdrawalFormValues) => {
    // Check if user has enough credit
    if (values.amount > userCredit) {
      toast({
        title: "Unzureichendes Guthaben",
        description: `Sie haben nicht genügend Guthaben für diese Auszahlung. Ihr aktuelles Guthaben beträgt ${userCredit.toFixed(2)}€.`,
        variant: "destructive"
      });
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmDialog(true);
  };
  
  const confirmWithdrawal = () => {
    const values = form.getValues();
    onSubmit(values.amount, values.walletCurrency, values.walletAddress);
    setShowConfirmDialog(false);
  };

  if (walletsLoading || walletError) {
    return (
      <WalletLoadingState 
        loading={walletsLoading}
        error={walletError}
        onRetry={onRetryWallets}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Guthaben auszahlen</CardTitle>
          <CardDescription>
            Geben Sie den gewünschten Betrag und Ihre Krypto-Wallet-Adresse ein.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
              <AmountInput control={form.control} />
              
              <WalletSelector 
                control={form.control}
                wallets={wallets}
                onWalletChange={handleWalletChange}
              />
              
              <WalletAddressInput control={form.control} />
              
              <div className="text-sm text-gray-600 mt-4">
                <p>Wichtige Hinweise:</p>
                <ul className="list-disc pl-5 mt-2">
                  <li>Auszahlungen werden innerhalb von 24 Stunden bearbeitet.</li>
                  <li>Bitte stellen Sie sicher, dass die angegebene Wallet-Adresse korrekt ist.</li>
                  <li>Die Mindestbetrag für Auszahlungen beträgt 50€.</li>
                </ul>
              </div>
              
              <Button type="submit" className="w-full" disabled={walletsLoading}>
                Auszahlung beantragen
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Auszahlung bestätigen</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass Sie {form.getValues().amount}€ in {selectedWalletCurrency} an folgende Adresse auszahlen möchten? {form.getValues().walletAddress}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={confirmWithdrawal}>Bestätigen</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WithdrawalForm;
