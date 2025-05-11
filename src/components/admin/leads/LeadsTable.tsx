
import { useState } from "react";
import { LeadFilterBar } from "./LeadFilterBar";
import { LeadTableHeader } from "./LeadTableHeader";
import { LeadsTableContent } from "./LeadsTableContent";
import { CreateAccountDialog } from "./CreateAccountDialog";
import { AdminNavbar } from "../AdminNavbar";
import { Lead } from "@/types/leads";

// Custom hooks
import { useLeads } from "@/hooks/useLeads";
import { useComments } from "@/hooks/useComments";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const LeadsTable = () => {
  const { 
    filteredLeads, 
    isLoading, 
    isRefreshing, 
    statusFilter, 
    setStatusFilter, 
    fetchLeads,
    handleStatusChange,
    setLeads
  } = useLeads();
  
  const { comments, fetchComments, handleCommentAdded } = useComments();
  const { user, authLoading, handleLogout } = useAdminAuth();
  
  // Account creation states
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Refresh data handler
  const handleRefresh = async () => {
    await fetchLeads();
    await fetchComments();
  };

  const handleLeadStatusChange = async (id: string, status: 'akzeptiert' | 'abgelehnt') => {
    if (status === 'akzeptiert') {
      // Find the lead to populate account creation form
      const lead = filteredLeads.find(l => l.id === id);
      if (lead) {
        setSelectedLead(lead);
        setCreateAccountOpen(true);
      }
    } else {
      // For rejected leads, just update the status
      await handleStatusChange(id, status);
    }
  };

  const handleAccountCreated = () => {
    if (selectedLead) {
      // Update local leads state
      setLeads(prevLeads => 
        prevLeads.map(lead => 
          lead.id === selectedLead.id ? { ...lead, status: 'akzeptiert' } : lead
        )
      );
    }
    
    setCreateAccountOpen(false);
    setSelectedLead(null);
  };

  if (isLoading || authLoading) {
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
      
      <LeadsTableContent
        leads={filteredLeads}
        comments={comments}
        onStatusChange={handleLeadStatusChange}
        onCommentAdded={handleCommentAdded}
        userEmail={user?.email || ''}
        isRefreshing={isRefreshing}
      />

      <CreateAccountDialog
        open={createAccountOpen}
        onClose={() => {
          setCreateAccountOpen(false);
          setSelectedLead(null);
        }}
        lead={selectedLead}
      />
    </div>
  );
};

export default LeadsTable;
