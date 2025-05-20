
import { useState, useEffect } from "react";
import { useBranding } from "@/contexts/BrandingContext";
import { updateBrandingInfo, uploadFile, BrandingInfo } from "@/services/brandingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  Globe, 
  FileImage, 
  Link,
  Trash2,
  PlusCircle,
  Upload,
  InfoIcon
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

const SiteRebrandingForm = () => {
  const { branding, refreshBranding } = useBranding();
  const [submitting, setSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [pressLinks, setPressLinks] = useState<Array<{ name: string, url: string }>>([]);
  
  const form = useForm<BrandingInfo>({
    defaultValues: {
      site_name: "",
      site_description: "",
      logo_url: "",
      favicon_url: "",
      press_links: [],
      phone_number: "",
      email: "",
      vat_id: ""
    }
  });

  // Initialize form with branding data
  useEffect(() => {
    if (branding) {
      form.reset({
        site_name: branding.site_name,
        site_description: branding.site_description,
        logo_url: branding.logo_url,
        favicon_url: branding.favicon_url,
        press_links: branding.press_links || [],
        phone_number: branding.phone_number,
        email: branding.email,
        vat_id: branding.vat_id
      });
      
      setLogoPreview(branding.logo_url);
      setFaviconPreview(branding.favicon_url);
      setPressLinks(branding.press_links || []);
    }
  }, [branding, form]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaviconFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setFaviconPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPressLink = () => {
    setPressLinks([...pressLinks, { name: "", url: "" }]);
  };

  const removePressLink = (index: number) => {
    const updatedLinks = [...pressLinks];
    updatedLinks.splice(index, 1);
    setPressLinks(updatedLinks);
  };

  const updatePressLink = (index: number, field: 'name' | 'url', value: string) => {
    const updatedLinks = [...pressLinks];
    updatedLinks[index][field] = value;
    setPressLinks(updatedLinks);
  };

  const onSubmit = async (values: BrandingInfo) => {
    setSubmitting(true);
    try {
      // Handle logo upload if selected
      if (logoFile) {
        const logoResult = await uploadFile(logoFile, "logos");
        if (logoResult.success && logoResult.url) {
          values.logo_url = logoResult.url;
        } else {
          toast({
            title: "Fehler beim Logo-Upload",
            description: logoResult.error || "Unbekannter Fehler",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Handle favicon upload if selected
      if (faviconFile) {
        const faviconResult = await uploadFile(faviconFile, "favicons");
        if (faviconResult.success && faviconResult.url) {
          values.favicon_url = faviconResult.url;
        } else {
          toast({
            title: "Fehler beim Favicon-Upload",
            description: faviconResult.error || "Unbekannter Fehler",
            variant: "destructive"
          });
          return;
        }
      }
      
      // Add press links to values
      values.press_links = pressLinks;
      
      // Update branding info
      const result = await updateBrandingInfo(values);
      
      if (result.success) {
        toast({
          title: "Erfolgreich gespeichert",
          description: "Die Branding-Einstellungen wurden aktualisiert."
        });
        
        // Refresh branding context
        refreshBranding();
      } else {
        toast({
          title: "Fehler",
          description: result.error || "Die Änderungen konnten nicht gespeichert werden.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200 flex items-center">
              <Globe className="w-5 h-5 mr-2 text-gold" />
              Allgemeine Einstellungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="site_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="z.B. bitloon" 
                      {...field}
                      className="bg-casino-darker text-gray-200 border-gray-700 focus-visible:ring-gold"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-400 mt-1">
                    Dieser Name ersetzt "bitloon" auf der gesamten Website.
                  </p>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="site_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Beschreibung</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Beschreibung der Website" 
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
        
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200 flex items-center">
              <FileImage className="w-5 h-5 mr-2 text-gold" />
              Logo & Favicon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      className="bg-casino-darker text-gray-200 border-gray-700"
                      onChange={handleLogoChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (branding) {
                          setLogoPreview(branding.logo_url);
                          setLogoFile(null);
                        }
                      }}
                    >
                      Zurücksetzen
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Empfohlene Größe: 200x50 Pixel, transparenter Hintergrund (PNG)
                  </p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg flex items-center justify-center min-w-[150px] min-h-[60px]">
                  {logoPreview && (
                    <img 
                      src={logoPreview} 
                      alt="Logo Vorschau" 
                      className="h-10 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
            
            {/* Favicon Upload */}
            <div className="space-y-2">
              <Label>Favicon</Label>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept=".svg,.png,.ico,image/svg+xml,image/png,image/x-icon"
                      className="bg-casino-darker text-gray-200 border-gray-700"
                      onChange={handleFaviconChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (branding) {
                          setFaviconPreview(branding.favicon_url);
                          setFaviconFile(null);
                        }
                      }}
                    >
                      Zurücksetzen
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Empfohlene Formate: SVG oder PNG, 32x32 oder 64x64 Pixel
                  </p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg flex items-center justify-center min-w-[60px] min-h-[60px]">
                  {faviconPreview && (
                    <img 
                      src={faviconPreview} 
                      alt="Favicon Vorschau" 
                      className="h-8 w-8 object-contain"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200 flex items-center">
              <Link className="w-5 h-5 mr-2 text-gold" />
              Presse-Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pressLinks.map((link, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`press-name-${index}`} className="mb-1 block">Name</Label>
                    <Input
                      id={`press-name-${index}`}
                      value={link.name}
                      placeholder="z.B. Focus"
                      onChange={(e) => updatePressLink(index, 'name', e.target.value)}
                      className="bg-casino-darker text-gray-200 border-gray-700"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`press-url-${index}`} className="mb-1 block">URL</Label>
                    <Input
                      id={`press-url-${index}`}
                      value={link.url}
                      placeholder="https://..."
                      onChange={(e) => updatePressLink(index, 'url', e.target.value)}
                      className="bg-casino-darker text-gray-200 border-gray-700"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => removePressLink(index)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addPressLink}
              className="mt-2 w-full md:w-auto"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Presse-Link hinzufügen
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border-gold/10 bg-casino-card">
          <CardHeader>
            <CardTitle className="text-xl text-gray-200 flex items-center">
              <InfoIcon className="w-5 h-5 mr-2 text-gold" />
              Rechtliche Informationen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="z.B. +49 (0) 69 123 456 78" 
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
                  <FormLabel>E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="kontakt@beispiel.de" 
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
                  <FormLabel>Umsatzsteuer-ID</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="z.B. DE123456789" 
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
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-gold hover:bg-gold/80 text-black font-medium"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="animate-spin mr-2">◌</span>
                Speichern...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Änderungen speichern
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SiteRebrandingForm;
