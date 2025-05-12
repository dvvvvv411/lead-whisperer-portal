
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface LeadStatusBadgeProps {
  status: string;
}

export const LeadStatusBadge = ({ status }: LeadStatusBadgeProps) => {
  switch (status) {
    case 'neu':
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-500/50 px-3">
            Neu
          </Badge>
        </motion.div>
      );
    case 'akzeptiert':
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-500/50 px-3">
            Akzeptiert
          </Badge>
        </motion.div>
      );
    case 'abgelehnt':
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-red-900/30 text-red-300 border-red-500/50 px-3">
            Abgelehnt
          </Badge>
        </motion.div>
      );
    default:
      return (
        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
          <Badge variant="outline" className="bg-gray-900/30 text-gray-300 border-gray-500/50 px-3">
            Unbekannt
          </Badge>
        </motion.div>
      );
  }
};
