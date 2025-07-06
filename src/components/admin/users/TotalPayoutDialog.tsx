import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink } from "lucide-react";

interface User {
  id: string;
  email: string;
  credit?: number | null;
}

interface TotalPayoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onPayoutCreated: () => void;
}

export const TotalPayoutDialog = ({ 
  isOpen, 
  onClose, 
  user, 
  onPayoutCreated 
}: TotalPayoutDialogProps) => {
  const { toast } = useToast();
  const [feePercentage, setFeePercentage] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string>('');

  const handleCreatePayout = async () => {
    const percentage = parseFloat(feePercentage);
    
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
      toast({
        title: "Ungültiger Prozentsatz",
        description: "Bitte geben Sie einen gültigen Prozentsatz zwischen 0.01 und 100 ein.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Nicht angemeldet");
      }

      const { data, error } = await supabase.rpc('create_total_payout_request', {
        target_user_id: user.id,
        target_user_email: user.email,
        fee_percentage_param: percentage,
        admin_user_id: sessionData.session.user.id
      });

      if (error) throw error;

      const response = data as any;
      if (response?.success) {
        const fullUrl = `${window.location.origin}/gesamtauszahlung/${response.unique_token}`;
        setCreatedUrl(fullUrl);
        
        toast({
          title: "Auszahlungsanfrage erstellt",
          description: "Die Auszahlungsanfrage wurde erfolgreich erstellt."
        });

        onPayoutCreated();
      } else {
        throw new Error(response?.message || "Unbekannter Fehler");
      }
    } catch (error: any) {
      console.error("Error creating payout request:", error);
      toast({
        title: "Fehler",
        description: "Die Auszahlungsanfrage konnte nicht erstellt werden: " + error.message,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(createdUrl);
      toast({
        title: "URL kopiert",
        description: "Die Auszahlungs-URL wurde in die Zwischenablage kopiert."
      });
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast({
        title: "Kopieren fehlgeschlagen",
        description: "Die URL konnte nicht kopiert werden.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    setFeePercentage('');
    setCreatedUrl('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-casino-card border border-gold/20">
        <DialogHeader>
          <DialogTitle className="text-gold">Gesamtauszahlung erstellen</DialogTitle>
          <DialogDescription className="text-gray-300">
            Erstellen Sie eine Auszahlungsanfrage für {user.email}
            {user.credit !== undefined && (
              <span className="block mt-1 font-medium">
                Aktuelles Guthaben: {(user.credit / 100).toFixed(2)}€
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {!createdUrl ? (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fee-percentage">Gebührenprozentsatz (%)</Label>
                <Input
                  id="fee-percentage"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="100"
                  value={feePercentage}
                  onChange={(e) => setFeePercentage(e.target.value)}
                  placeholder="z.B. 5.00 für 5%"
                  className="bg-casino-darker border-gold/20 text-white"
                />
                <p className="text-xs text-gray-400">
                  Der Benutzer muss diesen Prozentsatz seines Guthabens als Gebühr bezahlen, 
                  um die Auszahlung freizuschalten.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Abbrechen
              </Button>
              <Button 
                onClick={handleCreatePayout}
                disabled={processing || !feePercentage}
                className="bg-gold hover:bg-gold/90 text-black font-medium"
              >
                {processing ? "Erstelle..." : "Auszahlungsanfrage erstellen"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="space-y-4 py-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h4 className="font-medium text-green-400 mb-2">Auszahlungsanfrage erstellt!</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Die Auszahlungsanfrage wurde erfolgreich erstellt. 
                  Teilen Sie die folgende URL mit dem Benutzer:
                </p>
                
                <div className="bg-casino-darker p-3 rounded border border-gold/20">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-gold break-all">{createdUrl}</code>
                    <div className="flex gap-2 ml-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUrl}
                        className="bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(createdUrl, '_blank')}
                        className="bg-transparent border-gold/30 text-gold hover:bg-gold/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={handleClose}
                className="bg-gold hover:bg-gold/90 text-black font-medium"
              >
                Schließen
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};