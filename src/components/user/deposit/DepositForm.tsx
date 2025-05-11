
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import PaymentConfirmationDialog from "@/components/user/activation/PaymentConfirmationDialog";

// Define form validation schema
const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(10, { message: "Mindesteinzahlung beträgt 10€" })
    .max(10000, { message: "Maximale Einzahlung beträgt 10.000€" }),
  walletCurrency: z.string().min(1, { message: "Bitte wählen Sie eine Kryptowährung" })
});

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
  onSubmit: (amount: number, walletCurrency: string) => void;
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
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
      walletCurrency: ""
    },
  });

  // Handle form submission
  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
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
    setShowConfirmation(true);
  };

  // Handle payment confirmation
  const handleConfirmPayment = () => {
    const values = form.getValues();
    onSubmit(values.amount, values.walletCurrency);
    setShowConfirmation(false);
  };

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Guthaben einzahlen</CardTitle>
          <CardDescription>
            Wählen Sie den Betrag und die Zahlungsmethode für Ihre Einzahlung
          </CardDescription>
        </CardHeader>
        <CardContent>
          {walletsLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Zahlungsmethoden werden geladen...</span>
            </div>
          ) : walletError ? (
            <div className="bg-red-50 p-4 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
              <div>
                <p className="text-red-800">{walletError}</p>
                <Button 
                  variant="outline" 
                  onClick={onRetryWallets} 
                  className="mt-2"
                >
                  Erneut versuchen
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Betrag (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="100" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="walletCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kryptowährung</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kryptowährung auswählen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {wallets.map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.currency}>
                              {wallet.currency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch("walletCurrency") && (
                  <div className="p-4 bg-gray-50 rounded-md border">
                    <h4 className="font-medium mb-2">Wallet Adresse für {form.watch("walletCurrency")}:</h4>
                    <div className="bg-white p-3 rounded border break-all">
                      <code>
                        {wallets.find(w => w.currency === form.watch("walletCurrency"))?.wallet_address}
                      </code>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Bitte senden Sie genau {form.watch("amount")}€ in {form.watch("walletCurrency")} an die oben angegebene Adresse.
                    </p>
                  </div>
                )}
                
                <Button type="submit" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Zahlung bestätigen
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
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
