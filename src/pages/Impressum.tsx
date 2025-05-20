
import { useState, useEffect } from "react";
import PageLayout from "@/components/landing/PageLayout";
import { supabase } from "@/integrations/supabase/client";

interface LegalInfo {
  phone_number: string;
  email: string;
  vat_id: string;
}

const Impressum = () => {
  const [legalInfo, setLegalInfo] = useState<LegalInfo>({
    phone_number: "+49 (0) 69 254 931 30",
    email: "info@bitbamba.de",
    vat_id: "DE341123456"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLegalInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('legal_info')
          .select('phone_number, email, vat_id')
          .single();
          
        if (error) {
          console.error("Error fetching legal info:", error);
          return;
        }
        
        if (data) {
          setLegalInfo(data);
        }
      } catch (error) {
        console.error("Error fetching legal info:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLegalInfo();
  }, []);

  return (
    <PageLayout
      title="Impressum"
      description="Informationen gemäß § 5 TMG und § 55 RStV"
    >
      <div className="prose prose-invert max-w-none">
        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">Angaben gemäß § 5 TMG</h2>
          <p>
            Cryptosoft GmbH<br />
            Maximiliansplatz 5<br />
            80333 München<br />
            Deutschland
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Handelsregister</h3>
          <p>
            Amtsgericht München<br />
            HRB 245429
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Vertreten durch</h3>
          <p>
            Raffael Koishirou Catta (Geschäftsführer)
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Kontakt</h3>
          <p>
            Telefon: {loading ? "Wird geladen..." : legalInfo.phone_number}<br />
            E-Mail: {loading ? "Wird geladen..." : legalInfo.email}
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Umsatzsteuer-ID</h3>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            {loading ? "Wird geladen..." : legalInfo.vat_id}
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Raffael Koishirou Catta<br />
            Cryptosoft GmbH<br />
            Maximiliansplatz 5<br />
            80333 München<br />
            Deutschland
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" className="text-gold hover:text-gold-light ml-1" target="_blank" rel="noopener noreferrer">
              https://ec.europa.eu/consumers/odr/
            </a>.<br />
            Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gold">Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default Impressum;
