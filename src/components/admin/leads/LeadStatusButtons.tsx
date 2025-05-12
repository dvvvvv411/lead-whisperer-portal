
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface LeadStatusButtonsProps {
  status: string;
  onStatusChange: (status: 'akzeptiert' | 'abgelehnt') => void;
}

export const LeadStatusButtons = ({ status, onStatusChange }: LeadStatusButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          variant="outline"
          className="bg-green-900/20 border-green-500/30 hover:bg-green-800/30 text-green-400"
          onClick={() => onStatusChange('akzeptiert')}
          disabled={status === 'akzeptiert'}
        >
          <Check className="h-4 w-4 text-green-400" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="sm"
          variant="outline"
          className="bg-red-900/20 border-red-500/30 hover:bg-red-800/30 text-red-400"
          onClick={() => onStatusChange('abgelehnt')}
          disabled={status === 'abgelehnt'}
        >
          <X className="h-4 w-4 text-red-400" />
        </Button>
      </motion.div>
    </div>
  );
};
