
import { Button } from "@/components/ui/button";

interface LeadTableHeaderProps {
  userEmail: string | undefined;
  onLogout: () => void;
}

export const LeadTableHeader = ({ userEmail, onLogout }: LeadTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Lead-Verwaltung</h1>
      <div className="flex items-center gap-2">
        {userEmail && <span className="text-sm text-gray-600">Angemeldet als: {userEmail}</span>}
        <Button variant="outline" onClick={onLogout}>Abmelden</Button>
      </div>
    </div>
  );
};
