
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

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

  // Check if user has been assigned a specific role
  const checkUserRole = async (userId: string, role: 'admin' | 'user') => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: role
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error(`Error checking ${role} role:`, error.message);
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

  // Set up role change subscription
  useEffect(() => {
    if (!user?.id) return;
    
    console.log("Setting up role subscription for user:", user.id);
    
    // Subscribe to user_roles changes to detect when user gets activated
    const rolesSubscription = supabase
      .channel('user-roles-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_roles',
        filter: `user_id=eq.${user.id}`
      }, async (payload) => {
        console.log("User role change detected:", payload);
        
        // Check if the user is now activated
        const isActivated = await checkUserRole(user.id, 'user');
        if (isActivated && !user.isActivated) {
          console.log("User is now activated, redirecting to dashboard");
          
          // Show notification and redirect
          toast({
            title: "Konto aktiviert",
            description: "Ihr Konto wurde aktiviert! Sie werden zum Dashboard weitergeleitet."
          });
          
          // Update user object
          const updatedUser = { ...user, isActivated: true };
          setUser(updatedUser);
          onUserLoaded(updatedUser);
          
          // Redirect to user dashboard
          setTimeout(() => {
            navigate('/nutzer');
          }, 1500);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(rolesSubscription);
    };
  }, [user?.id, navigate, toast, onUserLoaded]);

  // Set up periodic activation check for the activation page
  useEffect(() => {
    let activationCheckInterval: number | null = null;
    
    // If we're on the activation page with a user but not redirecting to activation
    // (meaning we're already on the activation page), then check periodically for role changes
    if (user && !redirectToActivation && window.location.pathname.includes('/aktivierung')) {
      console.log("Setting up activation status check interval");
      
      activationCheckInterval = window.setInterval(async () => {
        if (!user?.id) return;
        
        const isActivated = await checkUserRole(user.id, 'user');
        if (isActivated && !user.isActivated) {
          console.log("User activation status changed to active, refreshing data");
          
          // Update user object and refresh the page or redirect
          const updatedUser = { ...user, isActivated: true };
          setUser(updatedUser);
          onUserLoaded(updatedUser);
          
          // If activation status changed, show a notification and redirect
          toast({
            title: "Konto aktiviert",
            description: "Ihr Konto wurde aktiviert! Sie werden zum Dashboard weitergeleitet."
          });
          
          setTimeout(() => {
            navigate('/nutzer');
          }, 1500);
        }
      }, 10000); // Check every 10 seconds
    }
    
    return () => {
      if (activationCheckInterval) {
        clearInterval(activationCheckInterval);
      }
    };
  }, [user, redirectToActivation, navigate, toast, onUserLoaded]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        if (data?.user) {
          console.log("User found:", data.user.email);
          setUser(data.user);
          
          // Check if the user is an admin
          const isAdmin = await checkUserRole(data.user.id, 'admin');
          if (isAdmin) {
            console.log("User is admin, redirecting to admin dashboard");
            navigate('/admin');
            return;
          }
          
          // Check if user is already activated (has user role)
          const isActivated = await checkUserRole(data.user.id, 'user');
          console.log("User activation status:", isActivated);
          
          // Check if user has any pending payments
          const paymentStatus = await checkPendingPayments(data.user.id);
          console.log("User payment status:", paymentStatus);
          
          // If user is activated, always redirect to the user dashboard if they try to access activation page
          if (isActivated && window.location.pathname.includes('/aktivierung')) {
            console.log("User is already activated, redirecting to dashboard from activation page");
            navigate('/nutzer');
            return;
          }
          
          // If user is not activated and redirectToActivation is true, redirect to activation page
          if (!isActivated && redirectToActivation) {
            console.log("User is not activated, redirecting to activation page");
            navigate('/nutzer/aktivierung');
            return;
          }
          
          // Pass user data to parent component
          onUserLoaded({
            ...data.user,
            isActivated,
            paymentStatus
          });
        } else {
          console.log("No user found, redirecting to login");
          navigate("/admin");
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
  }, [toast, navigate, onUserLoaded, redirectToActivation]);
  
  if (loading) {
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
