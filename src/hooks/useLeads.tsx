
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Lead } from "@/types/leads";

export function useLeads() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  
  // Leads abrufen
  const fetchLeads = async () => {
    try {
      setIsRefreshing(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setLeads(data as Lead[]);
        // Re-apply any filters that were active
        if (statusFilter === undefined) {
          setFilteredLeads(data as Lead[]);
        } else {
          setFilteredLeads(data.filter(lead => lead.status === statusFilter) as Lead[]);
        }
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Leads:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Leads konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load of leads
  useEffect(() => {
    fetchLeads();
  }, []);

  // Anwenden des Filters, wenn sich der statusFilter ändert
  useEffect(() => {
    if (statusFilter === undefined) {
      setFilteredLeads(leads);
    } else {
      setFilteredLeads(leads.filter(lead => lead.status === statusFilter));
    }
  }, [statusFilter, leads]);

  const handleStatusChange = async (id: string, status: 'akzeptiert' | 'abgelehnt') => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Lokale Daten aktualisieren
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === id ? { ...lead, status } : lead
        )
      );
      
      toast({
        title: "Status aktualisiert",
        description: `Der Lead wurde als "${status}" markiert.`
      });
      
    } catch (error) {
      console.error("Fehler bei der Statusänderung:", error);
      toast({
        title: "Fehler",
        description: "Der Status konnte nicht aktualisiert werden.",
        variant: "destructive"
      });
    }
  };

  return {
    leads,
    filteredLeads,
    isLoading,
    isRefreshing,
    statusFilter,
    setStatusFilter,
    fetchLeads,
    handleStatusChange,
    setLeads
  };
}
