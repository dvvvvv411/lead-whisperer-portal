
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type PaymentStatus = 'pending' | 'completed' | 'rejected' | null;

interface UsePaymentStatusProps {
  userId?: string;
  paymentId: string | null;
  enabled: boolean;
  pollingInterval?: number;
}

interface UsePaymentStatusResult {
  status: PaymentStatus;
  paymentCompleted: boolean;
  paymentRejected: boolean;
  isPolling: boolean;
}

export const usePaymentStatus = ({
  userId,
  paymentId,
  enabled = true,
  pollingInterval = 15000
}: UsePaymentStatusProps): UsePaymentStatusResult => {
  const [status, setStatus] = useState<PaymentStatus>(null);
  const [isPolling, setIsPolling] = useState(false);
  const paymentCompleted = status === 'completed';
  const paymentRejected = status === 'rejected';

  // Check payment status immediately on hook mount or when paymentId changes
  useEffect(() => {
    const checkInitialPaymentStatus = async () => {
      if (!userId || !paymentId || !enabled) return;
      
      try {
        const { data, error } = await supabase
          .from('payments')
          .select('status')
          .eq('id', paymentId)
          .single();
        
        if (error) throw error;
        
        console.log("Initial payment status check:", data.status);
        setStatus(data.status as PaymentStatus);
      } catch (error: any) {
        console.error("Error checking initial payment status:", error.message);
      }
    };
    
    if (userId && paymentId && enabled) {
      checkInitialPaymentStatus();
    }
  }, [userId, paymentId, enabled]);
  
  // Set up polling for payment status updates
  useEffect(() => {
    let pollIntervalId: number | null = null;
    
    const startPolling = (id: string) => {
      if (!id || !enabled) return;
      
      setIsPolling(true);
      pollIntervalId = window.setInterval(async () => {
        try {
          const { data, error } = await supabase
            .from('payments')
            .select('status')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          console.log("Payment status poll check:", data.status);
          setStatus(data.status as PaymentStatus);
          
          // Stop polling if payment is completed or rejected
          if (data.status === 'completed' || data.status === 'rejected') {
            if (pollIntervalId) {
              clearInterval(pollIntervalId);
              setIsPolling(false);
            }
          }
        } catch (error: any) {
          console.error("Error polling payment status:", error.message);
        }
      }, pollingInterval);
    };
    
    if (paymentId && enabled && !paymentCompleted && !paymentRejected) {
      startPolling(paymentId);
    }
    
    return () => {
      if (pollIntervalId) {
        clearInterval(pollIntervalId);
        setIsPolling(false);
      }
    };
  }, [paymentId, enabled, paymentCompleted, paymentRejected, pollingInterval]);
  
  return { status, paymentCompleted, paymentRejected, isPolling };
};
