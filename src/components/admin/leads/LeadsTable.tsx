
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
      <div className="min-h-screen bg-casino-darker text-gray-300">
        <AdminNavbar />
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
                <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
              </div>
              <p>Wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <LeadTableHeader 
          userEmail={user?.email}
          onLogout={handleLogout}
          onRefresh={handleRefresh}
        />
        
        <LeadFilterBar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />
        
        <div className="bg-casino-card p-6 rounded-lg border border-gold/10 shadow-lg">
          <LeadsTableContent
            leads={filteredLeads}
            comments={comments}
            onStatusChange={handleStatusChange}
            onCommentAdded={handleCommentAdded}
            userEmail={user?.email || ''}
            isRefreshing={isRefreshing}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;
