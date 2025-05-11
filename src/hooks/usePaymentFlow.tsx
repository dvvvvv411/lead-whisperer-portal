
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { usePaymentStatus } from "./usePaymentStatus";

interface UsePaymentFlowProps {
  userId?: string;
  paymentId: string | null;
  paymentSubmitted: boolean;
  redirectPath?: string;
  redirectDelay?: number;
}

export const usePaymentFlow = ({
  userId,
  paymentId,
  paymentSubmitted,
  redirectPath = '/nutzer',
  redirectDelay = 2000
}: UsePaymentFlowProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the base payment status hook
  const { status, paymentCompleted, paymentRejected } = usePaymentStatus({
    userId,
    paymentId,
    enabled: paymentSubmitted
  });

  // Handle navigation and notifications based on payment status
  useEffect(() => {
    if (paymentCompleted) {
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
  }, [paymentCompleted, paymentRejected, navigate, toast, redirectPath, redirectDelay]);
  
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
