
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface LeadDetailsDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LeadDetailsDialog = ({ lead, open, onOpenChange }: LeadDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Lead-Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <h3 className="font-medium">Name</h3>
            <p>{lead.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Email</h3>
            <p>{lead.email}</p>
          </div>
          {lead.phone && (
            <div>
              <h3 className="font-medium">Telefon</h3>
              <p>{lead.phone}</p>
            </div>
          )}
          {lead.company && (
            <div>
              <h3 className="font-medium">Unternehmen</h3>
              <p>{lead.company}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium">Nachricht</h3>
            <p className="whitespace-pre-line">{lead.message}</p>
          </div>
          <div>
            <h3 className="font-medium">Eingegangen am</h3>
            <p>{new Date(lead.created_at).toLocaleString('de-DE')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
