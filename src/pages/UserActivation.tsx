
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Euro, Bitcoin, Check, CreditCard, AlertCircle, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface CryptoWallet {
  id: string;
  currency: string;
  wallet_address: string;
}

const UserActivation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (data?.user) {
          console.log("User found:", data.user.email);
          setUser(data.user);
          fetchWallets();
          
          // Check if the user has any pending payments
          checkPendingPayments(data.user.id);
        } else {
          console.log("No user found, redirecting to login");
          window.location.href = "/admin";
        }
      } catch (error: any) {
        console.error("Error getting user:", error.message);
        toast({
          title: "Fehler",
          description: "Es gab ein Problem beim Laden Ihrer Benutzerdaten.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [toast]);

  // Check if user has pending payments
  const checkPendingPayments = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setPaymentSubmitted(true);
        setPaymentId(data[0].id);
        
        // Start polling for payment status
        startPaymentStatusPolling(data[0].id);
      }
    } catch (error: any) {
      console.error("Error checking pending payments:", error.message);
    }
  };

  // Poll payment status every 15 seconds
  const startPaymentStatusPolling = (paymentId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('id', paymentId)
          .single();
        
        if (error) throw error;
        
        console.log("Payment status check:", data.status);
        
        if (data.status === 'completed') {
          clearInterval(pollInterval);
          toast({
            title: "Zahlung bestätigt",
            description: "Ihre Zahlung wurde bestätigt! Sie werden zum Dashboard weitergeleitet."
          });
          setTimeout(() => {
            navigate('/nutzer');
          }, 2000);
        } else if (data.status === 'rejected') {
          clearInterval(pollInterval);
          toast({
            title: "Zahlung abgelehnt",
            description: "Ihre Zahlung wurde abgelehnt. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
            variant: "destructive"
          });
          setPaymentSubmitted(false);
          setPaymentId(null);
        }
      } catch (error: any) {
        console.error("Error polling payment status:", error.message);
      }
    }, 15000); // Check every 15 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(pollInterval);
  };

  const fetchWallets = async () => {
    try {
      setWalletsLoading(true);
      setWalletError(null);
      
      console.log("Fetching crypto wallets...");
      const { data, error } = await supabase
        .from('crypto_wallets')
        .select('*')
        .order('currency');
      
      if (error) {
        console.error("Error fetching wallets:", error);
        throw error;
      }
      
      console.log("Fetched wallets:", data);
      if (data) {
        if (data.length === 0) {
          setWalletError("Keine Zahlungsmethoden verfügbar. Bitte kontaktieren Sie den Support.");
        } else {
          setWallets(data);
        }
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen der Wallets:", error);
      setWalletError("Die Zahlungsmethoden konnten nicht geladen werden: " + error.message);
      toast({
        title: "Fehler beim Laden",
        description: "Die Zahlungsmethoden konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setWalletsLoading(false);
      setLoading(false);
    }
  };

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

      if (paymentError) throw paymentError;

      toast({
        title: "Zahlung erfolgreich gemeldet",
        description: "Vielen Dank! Ihre Zahlung wurde erfolgreich gemeldet und wird überprüft.",
      });

      // Set payment as submitted and store payment ID
      setPaymentSubmitted(true);
      setPaymentId(data.id);
      
      // Start polling for payment status
      startPaymentStatusPolling(data.id);
      
    } catch (error: any) {
      console.error("Fehler bei der Zahlungsmeldung:", error);
      toast({
        title: "Zahlung fehlgeschlagen",
        description: "Es gab ein Problem bei der Zahlungsmeldung. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const handleRetryWallets = () => {
    fetchWallets();
  };
  
  // Prevent navigation when user tries to go back or forward
  useEffect(() => {
    if (paymentSubmitted) {
      // Block navigation attempts
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
        return '';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [paymentSubmitted]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Wird geladen...</p>
      </div>
    );
  }

  if (paymentSubmitted) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Zahlung wird überprüft</h1>
          <p className="text-gray-600">Bitte verlassen Sie diese Seite nicht, während Ihre Zahlung überprüft wird.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Zahlungsstatus</CardTitle>
            <CardDescription>
              Ihre Zahlungsmeldung wurde erfolgreich eingereicht und wird jetzt überprüft.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gray-50">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Wir überprüfen Ihre Zahlung</p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Dies kann bis zu 15 Minuten dauern. Bitte verlassen Sie diese Seite nicht.
              </p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  <strong>Wichtig:</strong> Bitte bleiben Sie auf dieser Seite, bis Ihre Zahlung bestätigt wurde. 
                  Sie werden automatisch weitergeleitet, sobald die Überprüfung abgeschlossen ist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Konto Aktivierung</h1>
        <p className="text-gray-600">Hallo {user?.email}, aktivieren Sie Ihr Konto, um Zugriff auf alle Funktionen zu erhalten.</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Premium Konto</span>
            <span className="text-2xl font-bold text-primary">250€</span>
          </CardTitle>
          <CardDescription>Einmalzahlung für den vollständigen Zugang</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Zugang zu allen Funktionen</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Unbegrenzte Nutzung</span>
            </li>
            <li className="flex items-center">
              <Check className="mr-2 h-5 w-5 text-green-500" />
              <span>Persönlicher Support</span>
            </li>
          </ul>
        </CardContent>
      </Card>

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
              <Button variant="outline" className="mt-4" onClick={handleRetryWallets}>
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
              
              <Select onValueChange={handleSelectWallet}>
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
            onClick={handleConfirmPayment} 
            disabled={!selectedWallet || wallets.length === 0 || walletsLoading || !!walletError}
            className="flex items-center"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Zahlung bestätigen
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zahlung bestätigen</DialogTitle>
            <DialogDescription>
              Haben Sie die Zahlung von 250€ in {selectedWallet} durchgeführt?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Abbrechen</Button>
            <Button onClick={handleCompletePayment}>
              Ja, ich habe bezahlt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserActivation;
