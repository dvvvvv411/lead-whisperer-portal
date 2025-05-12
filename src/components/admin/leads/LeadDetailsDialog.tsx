
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
      <DialogContent className="bg-casino-dark border-gold/20 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Lead-Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium text-gray-300">Name</h3>
            <p className="text-gray-100">{lead.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300">Email</h3>
            <p className="text-gray-100">{lead.email}</p>
          </div>
          {lead.phone && (
            <div>
              <h3 className="font-medium text-gray-300">Telefon</h3>
              <p className="text-gray-100">{lead.phone}</p>
            </div>
          )}
          {lead.company && (
            <div>
              <h3 className="font-medium text-gray-300">Unternehmen</h3>
              <p className="text-gray-100">{lead.company}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium text-gray-300">Nachricht</h3>
            <p className="whitespace-pre-line text-gray-100">{lead.message}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-300">Eingegangen am</h3>
            <p className="text-gray-100">{new Date(lead.created_at).toLocaleString('de-DE')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
