
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

  // Set up a subscription to monitor user_roles changes for activation payments
  useEffect(() => {
    if (!isActivation || !userId || !paymentSubmitted) return;
    
    console.log("Setting up roles subscription for payment flow");
    
    const roleSubscription = supabase
      .channel('payment-flow-roles')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_roles',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log("User role change detected in payment flow:", payload);
        
        // Show activation toast and redirect
        toast({
          title: "Konto aktiviert",
          description: "Ihr Konto wurde erfolgreich aktiviert! Sie werden zum Dashboard weitergeleitet."
        });
        
        // Redirect to user dashboard after a short delay
        setTimeout(() => {
          navigate(redirectPath);
        }, 1500);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(roleSubscription);
    };
  }, [isActivation, userId, paymentSubmitted, navigate, toast, redirectPath]);

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
            console.log("User has been activated, redirecting to dashboard...");
            toast({
              title: "Konto aktiviert",
              description: "Ihr Konto wurde erfolgreich aktiviert! Die Seite wird aktualisiert..."
            });
            
            // Clear interval and redirect
            if (roleCheckInterval) clearInterval(roleCheckInterval);
            
            // Add a short delay before redirecting to ensure the toast is visible
            setTimeout(() => {
              navigate(redirectPath);
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
  }, [isActivation, paymentSubmitted, paymentCompleted, paymentRejected, userId, toast, redirectPath, navigate]);

  // Handle navigation and notifications based on payment status
  useEffect(() => {
    if (paymentCompleted && userId) {
      toast({
        title: "Zahlung bestätigt",
        description: "Ihre Zahlung wurde bestätigt! Sie werden zum Dashboard weitergeleitet."
      });
      
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
  }, [paymentCompleted, paymentRejected, navigate, toast, redirectPath, redirectDelay, userId]);
  
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
