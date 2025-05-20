
import { supabase } from "@/integrations/supabase/client";

export type BrandingInfo = {
  site_name: string;
  site_description: string;
  logo_url: string;
  favicon_url: string;
  press_links: Array<{
    name: string;
    url: string;
  }>;
  phone_number: string;
  email: string;
  vat_id: string;
};

export const fetchBrandingInfo = async (): Promise<BrandingInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('legal_info')
      .select('*')
      .single();
    
    if (error) {
      console.error("Error fetching branding info:", error);
      return null;
    }
    
    // Ensure press_links is properly typed as an array
    let pressLinks: Array<{ name: string; url: string; }> = [];
    
    // Handle press_links data safely
    if (data.press_links) {
      try {
        // If it's a string, try to parse it
        if (typeof data.press_links === 'string') {
          pressLinks = JSON.parse(data.press_links);
        }
        // If it's already an array, use it directly
        else if (Array.isArray(data.press_links)) {
          // Cast and validate each item in the array
          pressLinks = data.press_links
            .filter(item => item && typeof item === 'object')
            .map(item => {
              // Ensure each item has the required properties
              if (typeof item === 'object' && item !== null && 'name' in item && 'url' in item) {
                return {
                  name: String(item.name),
                  url: String(item.url)
                };
              }
              return null;
            })
            .filter((item): item is { name: string; url: string } => item !== null);
        }
      } catch (e) {
        console.error("Error parsing press_links:", e);
        pressLinks = [];
      }
    }
    
    return {
      site_name: data.site_name,
      site_description: data.site_description,
      logo_url: data.logo_url,
      favicon_url: data.favicon_url,
      press_links: pressLinks,
      phone_number: data.phone_number,
      email: data.email,
      vat_id: data.vat_id
    };
  } catch (error) {
    console.error("Error in fetchBrandingInfo:", error);
    return null;
  }
};

export const updateBrandingInfo = async (
  brandingInfo: Partial<BrandingInfo>,
  id?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Get the record ID if not provided
    if (!id) {
      const { data } = await supabase
        .from('legal_info')
        .select('id')
        .single();
      
      if (data) {
        id = data.id;
      }
    }

    const { error } = await supabase
      .from('legal_info')
      .update({
        ...brandingInfo,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating branding info:", error);
    return { success: false, error: error.message };
  }
};

export const uploadFile = async (
  file: File,
  folderName: string = "logos"
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Create a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folderName}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
    
    const { data, error } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('site-assets')
      .getPublicUrl(fileName);
    
    return { 
      success: true, 
      url: publicUrlData.publicUrl 
    };
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return { success: false, error: error.message };
  }
};
