
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LeadTableHeaderProps {
  userEmail: string | undefined;
  onLogout: () => void;
  onRefresh?: () => void;
}

export const LeadTableHeader = ({ 
  userEmail, 
  onLogout,
  onRefresh 
}: LeadTableHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-bold">Lead Management</h1>
        <p className="text-gray-600">Eingeloggt als: {userEmail}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Aktualisieren
        </Button>
        <Button variant="destructive" onClick={onLogout}>
          Ausloggen
        </Button>
      </div>
    </div>
  );
};
