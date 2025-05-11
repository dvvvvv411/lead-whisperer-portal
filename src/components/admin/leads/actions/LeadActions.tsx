
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadStatusButtons } from "../LeadStatusButtons";
import { LeadDetailsDialog } from "../LeadDetailsDialog";
import { Lead } from "@/types/leads";

interface LeadActionsProps {
  lead: Lead;
  onStatusChange: (status: 'akzeptiert' | 'abgelehnt') => void;
}

export const LeadActions = ({ lead, onStatusChange }: LeadActionsProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  return (
    <div className="flex space-x-2">
      <LeadStatusButtons 
        status={lead.status} 
        onStatusChange={onStatusChange} 
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
  );
};
