
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
  onLeadUpdated?: (updatedLead: Lead) => void;
  userEmail: string;
}

export const LeadTableRow = ({ 
  lead, 
  comments, 
  onStatusChange, 
  onCommentAdded,
  onLeadUpdated,
  userEmail
}: LeadTableRowProps) => {
  console.log('LeadTableRow for lead:', lead.id, 'invitation_code:', lead.invitation_code);
  
  return (
    <tr key={lead.id} className="border-t border-gold/10 hover:bg-casino-card/60">
      <td className="px-4 py-3">
        <LeadDate dateString={lead.created_at} />
      </td>
      <td className="px-4 py-3">{lead.name}</td>
      <td className="px-4 py-3">{lead.email}</td>
      <td className="px-4 py-3">{lead.phone || "-"}</td>
      <td className="px-4 py-3" title={lead.source_url || "Keine Quelle"}>
        {lead.source_url ? 
          <span className="text-xs block max-w-[150px] truncate">{lead.source_url}</span> :
          <span className="text-xs text-gray-400">-</span>
        }
      </td>
      <td className="px-4 py-3">
        {lead.invitation_code ? (
          <span className="text-xs font-mono bg-gold/10 text-gold px-2 py-1 rounded border border-gold/30">
            {lead.invitation_code}
          </span>
        ) : (
          <span className="text-xs text-gray-400">-</span>
        )}
      </td>
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
          onLeadUpdated={onLeadUpdated}
        />
      </td>
    </tr>
  );
};
