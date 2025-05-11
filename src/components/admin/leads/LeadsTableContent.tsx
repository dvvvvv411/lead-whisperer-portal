
import { Lead, Comment } from "@/types/leads";
import { LeadTableRow } from "./LeadTableRow";

interface LeadsTableContentProps {
  leads: Lead[];
  comments: Comment[];
  onStatusChange: (id: string, status: 'akzeptiert' | 'abgelehnt') => void;
  onCommentAdded: (newComment: Comment) => void;
  userEmail: string;
  isRefreshing: boolean;
}

export const LeadsTableContent = ({
  leads,
  comments,
  onStatusChange,
  onCommentAdded,
  userEmail,
  isRefreshing
}: LeadsTableContentProps) => {
  if (isRefreshing) {
    return (
      <div className="text-center py-2">
        <span className="text-blue-600">Daten werden aktualisiert...</span>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Keine Leads vorhanden für diese Filterauswahl.</p>
      </div>
    );
  }

  return (
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
          {leads.map((lead) => (
            <LeadTableRow 
              key={lead.id}
              lead={lead} 
              comments={comments}
              onStatusChange={onStatusChange}
              onCommentAdded={onCommentAdded}
              userEmail={userEmail || ''}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
