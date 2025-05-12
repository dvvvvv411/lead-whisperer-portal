
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface WithdrawalStatusBadgeProps {
  status: string;
}

const WithdrawalStatusBadge = ({ status }: WithdrawalStatusBadgeProps) => {
  console.log("Admin withdrawal status badge with status:", status);
  
  switch (status) {
    case "pending":
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-yellow-900/30 text-yellow-300 border-yellow-500/50">
            Ausstehend
          </Badge>
        </motion.div>
      );
    case "completed":
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/50">
            Abgeschlossen
          </Badge>
        </motion.div>
      );
    case "rejected":
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-500/50">
            Abgelehnt
          </Badge>
        </motion.div>
      );
    default:
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline">{status}</Badge>
        </motion.div>
      );
  }
};

export default WithdrawalStatusBadge;
