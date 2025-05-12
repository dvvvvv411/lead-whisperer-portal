
import { Lead, Comment } from "@/types/leads";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadCommentButton } from "./comments/LeadCommentButton";
import { LeadActions } from "./actions/LeadActions";
import { LeadDate } from "./LeadDate";

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
  return (
    <tr key={lead.id} className="border-t border-gold/10 hover:bg-casino-card/60">
      <td className="px-4 py-3">
        <LeadDate dateString={lead.created_at} />
      </td>
      <td className="px-4 py-3">{lead.name}</td>
      <td className="px-4 py-3">{lead.email}</td>
      <td className="px-4 py-3">{lead.phone || "-"}</td>
      <td className="px-4 py-3">
        <LeadStatusBadge status={lead.status} />
      </td>
      <td className="px-4 py-3">
        <LeadCommentButton 
          leadId={lead.id}
          leadName={lead.name}
          comments={comments}
          onCommentAdded={onCommentAdded}
          userEmail={userEmail}
        />
      </td>
      <td className="px-4 py-3">
        <LeadActions 
          lead={lead}
          onStatusChange={(status) => onStatusChange(lead.id, status)} 
        />
      </td>
    </tr>
  );
};
