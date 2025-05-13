
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
  phone: z.string().min(5, {
    message: "Telefonnummer muss mindestens 5 Zeichen lang sein.",
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
    phone: "",
  });

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      const email = user.email || "";
      const fullName = user.user_metadata?.full_name || "";
      // Changed from phone_number to phone for consistency
      const phone = user.user_metadata?.phone || "";
      
      setCurrentData({
        fullName,
        email,
        phone,
      });
      
      form.reset({
        fullName,
        email,
        phone,
      });
    }
  }, [user, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      setLoading(true);
      
      // Only update if values have changed
      if (values.fullName !== currentData.fullName || values.phone !== currentData.phone) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            full_name: values.fullName,
            // Changed from phone_number to phone for consistency
            phone: values.phone
          }
        });

        if (error) throw error;
        
        setCurrentData(prev => ({
          ...prev,
          fullName: values.fullName,
          phone: values.phone || ""
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
              <FormLabel className="text-gold-light">Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder={currentData.fullName || "Ihr vollständiger Name"} 
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gold-light">Telefonnummer</FormLabel>
              <FormControl>
                <Input 
                  placeholder={currentData.phone || "Ihre Telefonnummer"} 
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gold-light">E-Mail</FormLabel>
              <FormControl>
                <Input 
                  placeholder={currentData.email || "Ihre E-Mail Adresse"} 
                  disabled 
                  {...field} 
                  className="border-gold/30 bg-black/20 text-white/60"
                />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-gold/60 italic">Die E-Mail-Adresse kann nicht geändert werden.</p>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-gradient-to-r from-gold/80 to-gold hover:from-gold hover:to-gold-light text-black font-medium" 
          disabled={loading || !form.formState.isDirty}
        >
          {loading ? "Wird aktualisiert..." : "Speichern"}
        </Button>
      </form>
    </Form>
  );
};

export default UserSettingsForm;
