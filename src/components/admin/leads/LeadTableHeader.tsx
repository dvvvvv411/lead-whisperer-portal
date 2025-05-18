
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import LogoutButton from "../LogoutButton";

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
    <motion.div 
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-4 md:mb-0">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
          Lead Management
        </h1>
        <p className="text-gray-400">Eingeloggt als: {userEmail}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          className="flex items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
        >
          <RefreshCw className="h-4 w-4" />
          Aktualisieren
        </Button>
        <LogoutButton 
          className="bg-red-900/50 border border-red-500/30 hover:bg-red-800/30 text-red-300"
          variant="destructive"
        />
      </div>
    </motion.div>
  );
};
