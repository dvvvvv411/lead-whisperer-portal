
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const WithdrawalNotifier: React.FC = () => {
  // Function to send withdrawal notifications with additional details
  const notifyTelegram = async (amount?: number | string, walletCurrency?: string, walletAddress?: string, userEmail?: string) => {
    try {
      // Prepare enhanced payload for Telegram notification
      const payload = {
        type: 'withdrawal',
        amount: amount,
        walletCurrency: walletCurrency,
        walletAddress: walletAddress,
        userEmail: userEmail
      };
      
      console.log('Sending enhanced withdrawal notification with payload:', payload);
      
      // Call the edge function with the enhanced payload
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
        console.log('Withdrawal notification sent successfully to all registered chat IDs');
        toast({
          description: "Auszahlungs-Benachrichtigung gesendet",
        });
      } else {
        console.error('Withdrawal notification failed:', data?.error || 'Unknown error');
        toast({
          description: `Telegram Benachrichtigung fehlgeschlagen: ${data?.error || 'Unbekannter Fehler'}`,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error preparing withdrawal telegram notification:', err);
      toast({
        description: "Fehler bei der Vorbereitung der Auszahlungs-Benachrichtigung",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log('Setting up realtime subscription for withdrawals...');
    
    // Subscribe to withdrawal inserts
    const channel = supabase
      .channel('withdrawal-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'withdrawals' 
        },
        (payload) => {
          console.log('New withdrawal detected:', payload);
          
          // Extract withdrawal details from the payload
          const newData = payload.new;
          const amount = newData?.amount ? (newData.amount / 100).toFixed(2) : undefined; // Convert cents to euros
          const walletCurrency = newData?.wallet_currency;
          const walletAddress = newData?.wallet_address;
          const userEmail = newData?.user_email;
          
          // Call notifyTelegram with extracted data
          notifyTelegram(amount, walletCurrency, walletAddress, userEmail);
        }
      )
      .subscribe((status) => {
        console.log('Withdrawal subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to withdrawals changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error with withdrawals realtime subscription');
        }
      });
      
    return () => {
      console.log('Cleaning up withdrawal realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  // This component doesn't render anything, it just sets up the listener
  return null;
};
