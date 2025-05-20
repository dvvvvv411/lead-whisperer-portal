
import { useState } from "react";
import { Lead, Comment } from "@/types/leads";
import { LeadTableRow } from "./LeadTableRow";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

interface LeadsTableContentProps {
  leads: Lead[];
  comments: Comment[];
  onStatusChange: (id: string, status: 'akzeptiert' | 'abgelehnt') => void;
  onCommentAdded: (newComment: Comment) => void;
  onLeadUpdated?: (updatedLead: Lead) => void;
  userEmail: string;
  isRefreshing?: boolean;
}

export const LeadsTableContent = ({
  leads,
  comments,
  onStatusChange,
  onCommentAdded,
  onLeadUpdated,
  userEmail,
  isRefreshing = false
}: LeadsTableContentProps) => {
  // Sort leads by created_at - newest first
  const sortedLeads = [...leads].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  
  // Function to filter comments for a specific lead
  const getLeadComments = (leadId: string): Comment[] => {
    return comments.filter(comment => comment.lead_id === leadId);
  };

  return (
    <div>
      {leads.length > 0 ? (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-casino-darker hover:bg-casino-darker/90">
                <TableHead className="text-gold">Datum</TableHead>
                <TableHead className="text-gold">Name</TableHead>
                <TableHead className="text-gold">Email</TableHead>
                <TableHead className="text-gold">Telefon</TableHead>
                <TableHead className="text-gold">Quelle</TableHead>
                <TableHead className="text-gold">Status</TableHead>
                <TableHead className="text-gold">Kommentare</TableHead>
                <TableHead className="text-gold">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody className={isRefreshing ? "opacity-50" : ""}>
              {sortedLeads.map(lead => (
                <LeadTableRow
                  key={lead.id}
                  lead={lead}
                  comments={getLeadComments(lead.id)}
                  onStatusChange={onStatusChange}
                  onCommentAdded={onCommentAdded}
                  onLeadUpdated={onLeadUpdated}
                  userEmail={userEmail}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Keine Leads gefunden</h3>
          <p className="text-gray-400">
            Es wurden keine Leads mit den aktuellen Filtereinstellungen gefunden.
          </p>
        </div>
      )}
    </div>
  );
};
