
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "./usePaymentStatus";
import { supabase } from "@/integrations/supabase/client";
import { useUserCredit } from "@/hooks/useUserCredit";

// Credit threshold required to access the dashboard (in EUR)
const CREDIT_ACTIVATION_THRESHOLD = 250;

interface UsePaymentFlowProps {
  userId?: string;
  paymentId: string | null;
  paymentSubmitted: boolean;
  redirectPath?: string;
  redirectDelay?: number;
  isActivation?: boolean;
  noAutoRedirect?: boolean; // Add option to disable automatic redirection
}

export const usePaymentFlow = ({
  userId,
  paymentId,
  paymentSubmitted,
  redirectPath = '/nutzer',
  redirectDelay = 2000,
  isActivation = false,
  noAutoRedirect = false // Default is to redirect automatically
}: UsePaymentFlowProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the base payment status hook
  const { status, paymentCompleted, paymentRejected } = usePaymentStatus({
    userId,
    paymentId,
    enabled: paymentSubmitted
  });

  // Use the user credit hook to monitor credit level
  const { userCredit, fetchUserCredit } = useUserCredit(userId);

  // Set up a subscription to monitor user_credits changes for activation payments
  useEffect(() => {
    if (!isActivation || !userId || !paymentSubmitted) return;
    
    console.log("Setting up credit subscription for payment flow");
    
    const creditSubscription = supabase
      .channel('payment-flow-credits')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_credits',
        filter: `user_id=eq.${userId}`
      }, async (payload) => {
        console.log("User credit change detected in payment flow:", payload);
        
        // Refresh credit amount
        await fetchUserCredit();
        
        // Check if user has enough credit now
        if (userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
          console.log("User now has sufficient credit for activation, redirecting to dashboard");
          
          // Show activation toast and redirect
          toast({
            title: "Konto aktiviert",
            description: `Ihr Konto wurde mit ${userCredit.toFixed(2)}€ aktiviert! Sie werden zum Dashboard weitergeleitet.`
          });
          
          // Redirect to user dashboard using session-preserving navigation
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              console.log("Redirecting with active session");
              navigate(redirectPath, { replace: true });
            } else {
              console.error("Session lost before redirect, attempting refresh");
              window.location.href = redirectPath;
            }
          });
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(creditSubscription);
    };
  }, [isActivation, userId, paymentSubmitted, navigate, toast, redirectPath, userCredit, fetchUserCredit]);

  // Add more frequent credit check for activation payments
  useEffect(() => {
    let creditCheckInterval: number | null = null;
    
    // Only start checking if this is an activation payment and we're waiting
    if (isActivation && paymentSubmitted && !paymentCompleted && !paymentRejected && userId) {
      console.log("Starting frequent credit check for user:", userId);
      
      creditCheckInterval = window.setInterval(async () => {
        try {
          // Refresh credit
          await fetchUserCredit();
          console.log("Credit check result:", userCredit);
          
          if (userCredit >= CREDIT_ACTIVATION_THRESHOLD) {
            console.log("User has sufficient credit, redirecting to dashboard...");
            toast({
              title: "Konto aktiviert",
              description: `Ihr Konto wurde mit ${userCredit.toFixed(2)}€ aktiviert! Die Seite wird aktualisiert...`
            });
            
            // Clear interval and redirect
            if (creditCheckInterval) clearInterval(creditCheckInterval);
            
            // Use session-preserving navigation instead of immediate redirect
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                console.log("Redirecting with active session from credit check");
                navigate(redirectPath, { replace: true });
              } else {
                console.error("Session lost before redirect, attempting refresh");
                window.location.href = redirectPath;
              }
            });
          }
        } catch (error) {
          console.error("Error checking user credit:", error);
        }
      }, 3000); // Check every 3 seconds (more frequent)
    }
    
    return () => {
      if (creditCheckInterval) {
        clearInterval(creditCheckInterval);
      }
    };
  }, [isActivation, paymentSubmitted, paymentCompleted, paymentRejected, userId, toast, redirectPath, navigate, userCredit, fetchUserCredit]);

  // Handle navigation and notifications based on payment status
  useEffect(() => {
    if (paymentCompleted && userId && !noAutoRedirect) { // Only redirect if noAutoRedirect is false
      toast({
        title: "Zahlung bestätigt",
        description: "Ihre Zahlung wurde bestätigt! Sie werden zum Dashboard weitergeleitet."
      });
      
      const redirectTimer = setTimeout(() => {
        // Use session-preserving navigation
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            console.log("Redirecting with active session after payment completed");
            navigate(redirectPath, { replace: true });
          } else {
            console.error("Session lost before redirect, attempting refresh");
            window.location.href = redirectPath;
          }
        });
      }, redirectDelay);
      
      return () => clearTimeout(redirectTimer);
    } else if (paymentCompleted && userId && noAutoRedirect) {
      // When we don't want auto redirect, just show a toast
      toast({
        title: "Zahlung eingereicht",
        description: "Ihre Einzahlung wird überprüft und nach Bestätigung Ihrem Konto gutgeschrieben."
      });
    }
    
    if (paymentRejected) {
      toast({
        title: "Zahlung abgelehnt",
        description: "Ihre Zahlung wurde abgelehnt. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
        variant: "destructive"
      });
    }
  }, [paymentCompleted, paymentRejected, navigate, toast, redirectPath, redirectDelay, userId, noAutoRedirect]);
  
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
