
import { Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const PaymentInfoCard = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Premium Konto</span>
          <span className="text-2xl font-bold text-primary">250€</span>
        </CardTitle>
        <CardDescription>Einmalzahlung für den vollständigen Zugang</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          <li className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            <span>Zugang zu allen Funktionen</span>
          </li>
          <li className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            <span>Unbegrenzte Nutzung</span>
          </li>
          <li className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            <span>Persönlicher Support</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoCard;
