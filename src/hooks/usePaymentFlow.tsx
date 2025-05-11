
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "./usePaymentStatus";
import { supabase } from "@/integrations/supabase/client";
import { checkUserRole } from "@/services/roleService";

interface UsePaymentFlowProps {
  userId?: string;
  paymentId: string | null;
  paymentSubmitted: boolean;
  redirectPath?: string;
  redirectDelay?: number;
  isActivation?: boolean;
}

export const usePaymentFlow = ({
  userId,
  paymentId,
  paymentSubmitted,
  redirectPath = '/nutzer',
  redirectDelay = 2000,
  isActivation = false
}: UsePaymentFlowProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the base payment status hook
  const { status, paymentCompleted, paymentRejected } = usePaymentStatus({
    userId,
    paymentId,
    enabled: paymentSubmitted
  });

  // Add periodic role check for activation payments
  useEffect(() => {
    let roleCheckInterval: number | null = null;
    
    // Only start checking if this is an activation payment and we're waiting
    if (isActivation && paymentSubmitted && !paymentCompleted && !paymentRejected && userId) {
      console.log("Starting periodic role check for user:", userId);
      
      roleCheckInterval = window.setInterval(async () => {
        try {
          // Check if user has been activated (has 'user' role)
          const hasUserRole = await checkUserRole('user');
          console.log("Role check result:", hasUserRole);
          
          if (hasUserRole) {
            console.log("User has been activated, refreshing page...");
            toast({
              title: "Konto aktiviert",
              description: "Ihr Konto wurde erfolgreich aktiviert! Die Seite wird aktualisiert..."
            });
            
            // Clear interval and redirect
            if (roleCheckInterval) clearInterval(roleCheckInterval);
            
            // Add a short delay before reloading to ensure the toast is visible
            setTimeout(() => {
              window.location.href = redirectPath;
            }, 1500);
          }
        } catch (error) {
          console.error("Error checking user role:", error);
        }
      }, 5000); // Check every 5 seconds
    }
    
    return () => {
      if (roleCheckInterval) {
        clearInterval(roleCheckInterval);
      }
    };
  }, [isActivation, paymentSubmitted, paymentCompleted, paymentRejected, userId, toast, redirectPath]);

  // Assign user role when payment is completed (for activation payments)
  const assignUserRole = async (userId: string) => {
    if (!isActivation) return;

    try {
      console.log("Assigning 'user' role to user:", userId);
      const { error } = await supabase.rpc('add_user_role', {
        _user_id: userId,
        _role: 'user'
      });
      
      if (error) throw error;
      console.log("Successfully assigned 'user' role");
    } catch (error: any) {
      console.error("Error assigning user role:", error.message);
      toast({
        title: "Fehler bei der Kontoaktivierung",
        description: "Rolle konnte nicht zugewiesen werden. Bitte kontaktieren Sie den Support.",
        variant: "destructive"
      });
    }
  };

  // Handle navigation and notifications based on payment status
  useEffect(() => {
    if (paymentCompleted && userId) {
      toast({
        title: "Zahlung bestätigt",
        description: "Ihre Zahlung wurde bestätigt! Sie werden zum Dashboard weitergeleitet."
      });
      
      // If this is an activation payment, assign the user role first
      if (isActivation) {
        assignUserRole(userId);
      }
      
      const redirectTimer = setTimeout(() => {
        navigate(redirectPath);
      }, redirectDelay);
      
      return () => clearTimeout(redirectTimer);
    }
    
    if (paymentRejected) {
      toast({
        title: "Zahlung abgelehnt",
        description: "Ihre Zahlung wurde abgelehnt. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
        variant: "destructive"
      });
    }
  }, [paymentCompleted, paymentRejected, navigate, toast, redirectPath, redirectDelay, userId, isActivation]);
  
  // Prevent navigation when user tries to go back or forward during payment processing
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (paymentSubmitted && !paymentCompleted && !paymentRejected) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [paymentSubmitted, paymentCompleted, paymentRejected]);
  
  return { status, paymentCompleted, paymentRejected };
};
