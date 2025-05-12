
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lead } from "@/types/leads";

interface LeadDetailsDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeadDetailsDialog = ({ lead, open, onOpenChange }: LeadDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-casino-dark border-gold/20 text-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <DialogHeader>
          <DialogTitle className="text-gray-100 border-b border-gold/20 pb-2">Lead-Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium text-gray-400">Name</h3>
            <p className="text-gray-100">{lead.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-400">Email</h3>
            <p className="text-gray-100">{lead.email}</p>
          </div>
          {lead.phone && (
            <div>
              <h3 className="font-medium text-gray-400">Telefon</h3>
              <p className="text-gray-100">{lead.phone}</p>
            </div>
          )}
          {lead.company && (
            <div>
              <h3 className="font-medium text-gray-400">Unternehmen</h3>
              <p className="text-gray-100">{lead.company}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-400">Nachricht</h3>
            <p className="whitespace-pre-line text-gray-100">{lead.message}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-400">Eingegangen am</h3>
            <p className="text-gray-100">{new Date(lead.created_at).toLocaleString('de-DE')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
