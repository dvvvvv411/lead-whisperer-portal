
import { Badge } from "@/components/ui/badge";

interface LeadStatusBadgeProps {
  status: string;
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  switch (status) {
    case 'neu':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Neu</Badge>;
    case 'akzeptiert':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Akzeptiert</Badge>;
    case 'abgelehnt':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Abgelehnt</Badge>;
    default:
      return <Badge variant="outline">Unbekannt</Badge>;
  }
};
