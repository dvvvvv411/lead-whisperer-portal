
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface LeadFilterBarProps {
  statusFilter: string | undefined;
  onStatusFilterChange: (status: string | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const LeadFilterBar = ({ 
  statusFilter, 
  onStatusFilterChange, 
  searchQuery, 
  onSearchChange 
}: LeadFilterBarProps) => {
  return (
    <motion.div 
      className="mb-6 p-4 bg-casino-dark rounded-lg border border-gold/10 shadow-md"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="text-sm text-gray-400">Nach Status filtern:</h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Suche nach Name, Email oder Tel..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-casino-darker/50 border-gold/10 text-gray-200 placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
        </div>
      </div>
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
