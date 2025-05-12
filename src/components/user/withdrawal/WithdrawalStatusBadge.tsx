
import { Badge } from "@/components/ui/badge";

interface WithdrawalStatusBadgeProps {
  status: string;
}

const WithdrawalStatusBadge = ({ status }: WithdrawalStatusBadgeProps) => {
  console.log("User withdrawal status badge with status:", status);
  
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-900/30 border-gold/30 text-gold-light hover:bg-yellow-900/40">Ausstehend</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-900/30 border-green-500/30 text-green-300 hover:bg-green-900/40">Abgeschlossen</Badge>;
    case "rejected":
      return <Badge variant="outline" className="bg-red-900/30 border-red-500/30 text-red-300 hover:bg-red-900/40">Abgelehnt</Badge>;
    default:
      return <Badge variant="outline" className="border-gold/30 text-gold-light">{status}</Badge>;
  }
};

export default WithdrawalStatusBadge;
