
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "../AdminNavbar";
import { PaymentTable, Payment } from "./PaymentTable";
import { motion } from "framer-motion";

export const PaymentManager = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Benutzer-Session abrufen
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setCurrentUser(data.user);
      } else {
        // Wenn kein Benutzer eingeloggt ist, zur Login-Seite weiterleiten
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, []);

  // Zahlungen abrufen
  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      
      // Zahlungen über die gesicherte Funktion abrufen (nur für Admins)
      const { data, error } = await supabase.rpc('get_all_payments');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setPayments(data as Payment[]);
      }
    } catch (error: any) {
      console.error("Fehler beim Abrufen der Zahlungen:", error);
      toast({
        title: "Fehler beim Laden",
        description: "Die Zahlungsdaten konnten nicht geladen werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial Load of payments
  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      
      <div className="container mx-auto p-4">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-purple-300 to-purple-400 bg-clip-text text-transparent">
            Zahlungsverwaltung
          </h1>
          <p className="text-gray-400">Eingeloggt als: {currentUser?.email}</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-purple-500/20 rounded-full mb-4 flex items-center justify-center">
                <div className="h-6 w-6 bg-purple-500/60 rounded-full animate-ping"></div>
              </div>
              <p>Wird geladen...</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-casino-card p-6 rounded-lg border border-gold/10 shadow-lg">
              <PaymentTable payments={payments} onPaymentUpdated={fetchPayments} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
