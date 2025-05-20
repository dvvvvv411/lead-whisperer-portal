
import { useState, useEffect, useRef } from "react";
import { AdminNavbar } from "@/components/admin/AdminNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Phone, Info, Building, MapPin, User, Globe, Link, FileImage } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Json } from "@/integrations/supabase/types";

interface RebrandingFormData {
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  company_name: string;
  street: string;
  postal_code: string;
  city: string;
  ceo_1: string;
  ceo_2: string;
  phone_number: string;
  email: string;
  vat_id: string;
  press_links: {
    handelsblatt: string;
    focus: string;
    wiwo: string;
  };
}

interface PressLinkItem {
  name: string;
  url: string;
}

const AdminRebranding = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const faviconFileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<RebrandingFormData>({
    defaultValues: {
      site_name: 'bitloon',
      site_description: 'KI-gesteuertes Krypto-Investment der nächsten Generation',
      logo_url: 'https://i.imgur.com/Q191f5z.png',
      favicon_url: '/favicon.svg',
      company_name: 'GMS Management und Service GmbH',
      street: 'Platz der Republik 6',
      postal_code: '60325',
      city: 'Frankfurt am Main',
      ceo_1: 'Stefan Schlieter',
      ceo_2: 'Walid Abu Al Ghon',
      phone_number: '+49 (0) 69 254 931 30',
      email: 'info@gms-service.de',
      vat_id: 'DE341123456',
      press_links: {
        handelsblatt: 'https://www.handels-blatt.com/finanzen/steuern-recht/steuern/frankfurter-start-up-bitloon-ki-plattform-fuer-krypto-investments-sorgt-fuer-aufmerksamkeit/100124798.html',
        focus: 'https://www.focus-online.net/finanzen/boerse/frankfurter-ki-fintech-bitloon-ueberzeugt-erste-anleger-carsten-maschmeyer-zeigt-sich-beeindruckt-von-automatisierter-krypto-plattform_025fd55e-1d5f-4964-83c2-8e73df7c6012.html',
        wiwo: 'https://www.wirtschafts-woche.net/finanzen/geldanlage/bitloon-aus-frankfurt-wie-ein-ki-start-up-den-krypto-handel-professionalisieren-will/100127150.html'
      }
    }
  });

  useEffect(() => {
    const fetchBrandingData = async () => {
      try {
        const { data, error } = await supabase
          .from('legal_info')
          .select('*')
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Parse press links from JSON if available
          let pressLinks = {
            handelsblatt: 'https://www.handels-blatt.com/finanzen/steuern-recht/steuern/frankfurter-start-up-bitloon-ki-plattform-fuer-krypto-investments-sorgt-fuer-aufmerksamkeit/100124798.html',
            focus: 'https://www.focus-online.net/finanzen/boerse/frankfurter-ki-fintech-bitloon-ueberzeugt-erste-anleger-carsten-maschmeyer-zeigt-sich-beeindruckt-von-automatisierter-krypto-plattform_025fd55e-1d5f-4964-83c2-8e73df7c6012.html',
            wiwo: 'https://www.wirtschafts-woche.net/finanzen/geldanlage/bitloon-aus-frankfurt-wie-ein-ki-start-up-den-krypto-handel-professionalisieren-will/100127150.html'
          };
          
          // Try to parse press_links from database
          if (data.press_links && Array.isArray(data.press_links)) {
            try {
              // First convert Json[] to unknown, then to PressLinkItem[]
              const pressList = data.press_links as unknown as PressLinkItem[];
              
              // Map the array of PressLinkItem to our form structure
              pressList.forEach(item => {
                if (item.name === 'Handelsblatt' && item.url) {
                  pressLinks.handelsblatt = item.url;
                } else if (item.name === 'Focus' && item.url) {
                  pressLinks.focus = item.url;
                } else if (item.name === 'WirtschaftsWoche' && item.url) {
                  pressLinks.wiwo = item.url;
                }
              });
            } catch (parseError) {
              console.error("Error parsing press links:", parseError);
            }
          }
          
          // Form reset with retrieved data
          form.reset({
            site_name: data.site_name,
            site_description: data.site_description,
            logo_url: data.logo_url,
            favicon_url: data.favicon_url,
            company_name: data.company_name,
            street: data.street,
            postal_code: data.postal_code,
            city: data.city,
            ceo_1: data.ceo_1,
            ceo_2: data.ceo_2,
            phone_number: data.phone_number,
            email: data.email,
            vat_id: data.vat_id,
            press_links: pressLinks
          });
          
          // Set image previews
          setLogoPreview(data.logo_url);
          setFaviconPreview(data.favicon_url);
        }
      } catch (error) {
        console.error("Error fetching branding info:", error);
        toast({
          title: "Fehler",
          description: "Die Branding-Informationen konnten nicht geladen werden.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrandingData();
  }, [form]);

  const handleLogoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Fehler",
        description: "Das Logo darf maximal 5MB groß sein.",
        variant: "destructive"
      });
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      setLogoPreview(result);
      form.setValue('logo_url', result);
    };
    fileReader.readAsDataURL(file);
  };

  const handleFaviconChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.size > 1 * 1024 * 1024) { // 1MB limit
      toast({
        title: "Fehler",
        description: "Das Favicon darf maximal 1MB groß sein.",
        variant: "destructive"
      });
      return;
    }
    
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      setFaviconPreview(result);
      form.setValue('favicon_url', result);
    };
    fileReader.readAsDataURL(file);
  };

  const onSubmit = async (values: RebrandingFormData) => {
    setSubmitting(true);
    try {
      // Prepare press_links as JSON for storage
      // Ensure we're creating the correct JSON structure for Supabase
      const pressLinksJson = [
        {
          name: "Handelsblatt",
          url: values.press_links.handelsblatt
        },
        {
          name: "Focus",
          url: values.press_links.focus
        },
        {
          name: "WirtschaftsWoche",
          url: values.press_links.wiwo
        }
      ] as Json;
      
      // Get the legal info id first to make sure it exists
      const { data: infoData, error: infoError } = await supabase
        .from('legal_info')
        .select('id')
        .single();
        
      if (infoError) {
        console.error("Error fetching legal info id:", infoError);
        throw new Error("Could not find legal info record");
      }
      
      const { error } = await supabase
        .from('legal_info')
        .update({
          site_name: values.site_name,
          site_description: values.site_description,
          logo_url: values.logo_url,
          favicon_url: values.favicon_url,
          company_name: values.company_name,
          street: values.street,
          postal_code: values.postal_code,
          city: values.city,
          ceo_1: values.ceo_1,
          ceo_2: values.ceo_2,
          phone_number: values.phone_number,
          email: values.email,
          vat_id: values.vat_id,
          press_links: pressLinksJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', infoData.id);
      
      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }
      
      toast({
        title: "Erfolgreich gespeichert",
        description: "Die Branding-Informationen wurden erfolgreich aktualisiert.",
      });
      
      // Refresh the page to apply new branding
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error("Error updating branding info:", error);
      toast({
        title: "Fehler",
        description: "Die Änderungen konnten nicht gespeichert werden. Bitte prüfen Sie die Eingaben und versuchen Sie es erneut.",
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
          Rebranding
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Site Identity */}
              <Card className="border-gold/10 bg-casino-card mb-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-200 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-gold" />
                    Website Identity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="site_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seitenname</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="z.B. bitloon" 
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
                    name="site_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Seitenbeschreibung</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Kurze Beschreibung der Webseite" 
                            {...field}
                            className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Visual Assets */}
              <Card className="border-gold/10 bg-casino-card mb-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-200 flex items-center">
                    <FileImage className="w-5 h-5 mr-2 text-gold" />
                    Visuelle Elemente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormItem>
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <Input 
                              type="file"
                              accept="image/*"
                              ref={logoFileInputRef}
                              onChange={handleLogoChange}
                              className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                            />
                            <Input 
                              type="text"
                              placeholder="oder URL eingeben" 
                              value={form.watch('logo_url')}
                              onChange={(e) => {
                                form.setValue('logo_url', e.target.value);
                                setLogoPreview(e.target.value);
                              }}
                              className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                    <div className="flex justify-center items-center border border-dashed border-gray-600 rounded-md p-4 bg-casino-darker">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo Vorschau" 
                          className="max-h-20 object-contain"
                        />
                      ) : (
                        <div className="text-gray-500 text-center">
                          <FileImage className="w-10 h-10 mx-auto mb-2" />
                          <p>Logo Vorschau</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Favicon Upload */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <FormItem>
                        <FormLabel>Favicon</FormLabel>
                        <FormControl>
                          <div className="flex flex-col space-y-2">
                            <Input 
                              type="file"
                              accept="image/*"
                              ref={faviconFileInputRef}
                              onChange={handleFaviconChange}
                              className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                            />
                            <Input 
                              type="text"
                              placeholder="oder URL eingeben" 
                              value={form.watch('favicon_url')}
                              onChange={(e) => {
                                form.setValue('favicon_url', e.target.value);
                                setFaviconPreview(e.target.value);
                              }}
                              className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </div>
                    <div className="flex justify-center items-center border border-dashed border-gray-600 rounded-md p-4 bg-casino-darker">
                      {faviconPreview ? (
                        <img 
                          src={faviconPreview} 
                          alt="Favicon Vorschau" 
                          className="max-h-10 object-contain"
                        />
                      ) : (
                        <div className="text-gray-500 text-center">
                          <FileImage className="w-6 h-6 mx-auto mb-2" />
                          <p>Favicon Vorschau</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Press Links */}
              <Card className="border-gold/10 bg-casino-card mb-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-200 flex items-center">
                    <Link className="w-5 h-5 mr-2 text-gold" />
                    Presse-Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="press_links.handelsblatt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Handelsblatt Link</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://..." 
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
                    name="press_links.focus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Focus Link</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://..." 
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
                    name="press_links.wiwo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WirtschaftsWoche Link</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://..." 
                            {...field}
                            className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card className="border-gold/10 bg-casino-card mb-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-200 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-gold" />
                    Unternehmens-Informationen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Building className="w-4 h-4 mr-2 text-gold" />
                            Unternehmensname
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Unternehmensname eingeben" 
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
                  </div>
                  
                  <Separator className="my-6 bg-gray-700" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-gold" />
                            Straße
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Straße und Hausnummer eingeben" 
                              {...field}
                              className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="postal_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PLZ</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="PLZ" 
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
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stadt</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Stadt" 
                                {...field}
                                className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator className="my-6 bg-gray-700" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="ceo_1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gold" />
                            Geschäftsführer 1
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Name des ersten Geschäftsführers" 
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
                      name="ceo_2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gold" />
                            Geschäftsführer 2
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Name des zweiten Geschäftsführers" 
                              {...field}
                              className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator className="my-6 bg-gray-700" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  className="bg-gold hover:bg-gold/80 text-black"
                  disabled={submitting}
                  size="lg"
                >
                  {submitting ? "Wird gespeichert..." : "Änderungen speichern"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="text-sm text-gray-400 mt-6">
            <p>Hinweis: Nach dem Speichern der Änderungen werden diese sofort auf der gesamten Website angewendet.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRebranding;
