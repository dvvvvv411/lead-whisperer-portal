
import { Lead, Comment } from "@/types/leads";
import { LeadTableRow } from "./LeadTableRow";
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow
} from "@/components/ui/table";
import { motion } from "framer-motion";

interface LeadsTableContentProps {
  leads: Lead[];
  comments: Comment[];
  onStatusChange: (id: string, status: 'akzeptiert' | 'abgelehnt') => void;
  onCommentAdded: (newComment: Comment) => void;
  onLeadUpdated?: (updatedLead: Lead) => void;
  userEmail: string;
  isRefreshing: boolean;
}

export const LeadsTableContent = ({
  leads,
  comments,
  onStatusChange,
  onCommentAdded,
  onLeadUpdated,
  userEmail,
  isRefreshing
}: LeadsTableContentProps) => {
  if (isRefreshing) {
    return (
      <div className="text-center py-4">
        <span className="text-blue-400 flex items-center justify-center gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Daten werden aktualisiert...
        </span>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="text-center p-10 bg-casino-darker rounded-lg border border-gold/10">
        <p className="text-gray-400">Keine Leads vorhanden für diese Filterauswahl.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gold/20 shadow-lg">
      <Table className="border-collapse">
        <TableHeader className="bg-gradient-to-r from-casino-dark via-casino-card to-casino-dark border-b border-gold/20">
          <TableRow className="border-gold/10">
            <TableHead className="text-gray-300 font-medium">Datum</TableHead>
            <TableHead className="text-gray-300 font-medium">Name</TableHead>
            <TableHead className="text-gray-300 font-medium">Email</TableHead>
            <TableHead className="text-gray-300 font-medium">Telefon</TableHead>
            <TableHead className="text-gray-300 font-medium">Status</TableHead>
            <TableHead className="text-gray-300 font-medium">Kommentare</TableHead>
            <TableHead className="text-gray-300 font-medium">Aktionen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <motion.tr
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="contents"
            >
              <LeadTableRow 
                lead={lead} 
                comments={comments}
                onStatusChange={onStatusChange}
                onCommentAdded={onCommentAdded}
                onLeadUpdated={onLeadUpdated}
                userEmail={userEmail || ''}
              />
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
