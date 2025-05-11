
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export async function generateDemoLeads() {
  const { toast } = useToast();
  
  const randomLeads = [
    {
      name: "Anna Schmidt",
      email: "anna.schmidt@example.com",
      phone: "+49 176 12345678",
      company: "Technik GmbH",
      message: "Ich interessiere mich für Ihre Dienstleistungen und möchte gerne mehr Informationen erhalten.",
      status: "neu"
    },
    {
      name: "Thomas Müller",
      email: "thomas.mueller@example.com",
      phone: "+49 177 87654321",
      company: "Design AG",
      message: "Wir suchen einen Partner für unser neues Projekt. Können Sie uns ein Angebot erstellen?",
      status: "neu"
    },
    {
      name: "Laura Weber",
      email: "laura.weber@example.com",
      phone: "+49 178 55667788",
      company: "Marketing Solutions",
      message: "Ich habe Ihre Website besucht und bin an einer Zusammenarbeit interessiert. Bitte kontaktieren Sie mich.",
      status: "neu"
    },
    {
      name: "Michael Bauer",
      email: "michael.bauer@example.com",
      phone: "+49 179 11223344",
      company: "Bauer & Partner",
      message: "Wir benötigen Unterstützung bei der Entwicklung unserer neuen Webplattform. Haben Sie Kapazitäten frei?",
      status: "neu"
    },
    {
      name: "Sabine Hoffmann",
      email: "sabine.hoffmann@example.com",
      phone: "+49 170 99887766",
      company: "Hoffmann Consulting",
      message: "Bitte senden Sie mir Informationen zu Ihren aktuellen Angeboten und Referenzen.",
      status: "neu"
    }
  ];

  try {
    for (const lead of randomLeads) {
      const { error } = await supabase
        .from('leads')
        .insert(lead);
        
      if (error) {
        console.error("Fehler beim Erstellen des Demo-Leads:", error);
        throw error;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error("Fehler beim Erstellen der Demo-Leads:", error);
    return { success: false, error };
  }
}
