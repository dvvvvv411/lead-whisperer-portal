
import { useState } from "react";
import { LeadFilterBar } from "./LeadFilterBar";
import { LeadTableHeader } from "./LeadTableHeader";
import { LeadsTableContent } from "./LeadsTableContent";
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
    handleStatusChange
  } = useLeads();
  
  const { comments, fetchComments, handleCommentAdded } = useComments();
  const { user, authLoading, handleLogout } = useAdminAuth();

  // Refresh data handler
  const handleRefresh = async () => {
    await fetchLeads();
    await fetchComments();
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
        onStatusChange={handleStatusChange}
        onCommentAdded={handleCommentAdded}
        userEmail={user?.email || ''}
        isRefreshing={isRefreshing}
      />
    </div>
  );
};

export default LeadsTable;
