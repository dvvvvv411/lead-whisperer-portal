
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

  // Get user session
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          console.log("PaymentManager: User found", data.user.email);
          setCurrentUser(data.user);
        } else {
          console.log("PaymentManager: No user found, redirecting to admin login");
          window.location.href = "/admin";
        }
      } catch (error) {
        console.error("PaymentManager: Error getting user:", error);
        window.location.href = "/admin";
      }
    };
    
    getUser();
  }, []);

  // Fetch payments with enhanced error handling
  const fetchPayments = async () => {
    if (!currentUser) return;
    
    try {
      setIsLoading(true);
      
      console.log("PaymentManager: Fetching payments for user:", currentUser.id);
      
      // Use the secure RPC function to get all payments (admin only)
      const { data, error } = await supabase.rpc('get_all_payments');
      
      if (error) {
        console.error("PaymentManager: Error from get_all_payments RPC:", error);
        throw error;
      }
      
      console.log("PaymentManager: Successfully fetched payments:", data?.length || 0);
      
      if (data) {
        setPayments(data as Payment[]);
      }
    } catch (error: any) {
      console.error("PaymentManager: Error fetching payments:", error);
      
      // Provide more specific error messages
      let errorMessage = "Die Zahlungsdaten konnten nicht geladen werden.";
      
      if (error.message?.includes('Nur Administratoren')) {
        errorMessage = "Zugriff verweigert. Nur Administratoren können Zahlungen einsehen.";
      } else if (error.message?.includes('RPC call failed')) {
        errorMessage = "Datenbankfehler beim Laden der Zahlungen.";
      }
      
      toast({
        title: "Fehler beim Laden",
        description: errorMessage + " Details: " + error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial load of payments
  useEffect(() => {
    if (currentUser) {
      fetchPayments();
    }
  }, [currentUser]);

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
