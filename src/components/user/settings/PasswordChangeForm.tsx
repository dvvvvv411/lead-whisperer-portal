
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema with password requirements
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Aktuelles Passwort wird benötigt"),
  newPassword: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
  confirmPassword: z.string().min(8, "Passwort muss mindestens 8 Zeichen lang sein"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

interface PasswordChangeFormProps {
  user: any;
  onSuccess?: () => void;
}

const PasswordChangeForm = ({ user, onSuccess }: PasswordChangeFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    try {
      setLoading(true);
      
      // First authenticate with current password to verify user
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: values.currentPassword,
      });

      if (authError) {
        toast({
          title: "Fehler",
          description: "Das aktuelle Passwort ist nicht korrekt.",
          variant: "destructive",
        });
        return;
      }
      
      // Now update the password
      const { error } = await supabase.auth.updateUser({
        password: values.newPassword
      });

      if (error) throw error;

      // Success message
      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });
      
      // Reset form
      form.reset();
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Es ist ein Fehler aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gold-light">Aktuelles Passwort</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/30 bg-black/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gold-light">Neues Passwort</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/30 bg-black/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gold-light">Passwort bestätigen</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  className="border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/30 bg-black/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light text-black font-medium" 
          disabled={loading || !form.formState.isDirty}
        >
          {loading ? "Wird aktualisiert..." : "Passwort ändern"}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordChangeForm;
