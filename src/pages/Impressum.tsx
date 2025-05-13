
import PageLayout from "@/components/landing/PageLayout";

const Impressum = () => {
  return (
    <PageLayout
      title="Impressum"
      description="Informationen gemäß § 5 TMG und § 55 RStV"
    >
      <div className="prose prose-invert max-w-none">
        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">Angaben gemäß § 5 TMG</h2>
          <p>
            GMS Management und Service GmbH<br />
            Platz der Republik 6<br />
            60325 Frankfurt am Main<br />
            Deutschland
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Handelsregister</h3>
          <p>
            Amtsgericht Frankfurt am Main<br />
            HRB 136900
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Vertreten durch</h3>
          <p>
            Stefan Schlieter (Geschäftsführer)<br />
            Walid Abu Al Ghon (Geschäftsführer)
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Kontakt</h3>
          <p>
            Telefon: +49 (0) 69 254 931 30<br />
            E-Mail: info@gms-service.de
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Umsatzsteuer-ID</h3>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            DE341123456 (Beispiel-ID)
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p>
            Stefan Schlieter<br />
            GMS Management und Service GmbH<br />
            Platz der Republik 6<br />
            60325 Frankfurt am Main<br />
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
