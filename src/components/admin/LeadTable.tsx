
import LeadsTable from "./leads/LeadsTable";
import { toast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// This component serves as a wrapper to maintain backward compatibility
// The special leads-only user (ID: 7eccf781-5911-4d90-a683-1df251069a2f) has full access
const LeadTable = () => {
  // Add notification helper
  const notifyTelegram = async (leadId: string) => {
    try {
      const { data: lead, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
        
      if (error) {
        console.error('Error fetching lead for notification:', error);
        throw error;
      }
      
      // Prepare payload for Telegram notification
      const payload = {
        type: 'lead',
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || 'Nicht angegeben',
        created_at: lead.created_at
      };
      
      console.log('Sending Telegram notification with payload:', payload);
      
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
        console.log('Telegram notification sent successfully');
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
  
  // Manual test function for debugging
  const testTelegramNotification = async () => {
    try {
      console.log('Testing Telegram notification...');
      const { data, error } = await supabase.functions.invoke('send-telegram-notification/test');
      
      if (error) {
        console.error('Error during Telegram test:', error);
        toast({
          description: "Telegram Test fehlgeschlagen. Details im Browser-Protokoll",
          variant: "destructive"
        });
        return;
      }
      
      console.log('Telegram test response:', data);
      
      if (data?.success) {
        toast({
          description: "Telegram Test erfolgreich gesendet",
        });
      } else {
        toast({
          description: `Telegram Test fehlgeschlagen: ${data?.error || 'Unbekannter Fehler'}`,
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error testing Telegram notification:', err);
      toast({
        description: "Fehler beim Testen der Telegram-Benachrichtigung",
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
          if (payload.new?.id) {
            notifyTelegram(payload.new.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to leads changes');
        }
      });
    
    // Event handling for channel errors
    channel.on('error', (err: Error) => {
      console.error('Error with realtime subscription:', err);
    });
      
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
    };
  }, []);

  return <LeadsTable />;
};

export default LeadTable;
