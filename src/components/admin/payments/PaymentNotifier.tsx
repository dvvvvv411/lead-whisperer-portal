
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const PaymentNotifier: React.FC = () => {
  // Function to send payment notifications
  const notifyTelegram = async () => {
    try {
      // Prepare simple payload for Telegram notification - no data fetching
      const payload = {
        type: 'payment'
      };
      
      console.log('Sending payment notification with payload:', payload);
      
      // Call the new simplified edge function
      const { data, error } = await supabase.functions.invoke('simple-telegram-alert', {
        body: payload
      });
      
      if (error) {
        console.error('Error sending telegram notification:', error);
        toast({
          description: "Telegram Benachrichtigung fehlgeschlagen. Details im Browser-Protokoll",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Telegram notification response:', data);
      
      if (data?.success) {
        console.log('Payment notification sent successfully');
        toast({
          description: "Zahlungs-Benachrichtigung gesendet"
        });
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
          // Simply call notify without passing any data
          notifyTelegram();
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
