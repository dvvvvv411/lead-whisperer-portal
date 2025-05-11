
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface LeadStatusButtonsProps {
  status: string;
  onStatusChange: (status: 'akzeptiert' | 'abgelehnt') => void;
}

export const LeadStatusButtons = ({ status, onStatusChange }: LeadStatusButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        className="bg-green-50 hover:bg-green-100"
        onClick={() => onStatusChange('akzeptiert')}
        disabled={status === 'akzeptiert'}
      >
        <Check className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="bg-red-50 hover:bg-red-100"
        onClick={() => onStatusChange('abgelehnt')}
        disabled={status === 'abgelehnt'}
      >
        <X className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );
};
