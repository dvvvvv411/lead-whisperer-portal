
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
import { CheckCircle } from "lucide-react";

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
  const [withdrawalSubmitted, setWithdrawalSubmitted] = useState(false);
  
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
    setWithdrawalSubmitted(true);
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
  
  if (withdrawalSubmitted) {
    return (
      <Card className="border-gold/20 bg-black/30 backdrop-blur-xl">
        <CardContent className="pt-8 pb-6 flex flex-col items-center">
          <div className="rounded-full bg-green-500/20 p-3 mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gold-light mb-2">Auszahlungsantrag eingereicht</h3>
          <p className="text-center text-white/80 mb-4">
            Ihre Auszahlungsanfrage wurde erfolgreich übermittelt und wird nun bearbeitet.
            Wir werden die Auszahlung so schnell wie möglich vornehmen.
          </p>
          <div className="bg-black/40 border border-gold/10 rounded-md p-4 w-full">
            <p className="text-sm text-white/70">
              <span className="text-gold-light">Hinweis:</span> Der Status Ihrer Auszahlung wird im Auszahlungsverlauf angezeigt.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-gold/20 bg-black/30 backdrop-blur-xl">
        <CardHeader className="border-b border-gold/10">
          <CardTitle className="text-gold-light">Guthaben auszahlen</CardTitle>
          <CardDescription className="text-white/70">
            Geben Sie den gewünschten Betrag und Ihre Krypto-Wallet-Adresse ein.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
              <AmountInput control={form.control} />
              
              <WalletSelector 
                control={form.control}
                wallets={wallets}
                onWalletChange={handleWalletChange}
              />
              
              <WalletAddressInput control={form.control} />
              
              <div className="text-sm text-white/70 mt-4 p-3 bg-black/20 rounded-md border border-gold/10">
                <p className="font-medium text-gold-light mb-2">Wichtige Hinweise:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Auszahlungen werden innerhalb von 24 Stunden bearbeitet.</li>
                  <li>Bitte stellen Sie sicher, dass die angegebene Wallet-Adresse korrekt ist.</li>
                  <li>Die Mindestbetrag für Auszahlungen beträgt 50€.</li>
                </ul>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold-light hover:to-gold-dark text-black font-medium" 
                disabled={walletsLoading}
              >
                Auszahlung beantragen
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border-gold/20 bg-black/80 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gold-light">Auszahlung bestätigen</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Sind Sie sicher, dass Sie {form.getValues().amount}€ in {selectedWalletCurrency} an folgende Adresse auszahlen möchten? <br />
              <span className="font-mono bg-black/40 px-2 py-0.5 mt-1 rounded border border-gold/10 text-white/90 inline-block mt-2 break-all">
                {form.getValues().walletAddress}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-gold/20 text-white/80 hover:bg-black/40">Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmWithdrawal}
              className="bg-gradient-to-r from-gold-dark to-gold-light hover:from-gold-light hover:to-gold-dark text-black font-medium"
            >
              Bestätigen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WithdrawalForm;
