
import LeadsTable from "./leads/LeadsTable";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// This component serves as a wrapper to maintain backward compatibility
// The special leads-only user (ID: 7eccf781-5911-4d90-a683-1df251069a2f) has full access
const LeadTable = () => {
  // Add notification helper
  const notifyTelegram = async () => {
    try {
      // Prepare simple payload for Telegram notification - no data fetching
      const payload = {
        type: 'lead'
      };
      
      console.log('Sending Telegram notification with payload:', payload);
      
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
        console.log('Telegram notification sent successfully');
        toast({
          description: "Telegram Benachrichtigung gesendet",
        });
      } else {
        console.error('Telegram notification failed:', data?.error || 'Unknown error');
        toast({
          description: `Telegram Benachrichtigung fehlgeschlagen: ${data?.error || 'Unbekannter Fehler'}`,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error preparing telegram notification:', err);
      toast({
        description: "Fehler bei der Vorbereitung der Telegram-Benachrichtigung",
        variant: "destructive"
      });
    }
  };

  // Set up realtime subscription for new leads
  useEffect(() => {
    console.log('Setting up realtime subscription for leads...');
    
    // Subscribe to lead inserts
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'leads' 
        },
        (payload) => {
          console.log('New lead detected:', payload);
          // Simply call notify without passing any data
          notifyTelegram();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to leads changes');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Error with realtime subscription');
        }
      });
      
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div>
      <LeadsTable />
    </div>
  );
};

export default LeadTable;
