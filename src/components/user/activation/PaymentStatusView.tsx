
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface PaymentStatusViewProps {
  paymentId: string | null;
}

const PaymentStatusView = ({ paymentId }: PaymentStatusViewProps) => {
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
      </Card>
    </div>
  );
};

export default PaymentStatusView;
