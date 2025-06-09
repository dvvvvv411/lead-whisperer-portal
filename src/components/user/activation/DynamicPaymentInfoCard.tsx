
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Shield, CheckCircle2, Clock } from "lucide-react";

interface DynamicPaymentInfoCardProps {
  requiredAmount: number;
  userCredit: number | null;
  invitationCode?: string | null;
}

const DynamicPaymentInfoCard = ({ requiredAmount, userCredit, invitationCode }: DynamicPaymentInfoCardProps) => {
  const remainingAmount = Math.max(0, requiredAmount - (userCredit || 0));
  
  return (
    <CardContent className="space-y-4">
      {/* Invitation code bonus message */}
      {invitationCode && userCredit && userCredit > 0 && (
        <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="text-green-400 font-semibold mb-1">Einladungscode verwendet!</h4>
              <p className="text-green-300 text-sm">
                Sie haben den Einladungscode <span className="font-mono bg-green-800/30 px-2 py-1 rounded">{invitationCode}</span> verwendet 
                und erhalten deshalb 50€ Startguthaben.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Payment instructions */}
      <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-semibold mb-2">Zahlungsanweisungen</h4>
            <div className="text-blue-200 text-sm space-y-2">
              <p>
                <strong>Bitte senden Sie genau {remainingAmount.toFixed(2)}€ in BTC an die oben angegebene Adresse.</strong>
              </p>
              <p>
                Verwenden Sie ausschließlich die angezeigte Wallet-Adresse für Ihre Zahlung.
              </p>
              <p>
                Die Aktivierung erfolgt automatisch nach Bestätigung der Blockchain-Transaktion.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Security notice */}
      <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-gold mt-0.5" />
          <div>
            <h4 className="text-gold font-semibold mb-2">Sicherheitshinweis</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>
                Ihre Zahlung wird automatisch über die Blockchain überwacht und verarbeitet.
              </p>
              <p>
                Bitte senden Sie nur Bitcoin (BTC) an diese Adresse. Andere Kryptowährungen gehen verloren.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Processing time */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
          <div>
            <h4 className="text-slate-300 font-semibold mb-2">Bearbeitungszeit</h4>
            <p className="text-slate-400 text-sm">
              Die Aktivierung erfolgt in der Regel innerhalb von 10-15 Minuten nach der Blockchain-Bestätigung.
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  );
};

export default DynamicPaymentInfoCard;
