
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
        
      if (error) throw error;
      
      // Prepare payload for Telegram notification
      const payload = {
        type: 'lead',
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone || 'Nicht angegeben',
        created_at: lead.created_at
      };
      
      // Call the edge function to send notification
      const { error: fnError } = await supabase.functions.invoke('send-telegram-notification', {
        body: payload
      });
      
      if (fnError) {
        console.error('Error sending telegram notification:', fnError);
        toast({
          description: "Telegram Benachrichtigung fehlgeschlagen. Details im Browser-Protokoll",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error('Error preparing telegram notification:', err);
    }
  };

  // Set up realtime subscription for new leads
  useEffect(() => {
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
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <LeadsTable />;
};

export default LeadTable;
