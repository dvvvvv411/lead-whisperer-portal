
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { motion } from "framer-motion";

interface LeadFilterBarProps {
  statusFilter: string | undefined;
  onStatusFilterChange: (status: string | undefined) => void;
}

export const LeadFilterBar = ({ statusFilter, onStatusFilterChange }: LeadFilterBarProps) => {
  return (
    <motion.div 
      className="mb-6 p-4 bg-casino-dark rounded-lg border border-gold/10 shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <h2 className="text-sm text-gray-400 mb-3">Nach Status filtern:</h2>
      <div className="flex flex-wrap justify-start gap-2">
        <ToggleGroup type="single" value={statusFilter} onValueChange={onStatusFilterChange} className="flex flex-wrap gap-2">
          <ToggleGroupItem 
            value="neu" 
            className="bg-blue-900/20 text-blue-400 border-blue-500/30 data-[state=on]:bg-blue-700/30 data-[state=on]:text-blue-300"
          >
            Neu
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="akzeptiert" 
            className="bg-green-900/20 text-green-400 border-green-500/30 data-[state=on]:bg-green-700/30 data-[state=on]:text-green-300"
          >
            Akzeptiert
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="abgelehnt" 
            className="bg-red-900/20 text-red-400 border-red-500/30 data-[state=on]:bg-red-700/30 data-[state=on]:text-red-300"
          >
            Abgelehnt
          </ToggleGroupItem>
        </ToggleGroup>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onStatusFilterChange(undefined)}
          className="border-gold/30 text-gray-300 hover:text-gold hover:bg-gold/10"
        >
          Alle anzeigen
        </Button>
      </div>
    </motion.div>
  );
};
