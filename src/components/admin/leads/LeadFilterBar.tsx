
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface LeadFilterBarProps {
  statusFilter: string | undefined;
  onStatusFilterChange: (status: string | undefined) => void;
}

export const LeadFilterBar = ({ statusFilter, onStatusFilterChange }: LeadFilterBarProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-sm text-gray-500 mb-2">Nach Status filtern:</h2>
      <div className="flex justify-start">
        <ToggleGroup type="single" value={statusFilter} onValueChange={onStatusFilterChange}>
          <ToggleGroupItem value="neu" className="bg-blue-100 text-blue-800 border-blue-300 data-[state=on]:bg-blue-200">
            Neu
          </ToggleGroupItem>
          <ToggleGroupItem value="akzeptiert" className="bg-green-100 text-green-800 border-green-300 data-[state=on]:bg-green-200">
            Akzeptiert
          </ToggleGroupItem>
          <ToggleGroupItem value="abgelehnt" className="bg-red-100 text-red-800 border-red-300 data-[state=on]:bg-red-200">
            Abgelehnt
          </ToggleGroupItem>
        </ToggleGroup>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onStatusFilterChange(undefined)}
          className="ml-2"
        >
          Alle anzeigen
        </Button>
      </div>
    </div>
  );
};
