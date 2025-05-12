
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Mail, ShieldCheck } from "lucide-react";

interface PasswordResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasswordResetDialog = ({ open, onOpenChange }: PasswordResetDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/password-reset`,
      });

      if (error) throw error;

      setResetSent(true);
      toast({
        title: "E-Mail gesendet",
        description: "Überprüfe deinen Posteingang für weitere Anweisungen.",
      });

    } catch (error: any) {
      toast({
        title: "Fehler beim Zurücksetzen",
        description: error.message || "Bitte überprüfe deine E-Mail-Adresse.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-casino-dark border border-gold/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Passwort zurücksetzen</DialogTitle>
          <DialogDescription className="text-gray-400">
            Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen deines Passworts zu erhalten.
          </DialogDescription>
        </DialogHeader>

        {resetSent ? (
          <div className="py-4">
            <div className="p-4 rounded-md bg-green-900/30 border border-green-500/20 mb-4">
              <p className="text-green-400 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2" />
                E-Mail zum Zurücksetzen des Passworts wurde gesendet
              </p>
            </div>
            <p className="text-gray-300 text-sm">Überprüfe deinen E-Mail Posteingang und folge den Anweisungen zum Zurücksetzen deines Passworts.</p>
            <Button 
              onClick={() => {
                onOpenChange(false);
                setResetSent(false);
              }}
              className="mt-4 w-full bg-gradient-to-r from-gold/80 to-gold-light/80"
            >
              Schließen
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">E-Mail</Label>
                <div className="relative">
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="pl-10 bg-casino-darker border-gold/30 text-white"
                    required
                  />
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-black font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Wird versendet..." : "Zurücksetzen Link senden"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordResetDialog;
