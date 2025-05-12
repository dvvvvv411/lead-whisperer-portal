
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lead } from "@/types/leads";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LeadDetailsDialogProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadUpdated?: (updatedLead: Lead) => void;
}

export const LeadDetailsDialog = ({ lead, open, onOpenChange, onLeadUpdated }: LeadDetailsDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form setup using react-hook-form
  const form = useForm({
    defaultValues: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
    }
  });

  const handleSubmit = async (values: { name: string; email: string; phone: string }) => {
    setIsLoading(true);
    
    try {
      // Führe die Aktualisierung in der Datenbank durch
      const { data, error } = await supabase
        .from('leads')
        .update({
          name: values.name,
          email: values.email,
          phone: values.phone || null
        })
        .eq('id', lead.id)
        .select();
      
      if (error) {
        throw error;
      }
      
      // Benachrichtige den User über den Erfolg
      toast({
        title: "Erfolgreich aktualisiert",
        description: "Die Lead-Daten wurden aktualisiert.",
      });
      
      // Benachrichtige das Elternelement über die Aktualisierung
      if (onLeadUpdated && data && data[0]) {
        onLeadUpdated(data[0] as Lead);
      }
      
      // Schließe den Dialog
      onOpenChange(false);
      
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Leads:", error);
      toast({
        title: "Fehler",
        description: "Die Lead-Daten konnten nicht aktualisiert werden.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-casino-dark border-gold/20 text-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <DialogHeader>
          <DialogTitle className="text-gray-100 border-b border-gold/20 pb-2">Lead bearbeiten</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="bg-casino-darker/70 border-gold/20 text-gray-200 focus:border-blue-500/40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      type="email"
                      className="bg-casino-darker/70 border-gold/20 text-gray-200 focus:border-blue-500/40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Telefon</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      className="bg-casino-darker/70 border-gold/20 text-gray-200 focus:border-blue-500/40"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div>
              <h3 className="font-medium text-gray-400">Eingegangen am</h3>
              <p className="text-gray-100">{new Date(lead.created_at).toLocaleString('de-DE')}</p>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="border-gold/30 text-gray-300 hover:bg-casino-darker"
              >
                Abbrechen
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? "Wird gespeichert..." : "Speichern"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
