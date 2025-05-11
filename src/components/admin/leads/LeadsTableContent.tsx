
import { Lead, Comment } from "@/types/leads";
import { LeadTableRow } from "./LeadTableRow";
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow
} from "@/components/ui/table";

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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Datum</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Unternehmen</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Kommentare</TableHead>
            <TableHead>Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
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
        </TableBody>
      </Table>
    </div>
  );
};
