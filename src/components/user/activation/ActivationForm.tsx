
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallets } from "@/hooks/useWallets";
import { Loader2 } from "lucide-react";

// Define the schema for activation form
const activationSchema = z.object({
  walletId: z.string().min(1, {
    message: "Bitte wählen Sie eine Wallet aus.",
  }),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'Um fortzufahren, müssen Sie die Bedingungen akzeptieren.'
  }),
});

// Define the type for the form data
type ActivationFormData = z.infer<typeof activationSchema>;

const ActivationForm = ({ user, creditThreshold, onStepChange }: { user: any, creditThreshold: number, onStepChange: (step: number) => void }) => {
  const [step, setStep] = useState<'welcome' | 'info' | 'wallets'>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Fetch crypto wallets for payment
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  
  // Get form from hook
  const form = useForm<ActivationFormData>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      walletId: '',
      agreeTerms: false
    }
  });

  // Update the parent component's step tracking
  useEffect(() => {
    const currentStepNumber = step === 'welcome' ? 0 : step === 'info' ? 1 : 2;
    onStepChange(currentStepNumber);
  }, [step, onStepChange]);
  
  // Handle proceed to information step
  const handleProceed = () => {
    setStep('info');
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === 'info') {
      setStep('welcome');
    } else if (step === 'wallets') {
      setStep('info');
    }
  };

  // Handle continue to wallet selection
  const handleContinueToWallets = () => {
    setStep('wallets');
    
    // Call fetchWallets before showing the wallet list
    fetchWallets();
  };

  // Send direct notification to Telegram with activation payment details
  const sendActivationNotification = async (amount: number, walletCurrency: string) => {
    try {
      // Create payload with all the information available at submission time
      const payload = {
        type: 'payment-activation',
        amount: amount,
        paymentMethod: walletCurrency,
        userEmail: user?.email || "Nicht angegeben"
      };
      
      console.log('Sending activation payment notification:', payload);
      
      // Call the simple-telegram-alert function with the payload
      const { data, error } = await supabase.functions.invoke('simple-telegram-alert', {
        body: payload
      });
      
      if (error) {
        console.error('Error sending telegram notification for activation:', error);
        return false;
      }
      
      console.log('Activation notification response:', data);
      return true;
    } catch (err) {
      console.error('Error sending activation payment notification:', err);
      return false;
    }
  };
  
  // Handle form submission
  const onSubmit = async (values: ActivationFormData) => {
    setIsSubmitting(true);
    
    try {
      const selectedWallet = wallets?.find(wallet => wallet.id === values.walletId);
      
      if (!selectedWallet) {
        throw new Error("Wallet nicht gefunden");
      }
      
      // Send notification BEFORE creating the DB record
      const notificationSent = await sendActivationNotification(creditThreshold, selectedWallet.currency);
      
      if (!notificationSent) {
        console.warn('Activation notification could not be sent, but continuing with activation');
      }
      
      // Create a payment record in the database
      const { data, error } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          user_email: user.email,
          amount: Math.round(creditThreshold * 100), // Convert to cents
          currency: 'EUR',
          wallet_id: values.walletId,
          wallet_currency: selectedWallet.currency,
          status: 'pending'
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setPaymentId(data.id);
        
        // Create a hidden input field to signal payment submission to the parent component
        const input = document.createElement('input');
        input.type = 'hidden';
        input.id = 'payment-submitted';
        input.value = data.id;
        document.body.appendChild(input);
        
        // Show confirmation dialog
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("Error creating payment:", error.message);
      const { toast } = useToast();
      toast({
        title: "Fehler bei der Aktivierung",
        description: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  // Render welcome step
  if (step === 'welcome') {
    return (
      <Card className="bg-black/40 backdrop-blur-md text-white border-gold/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent">
            Willkommen!
          </CardTitle>
          <CardDescription className="text-white/70">
            Starte jetzt mit deiner Kontoaktivierung.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/80">
            Um alle Funktionen freizuschalten, ist eine einmalige Aktivierungsgebühr von {creditThreshold}€ erforderlich.
          </p>
          <Button onClick={handleProceed} className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold">
            Fortfahren
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render information step
  if (step === 'info') {
    return (
      <Card className="bg-black/40 backdrop-blur-md text-white border-gold/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent">
            Informationen
          </CardTitle>
          <CardDescription className="text-white/70">
            Wähle deine bevorzugte Zahlungsmethode.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-white/80">
            Wähle eine der folgenden Optionen, um die Aktivierungsgebühr zu bezahlen:
          </p>
          <Button onClick={handleContinueToWallets} className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold">
            Weiter zur Zahlungsmethode
          </Button>
          <Button variant="ghost" onClick={handleBack} className="text-white/80 hover:text-white hover:bg-gold/20">
            Zurück
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Render wallet selection step
  return (
    <Card className="bg-black/40 backdrop-blur-md text-white border-gold/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gold-light to-amber-500 bg-clip-text text-transparent">
          Zahlungsmethode wählen
        </CardTitle>
        <CardDescription className="text-white/70">
          Wähle aus den verfügbaren Krypto-Wallets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletId">Krypto Wallet</Label>
            <Select 
              onValueChange={(value) => form.setValue("walletId", value)} 
              defaultValue={form.getValues("walletId")}
            >
              <SelectTrigger className="bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50">
                <SelectValue placeholder="Wähle eine Wallet" />
              </SelectTrigger>
              <SelectContent>
                {walletsLoading ? (
                  <SelectItem value="loading" disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Wird geladen...
                  </SelectItem>
                ) : walletError ? (
                  <SelectItem value="error" disabled>
                    Fehler beim Laden der Wallets
                  </SelectItem>
                ) : (
                  wallets?.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.currency} ({wallet.wallet_address.substring(0, 8)}...)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {form.formState.errors.walletId && (
              <p className="text-red-500 text-sm">{form.formState.errors.walletId?.message}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={form.getValues("agreeTerms")}
              onCheckedChange={(checked) => {
                form.setValue("agreeTerms", checked === true);
              }} 
              className="peer h-5 w-5 bg-black/30 border-gold/30 text-white placeholder:text-gray-400 focus:border-gold focus:ring-1 focus:ring-gold/50" 
            />
            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed text-white">
              Ich akzeptiere die <a href="/agb" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-gold-light">Allgemeinen Geschäftsbedingungen</a>
            </Label>
          </div>
          {form.formState.errors.agreeTerms && (
            <p className="text-red-500 text-sm">{form.formState.errors.agreeTerms?.message}</p>
          )}
          <Button disabled={isSubmitting} className="w-full bg-gradient-to-r from-gold to-amber-500 hover:from-amber-500 hover:to-gold">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Aktivierung wird durchgeführt...
              </>
            ) : (
              "Konto aktivieren"
            )}
          </Button>
          <Button variant="ghost" onClick={handleBack} className="text-white/80 hover:text-white hover:bg-gold/20">
            Zurück
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivationForm;
