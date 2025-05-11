
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadStatusButtons } from "../LeadStatusButtons";
import { LeadDetailsDialog } from "../LeadDetailsDialog";
import { Lead } from "@/types/leads";
import { CreateAccountDialog } from "../CreateAccountDialog";

interface LeadActionsProps {
  lead: Lead;
  onStatusChange: (status: 'akzeptiert' | 'abgelehnt') => void;
}

export const LeadActions = ({ lead, onStatusChange }: LeadActionsProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  
  const handleStatusChange = (status: 'akzeptiert' | 'abgelehnt') => {
    if (status === 'akzeptiert') {
      // Öffne den Account-Dialog statt direkt den Status zu ändern
      setIsCreateAccountOpen(true);
    } else {
      // Bei Ablehnung normal weiterleiten
      onStatusChange(status);
    }
  };
  
  return (
    <div className="flex space-x-2">
      <LeadStatusButtons 
        status={lead.status} 
        onStatusChange={handleStatusChange} 
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
      
      <CreateAccountDialog
        lead={lead}
        open={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
      />
    </div>
  );
};
