
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema
const profileSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name muss mindestens 2 Zeichen lang sein.",
  }),
  email: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }).optional(),
});

interface UserSettingsFormProps {
  user: any;
  onSuccess?: () => void;
}

const UserSettingsForm = ({ user, onSuccess }: UserSettingsFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState({
    fullName: "",
    email: "",
  });

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      const email = user.email || "";
      const fullName = user.user_metadata?.full_name || "";
      
      setCurrentData({
        fullName,
        email,
      });
      
      form.reset({
        fullName,
        email,
      });
    }
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setLoading(true);
      
      // Only update if values have changed
      if (values.fullName !== currentData.fullName) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: values.fullName }
        });

        if (error) throw error;
        
        setCurrentData(prev => ({
          ...prev,
          fullName: values.fullName
        }));
      }

      toast({
        title: "Profil aktualisiert",
        description: "Ihre Profilinformationen wurden erfolgreich aktualisiert.",
      });
      
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Ihr vollständiger Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input placeholder="Ihre E-Mail Adresse" disabled {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground">Die E-Mail-Adresse kann nicht geändert werden.</p>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !form.formState.isDirty}
        >
          {loading ? "Wird aktualisiert..." : "Speichern"}
        </Button>
      </form>
    </Form>
  );
};

export default UserSettingsForm;
