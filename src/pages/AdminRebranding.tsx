
import { useState, useEffect } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { motion } from "framer-motion";
import SiteRebrandingForm from "@/components/admin/rebranding/SiteRebrandingForm";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminRebranding = () => {
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
            Website Rebranding
          </h1>
          <p className="text-gray-400 mt-2">
            Passen Sie das Erscheinungsbild und die Informationen der Website an.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert className="mb-6 border-amber-500/50 bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Wichtiger Hinweis</AlertTitle>
            <AlertDescription className="text-amber-500/80">
              Änderungen werden sofort auf der gesamten Website sichtbar sein. Stellen Sie sicher, dass die eingegebenen Informationen korrekt sind.
            </AlertDescription>
          </Alert>
          
          <SiteRebrandingForm />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRebranding;
