
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentStatus = (userId: string | undefined, paymentSubmitted: boolean, paymentId: string | null) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  
  // Check payment status immediately on component mount or when returning to the page
  useEffect(() => {
    const checkInitialPaymentStatus = async () => {
      if (!userId || !paymentId) return;
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('id', paymentId)
          .single();
        
        if (error) throw error;
        
        console.log("Initial payment status check:", data.status);
        
        if (data.status === 'completed') {
          setPaymentCompleted(true);
          toast({
            title: "Zahlung bestätigt",
            description: "Ihre Zahlung wurde bestätigt! Sie werden zum Dashboard weitergeleitet."
          });
          
          setTimeout(() => {
            navigate('/nutzer');
          }, 2000);
        }
      } catch (error: any) {
        console.error("Error checking initial payment status:", error.message);
      }
    };
    
    if (userId && paymentId) {
      checkInitialPaymentStatus();
    }
  }, [userId, paymentId, toast, navigate]);
  
  // Set up polling for payment status updates
  useEffect(() => {
    let pollInterval: number | null = null;
    
    const startPolling = (id: string) => {
      if (!id) return;
      
      pollInterval = window.setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('payments')
            .select('status')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          console.log("Payment status check:", data.status);
          
          if (data.status === 'completed' && !paymentCompleted) {
            setPaymentCompleted(true);
            if (pollInterval) clearInterval(pollInterval);
            
            toast({
              title: "Zahlung bestätigt",
              description: "Ihre Zahlung wurde bestätigt! Sie werden zum Dashboard weitergeleitet."
            });
            
            setTimeout(() => {
              navigate('/nutzer');
            }, 2000);
          } else if (data.status === 'rejected') {
            if (pollInterval) clearInterval(pollInterval);
            
            toast({
              title: "Zahlung abgelehnt",
              description: "Ihre Zahlung wurde abgelehnt. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support.",
              variant: "destructive"
            });
          }
        } catch (error: any) {
          console.error("Error polling payment status:", error.message);
        }
      }, 15000); // Check every 15 seconds
    };
    
    if (paymentSubmitted && paymentId && !paymentCompleted) {
      startPolling(paymentId);
    }
    
    // Prevent navigation when user tries to go back or forward
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (paymentSubmitted && !paymentCompleted) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [paymentSubmitted, paymentId, paymentCompleted, navigate, toast]);
  
  return { paymentCompleted };
};
