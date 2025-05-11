
import { useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { checkUserRole } from "@/services/roleService";
import { useToast } from "@/hooks/use-toast";

interface PaymentStatusViewProps {
  paymentId: string | null;
}

const PaymentStatusView = ({ paymentId }: PaymentStatusViewProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  // Function to manually check activation status
  const checkActivationStatus = async () => {
    setIsChecking(true);
    try {
      const isActivated = await checkUserRole('user');
      
      if (isActivated) {
        toast({
          title: "Konto aktiviert",
          description: "Ihr Konto wurde erfolgreich aktiviert! Die Seite wird aktualisiert..."
        });
        
        setTimeout(() => {
          window.location.href = '/nutzer';
        }, 1500);
      } else {
        toast({
          title: "Noch nicht aktiviert",
          description: "Ihr Konto wurde noch nicht aktiviert. Bitte haben Sie etwas Geduld oder kontaktieren Sie den Support."
        });
      }
    } catch (error) {
      console.error("Error checking activation status:", error);
      toast({
        title: "Fehler beim Überprüfen",
        description: "Es gab einen Fehler beim Überprüfen Ihres Aktivierungsstatus.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Function to refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Zahlung wird überprüft</h1>
        <p className="text-gray-600">Bitte verlassen Sie diese Seite nicht, während Ihre Zahlung überprüft wird.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Zahlungsstatus</CardTitle>
          <CardDescription>
            Ihre Zahlungsmeldung wurde erfolgreich eingereicht und wird jetzt überprüft.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-gray-50">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Wir überprüfen Ihre Zahlung</p>
            <p className="text-sm text-gray-500 text-center mt-2">
              Dies kann bis zu 15 Minuten dauern. Bitte verlassen Sie diese Seite nicht.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <p className="text-sm text-yellow-700">
                <strong>Wichtig:</strong> Bitte bleiben Sie auf dieser Seite, bis Ihre Zahlung bestätigt wurde. 
                Sie werden automatisch weitergeleitet, sobald die Überprüfung abgeschlossen ist.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4 border-t pt-4">
          <Button
            variant="outline"
            onClick={checkActivationStatus}
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Status prüfen
          </Button>
          <Button
            variant="secondary"
            onClick={refreshPage}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Seite aktualisieren
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentStatusView;
