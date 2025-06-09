
import { UserPlus } from "lucide-react";
import { motion } from "framer-motion";

const InvitationCodeMessage = () => {
  return (
    <motion.div 
      className="mt-6 p-3 rounded-lg bg-green-900/20 border border-green-700/30"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center">
        <div className="mr-3 p-1.5 rounded-full bg-green-600 text-white">
          <UserPlus className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-green-400">
            Einladungscode verwendet!
          </p>
          <p className="text-sm text-green-300">
            Sie haben den Einladungscode %CODE% verwendet und erhalten deshalb 50€ Startguthaben.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InvitationCodeMessage;
