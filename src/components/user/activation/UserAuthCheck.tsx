
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useUserCredit } from "@/hooks/useUserCredit";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

interface UserAuthCheckProps {
  children: React.ReactNode;
  onUserLoaded: (user: any) => void;
  redirectToActivation?: boolean;
}

const UserAuthCheck = ({ children, onUserLoaded, redirectToActivation = true }: UserAuthCheckProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redirectChecked, setRedirectChecked] = useState(false);
  
  // Use the credit hook to check user's credit
  const { userCredit, loading: creditLoading, fetchUserCredit } = useUserCredit(user?.id);

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
        return { pending: true, paymentId: pendingPayments[0].id };
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
          // User has a completed payment
          return { completed: true };
        }
      }
      
      return { pending: false, completed: false };
    } catch (error: any) {
      console.error("Error checking payments:", error.message);
      return { pending: false, completed: false, error: error.message };
    }
  };

  // Set up credit change subscription
  useEffect(() => {
    if (!user?.id) return;
    
    console.log("Setting up credit subscription for user:", user.id);
    
    // Subscribe to user_credits changes to detect when user gets sufficient credit
    const creditSubscription = supabase
      .channel('user-credits-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_credits',
        filter: `user_id=eq.${user.id}`
      }, async () => {
        console.log("User credit change detected, refreshing credit");
        
        // Refresh credit
        await fetchUserCredit();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(creditSubscription);
    };
  }, [user?.id, fetchUserCredit]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (data?.user) {
          console.log("User found in UserAuthCheck:", data.user.email);
          
          // Check if the user is an admin (still using role check for admin access)
          const { data: adminRoleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          const isAdmin = !!adminRoleData;
          
          if (isAdmin) {
            console.log("User is admin, redirecting to admin dashboard");
            navigate('/admin');
            return;
          }
          
          // Check for any pending payments
          const paymentStatus = await checkPendingPayments(data.user.id);
          console.log("User payment status in UserAuthCheck:", paymentStatus);
          
          // Pass user data to parent component
          const userData = {
            ...data.user,
            isActivated: userCredit >= CREDIT_ACTIVATION_THRESHOLD,
            paymentStatus
          };
          
          setUser(userData);
          onUserLoaded(userData);
        } else {
          console.log("No user found, redirecting to login");
          navigate("/admin");
        }
      } catch (error: any) {
        console.error("Error getting user in UserAuthCheck:", error.message);
        toast({
          title: "Fehler",
          description: "Es gab ein Problem beim Laden Ihrer Benutzerdaten.",
          variant: "destructive"
        });
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, [toast, navigate, onUserLoaded, userCredit]);

  // Check redirect only once after user and credit are loaded
  useEffect(() => {
    if (!user?.id || creditLoading || redirectChecked) return;

    // Check if we need to redirect based on credit status
    if (redirectToActivation && userCredit < CREDIT_ACTIVATION_THRESHOLD && !window.location.pathname.includes('/aktivierung')) {
      console.log("User doesn't have sufficient credit, redirecting to activation page");
      navigate('/nutzer/aktivierung');
    } else if (userCredit >= CREDIT_ACTIVATION_THRESHOLD && window.location.pathname.includes('/aktivierung')) {
      console.log("User has sufficient credit, redirecting to dashboard from activation page");
      toast({
        title: "Konto aktiviert",
        description: "Ihr Konto wurde aktiviert! Sie werden zum Dashboard weitergeleitet."
      });
      navigate('/nutzer');
    }
    
    // Mark this check as done
    setRedirectChecked(true);
  }, [user?.id, navigate, toast, redirectToActivation, userCredit, creditLoading, redirectChecked]);
  
  if (loading || creditLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Wird geladen...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default UserAuthCheck;
