
import { supabase } from "@/integrations/supabase/client";

/**
 * Prüft, ob der angemeldete Benutzer die angegebene Rolle hat
 * @param role Die zu prüfende Rolle ('admin' oder 'user')
 * @returns Promise<boolean> Ob der Benutzer die Rolle hat
 */
export const checkUserRole = async (role: 'admin' | 'user'): Promise<boolean> => {
  try {
    // Benutzer-ID abrufen
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;
    
    // Rolle über die Funktion has_role abfragen
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: role
    });
    
    if (error) {
      console.error('Fehler beim Abfragen der Benutzerrolle:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Fehler beim Überprüfen der Benutzerrolle:', error);
    return false;
  }
};
