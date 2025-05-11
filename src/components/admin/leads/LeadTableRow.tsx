
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadStatusButtons } from "./LeadStatusButtons";
import { LeadDetailsDialog } from "./LeadDetailsDialog";
import { LeadCommentsDialog } from "./LeadCommentsDialog";

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

interface LeadTableRowProps {
  lead: Lead;
  comments: Comment[];
  onStatusChange: (id: string, status: 'akzeptiert' | 'abgelehnt') => void;
  onCommentAdded: (newComment: Comment) => void;
  userEmail: string;
}

export const LeadTableRow = ({ 
  lead, 
  comments, 
  onStatusChange, 
  onCommentAdded,
  userEmail
}: LeadTableRowProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  
  const leadComments = comments.filter(comment => comment.lead_id === lead.id);

  return (
    <tr key={lead.id} className="border-t hover:bg-gray-50">
      <td className="px-4 py-3">
        {new Date(lead.created_at).toLocaleDateString('de-DE')} {new Date(lead.created_at).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
      </td>
      <td className="px-4 py-3">{lead.name}</td>
      <td className="px-4 py-3">{lead.email}</td>
      <td className="px-4 py-3">{lead.company || "-"}</td>
      <td className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setIsCommentsOpen(true)}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{leadComments.length}</span>
        </Button>
        
        <LeadCommentsDialog
          lead={lead}
          comments={leadComments}
          onCommentAdded={onCommentAdded}
          open={isCommentsOpen}
          onOpenChange={setIsCommentsOpen}
          userEmail={userEmail}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <LeadStatusButtons 
            status={lead.status} 
            onStatusChange={(status) => onStatusChange(lead.id, status)} 
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsDetailsOpen(true)}
          >
            Details
          </Button>
          
          <LeadDetailsDialog
            lead={lead}
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
          />
        </div>
      </td>
    </tr>
  );
};
