
import { Badge } from "@/components/ui/badge";

interface WithdrawalStatusBadgeProps {
  status: string;
}

const WithdrawalStatusBadge = ({ status }: WithdrawalStatusBadgeProps) => {
  console.log("User withdrawal status badge with status:", status);
  
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50">Ausstehend</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Abgeschlossen</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Abgelehnt</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default WithdrawalStatusBadge;
