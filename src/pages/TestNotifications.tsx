
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const TestNotifications = () => {
  const [isLeadLoading, setIsLeadLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  const sendLeadTestNotification = async () => {
    setIsLeadLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('simple-telegram-alert', {
        body: { type: 'lead' }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast("Test erfolgreich", {
          description: "Lead-Benachrichtigung wurde gesendet"
        });
      } else {
        toast("Fehler", {
          description: data?.error || "Unbekannter Fehler",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error sending lead test notification:", error);
      toast("Fehler", {
        description: error.message || "Unbekannter Fehler",
        variant: "destructive"
      });
    } finally {
      setIsLeadLoading(false);
    }
  };

  const sendPaymentTestNotification = async () => {
    setIsPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('simple-telegram-alert', {
        body: { type: 'payment' }
      });
      
      if (error) throw error;
      
      if (data?.success) {
        toast("Test erfolgreich", {
          description: "Zahlungs-Benachrichtigung wurde gesendet"
        });
      } else {
        toast("Fehler", {
          description: data?.error || "Unbekannter Fehler",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error sending payment test notification:", error);
      toast("Fehler", {
        description: error.message || "Unbekannter Fehler",
        variant: "destructive"
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Test Telegram Benachrichtigungen
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Klicken Sie auf die Schaltflächen unten, um Testbenachrichtigungen an Telegram zu senden.
          </p>
          
          <div className="space-y-4">
            <Button 
              onClick={sendLeadTestNotification}
              disabled={isLeadLoading}
              className="w-full"
            >
              {isLeadLoading ? "Wird gesendet..." : "Lead-Benachrichtigung testen"}
            </Button>
            
            <Button 
              onClick={sendPaymentTestNotification}
              disabled={isPaymentLoading}
              className="w-full"
            >
              {isPaymentLoading ? "Wird gesendet..." : "Zahlungs-Benachrichtigung testen"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;
