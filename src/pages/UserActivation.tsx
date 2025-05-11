import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Custom hooks
import { useWallets } from "@/hooks/useWallets";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

// Components
import PaymentInfoCard from "@/components/user/activation/PaymentInfoCard";
import WalletSelector from "@/components/user/activation/WalletSelector";
import PaymentConfirmationDialog from "@/components/user/activation/PaymentConfirmationDialog";
import PaymentStatusView from "@/components/user/activation/PaymentStatusView";

const UserActivation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Custom hooks
  const { wallets, walletsLoading, walletError, fetchWallets } = useWallets();
  const { paymentCompleted } = usePaymentStatus(user?.id, paymentSubmitted, paymentId);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (data?.user) {
          console.log("User found:", data.user.email);
          setUser(data.user);
          
          // Check if the user has any pending payments
          checkPendingPayments(data.user.id);
          
          // Check if user is already activated
          const isActivated = await checkUserRole(data.user.id);
          if (isActivated) {
            console.log("User is already activated, redirecting to dashboard");
            navigate('/nutzer');
            return;
          }
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
  }, [toast, navigate]);
  
  // Check if user has been assigned the 'user' role (activated)
  const checkUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'user'
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Error checking user role:", error.message);
      return false;
    }
  };

  // Check if user has pending payments
  const checkPendingPayments = async (userId: string) => {
    try {
      const { data: pendingPayments, error: pendingError } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (pendingError) throw pendingError;
      
      if (pendingPayments && pendingPayments.length > 0) {
        console.log("Found pending payment:", pendingPayments[0].id);
        setPaymentSubmitted(true);
        setPaymentId(pendingPayments[0].id);
      } else {
        // If no pending payments, check for completed payments
        const { data: completedPayments, error: completedError } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (completedError) throw completedError;
        
        if (completedPayments && completedPayments.length > 0) {
          console.log("Found completed payment:", completedPayments[0].id);
          // User has a completed payment but hasn't been redirected yet
          navigate('/nutzer');
        }
      }
    } catch (error: any) {
      console.error("Error checking payments:", error.message);
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet."
      });
      navigate("/admin");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast({
        title: "Fehler",
        description: "Es gab ein Problem beim Abmelden.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Wird geladen...</p>
      </div>
    );
  }

  if (paymentSubmitted) {
    return <PaymentStatusView paymentId={paymentId} />;
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Konto Aktivierung</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Abmelden</span>
        </Button>
      </div>
      
      <div className="mb-8 text-center">
        <p className="text-gray-600">Hallo {user?.email}, aktivieren Sie Ihr Konto, um Zugriff auf alle Funktionen zu erhalten.</p>
      </div>

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
    </div>
  );
};

export default UserActivation;
