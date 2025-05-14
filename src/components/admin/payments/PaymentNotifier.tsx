
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const PaymentNotifier: React.FC = () => {
  // Function to send payment notifications
  const notifyTelegram = async (paymentId: string) => {
    try {
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('id', paymentId)
        .single();
        
      if (error) {
        console.error('Error fetching payment for notification:', error);
        throw error;
      }
      
      // Prepare payload for Telegram notification
      const payload = {
        type: 'payment',
        id: payment.id,
        user_email: payment.user_email,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created_at: payment.created_at
      };
      
      console.log('Sending payment notification with payload:', payload);
      
      // Call the edge function to send notification
      const { data, error: fnError } = await supabase.functions.invoke('send-telegram-notification', {
        body: payload
      });
      
      if (fnError) {
        console.error('Error sending telegram notification:', fnError);
        toast({
          description: "Telegram Benachrichtigung fehlgeschlagen. Details im Browser-Protokoll",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Telegram notification response:', data);
      
      if (data?.success) {
        console.log('Payment notification sent successfully');
      } else {
        console.error('Payment notification failed:', data?.error || 'Unknown error');
        toast({
          description: `Telegram Benachrichtigung fehlgeschlagen: ${data?.error || 'Unbekannter Fehler'}`,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error preparing payment telegram notification:', err);
      toast({
        description: "Fehler bei der Vorbereitung der Zahlungs-Benachrichtigung",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('Setting up realtime subscription for payments...');
    
    // Subscribe to payment inserts
    const channel = supabase
      .channel('payment-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'payments' 
        },
        (payload) => {
          console.log('New payment detected:', payload);
          if (payload.new?.id) {
            notifyTelegram(payload.new.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Payment subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to payments changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error with payments realtime subscription');
        }
      });
      
    return () => {
      console.log('Cleaning up payment realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  // This component doesn't render anything, it just sets up the listener
  return null;
};
