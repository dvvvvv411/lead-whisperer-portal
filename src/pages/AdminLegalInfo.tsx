
import { useState, useEffect } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Phone, Info } from "lucide-react";

interface LegalInfo {
  id: string;
  phone_number: string;
  email: string;
  vat_id: string;
  updated_at: string | null;
}

const AdminLegalInfo = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const form = useForm<Omit<LegalInfo, 'id' | 'updated_at'>>({
    defaultValues: {
      phone_number: '',
      email: '',
      vat_id: ''
    }
  });

  // Check if user has access to this page
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          window.location.href = "/admin";
          return;
        }
        
        if (!data.user) {
          console.log("No user found, redirecting to admin");
          window.location.href = "/admin";
          return;
        }
        
        setUser(data.user);
        
        // Allow access for specific admin users by ID
        if (data.user.id === "7eccf781-5911-4d90-a683-1df251069a2f" || 
            data.user.id === "054c7ee0-7f82-4e34-a0c0-45552f6a67f8") {
          console.log(`Access granted to legal info for user with ID: ${data.user.id}`);
          setIsAllowed(true);
        } else {
          // For other users, check if they're admins
          const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
            _user_id: data.user.id,
            _role: 'admin'
          });
          
          if (roleError) {
            console.error("Error checking admin role:", roleError);
          }
          
          setIsAllowed(isAdmin || false);
          console.log(`Admin role check for user ${data.user.id}: ${isAdmin ? "Is admin" : "Not admin"}`);
        }
        
        if (!isAllowed) {
          window.location.href = "/admin";
          return;
        }
        
        // Proceed with fetching legal info
        fetchLegalInfo();
      } catch (err) {
        console.error("Unexpected error during access check:", err);
        window.location.href = "/admin";
      }
    };
    
    checkAccess();
  }, []);

  const fetchLegalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_info')
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        form.reset({
          phone_number: data.phone_number,
          email: data.email,
          vat_id: data.vat_id
        });
      }
    } catch (error) {
      console.error("Error fetching legal info:", error);
      toast({
        title: "Fehler",
        description: "Die Rechtsinformationen konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: Omit<LegalInfo, 'id' | 'updated_at'>) => {
    if (!isAllowed) {
      toast({
        title: "Fehler",
        description: "Sie haben keine Berechtigung, diese Informationen zu ändern.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('legal_info')
        .update({
          phone_number: values.phone_number,
          email: values.email,
          vat_id: values.vat_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('legal_info').select('id').single()).data.id)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
    } catch (error) {
      console.error("Error updating legal info:", error);
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-darker text-gray-300">
        <AdminNavbar />
        <div className="container mx-auto p-4">
          <div className="flex justify-center items-center mt-10">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-gold/20 rounded-full mb-4 flex items-center justify-center">
                <div className="h-6 w-6 bg-gold rounded-full animate-ping"></div>
              </div>
              <p>Wird geladen...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAllowed) {
    console.log("Access denied to legal info page, redirecting to admin");
    window.location.href = "/admin";
    return null;
  }

  return (
    <div className="min-h-screen bg-casino-darker text-gray-300">
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <motion.h1 
          className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Rechtstexte verwalten
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-gold/10 bg-casino-card mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200 flex items-center">
                <Info className="w-5 h-5 mr-2 text-gold" />
                Impressum-Daten bearbeiten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gold" />
                          Telefonnummer
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Telefonnummer eingeben" 
                            {...field}
                            className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
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
                        <FormLabel className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gold" />
                          E-Mail-Adresse
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="E-Mail-Adresse eingeben" 
                            {...field}
                            className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="vat_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Info className="w-4 h-4 mr-2 text-gold" />
                          Umsatzsteuer-ID
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Umsatzsteuer-ID eingeben" 
                            {...field}
                            className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-gold hover:bg-gold/80 text-black"
                    disabled={submitting}
                  >
                    {submitting ? "Wird gespeichert..." : "Änderungen speichern"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-400 mt-4">
            <p>Hinweis: Die hier vorgenommenen Änderungen werden sofort im Impressum der Webseite angezeigt.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLegalInfo;
