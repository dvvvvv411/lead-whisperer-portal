
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdminNavbar } from "../AdminNavbar";
import { PaymentTable, Payment } from "./PaymentTable";

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
    <div className="container mx-auto p-4">
      <AdminNavbar />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Zahlungsverwaltung</h1>
        <p className="text-gray-600">Eingeloggt als: {currentUser?.email}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>Wird geladen...</p>
        </div>
      ) : (
        <PaymentTable payments={payments} onPaymentUpdated={fetchPayments} />
      )}
    </div>
  );
};
