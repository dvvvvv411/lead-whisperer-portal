import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LeadFilterBar } from "./LeadFilterBar";
import { LeadTableHeader } from "./LeadTableHeader";
import { LeadTableRow } from "./LeadTableRow";
import { CreateAccountDialog } from "./CreateAccountDialog";
import { AdminNavbar } from "../AdminNavbar";

interface Lead {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  status: 'neu' | 'akzeptiert' | 'abgelehnt';
}

interface Comment {
  id: string;
  lead_id: string;
  created_at: string;
  content: string;
  user_email: string;
}

interface CreateAccountFormData {
  name: string;
  email: string;
  password: string;
  leadId: string;
}

const LeadsTable = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  
  // Account creation states
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [createAccountData, setCreateAccountData] = useState<CreateAccountFormData>({
    name: '',
    email: '',
    password: '',
    leadId: ''
  });

  // Benutzer-Session abrufen
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, []);

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

  // Kommentare abrufen
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data, error } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          setComments(data as Comment[]);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen der Kommentare:", error);
      }
    };
    
    fetchComments();
  }, []);

  // Refresh data handler
  const handleRefresh = async () => {
    toast({
      title: "Daten werden aktualisiert",
      description: "Die Liste wird mit neuen Daten aktualisiert."
    });
    await fetchLeads();
    await fetchComments();
  };

  const handleStatusChange = async (id: string, status: 'akzeptiert' | 'abgelehnt') => {
    if (status === 'akzeptiert') {
      // Find the lead to populate account creation form
      const lead = leads.find(l => l.id === id);
      if (lead) {
        setCreateAccountData({
          name: lead.name,
          email: lead.email,
          password: '',
          leadId: lead.id
        });
        setCreateAccountOpen(true);
      }
    } else {
      // For rejected leads, just update the status
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
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/admin";
    } catch (error) {
      console.error("Fehler beim Abmelden:", error);
    }
  };

  const handleAccountCreated = () => {
    // Update local leads state
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === createAccountData.leadId ? { ...lead, status: 'akzeptiert' } : lead
      )
    );
    
    setCreateAccountOpen(false);
    setCreateAccountData({
      name: '',
      email: '',
      password: '',
      leadId: ''
    });
  };

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setComments(data as Comment[]);
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der Kommentare:", error);
    }
  };

  const handleCommentAdded = (newComment: Comment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p>Wird geladen...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <LeadTableHeader 
        userEmail={user?.email}
        onLogout={handleLogout}
        onRefresh={handleRefresh}
      />
      
      <LeadFilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      
      {isRefreshing && (
        <div className="text-center py-2">
          <span className="text-blue-600">Daten werden aktualisiert...</span>
        </div>
      )}
      
      {filteredLeads.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Keine Leads vorhanden für diese Filterauswahl.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Datum</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Unternehmen</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Kommentare</th>
                <th className="px-4 py-3 text-left">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <LeadTableRow 
                  key={lead.id}
                  lead={lead} 
                  comments={comments}
                  onStatusChange={handleStatusChange}
                  onCommentAdded={handleCommentAdded}
                  userEmail={user?.email || ''}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateAccountDialog
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
        formData={createAccountData}
        onFormDataChange={(data) => setCreateAccountData({...createAccountData, ...data})}
        onSuccess={handleAccountCreated}
      />
    </div>
  );
};

export default LeadsTable;
