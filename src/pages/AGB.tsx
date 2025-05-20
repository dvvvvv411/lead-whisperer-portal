
import PageLayout from "@/components/landing/PageLayout";

const AGB = () => {
  return (
    <PageLayout
      title="Allgemeine Geschäftsbedingungen"
      description="AGB der GMS Management und Service GmbH"
    >
      <div className="prose prose-invert max-w-none">
        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">1. Geltungsbereich</h2>
          <p>
            1.1 Die nachstehenden allgemeinen Geschäftsbedingungen gelten für alle Rechtsgeschäfte der GMS Management und Service GmbH, 
            Platz der Republik 6, 60325 Frankfurt am Main – nachstehend „Anbieter" genannt – mit ihrem Vertragspartner – nachstehend 
            „Kunde" genannt.
          </p>
          <p>
            1.2 Abweichende Allgemeine Geschäftsbedingungen des Kunden gelten nicht. Sie finden auch dann keine Anwendung, 
            wenn der Anbieter ihnen nicht ausdrücklich widerspricht.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">2. Vertragsgegenstand</h2>
          <p>
            2.1 Der Anbieter bietet Dienstleistungen im Bereich Management und Service an. 
            Die detaillierte Beschreibung der zu erbringenden Dienstleistungen ergibt sich aus den Ausschreibungsunterlagen, 
            Briefings, Projektverträgen, deren Anlagen und Leistungsbeschreibungen des Anbieters.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">3. Zustandekommen des Vertrages</h2>
          <p>
            3.1 Ein Vertrag mit dem Anbieter kommt durch die Annahme eines Angebots des Kunden oder durch die Übermittlung 
            einer Auftragsbestätigung des Anbieters zustande.
          </p>
          <p>
            3.2 Sofern der Kunde ein Angebot des Anbieters annimmt, ist der Anbieter an sein Angebot für 14 Tage nach dessen 
            Abgabe gebunden, sofern nicht ausdrücklich etwas anderes vereinbart wurde.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">4. Leistungsumfang</h2>
          <p>
            4.1 Der Umfang der Leistungen ergibt sich aus der jeweils zum Zeitpunkt des Vertragsschlusses aktuellen 
            Produkt-/Leistungsbeschreibung. Zusätzliche und/oder nachträgliche Veränderungen der Leistungsbeschreibungen 
            bedürfen der Schriftform.
          </p>
          <p>
            4.2 Soweit der Anbieter kostenlose Dienste und Leistungen erbringt, können diese jederzeit und ohne Vorankündigung 
            eingestellt werden. Ansprüche des Kunden ergeben sich hieraus nicht.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">5. Preise und Zahlungsbedingungen</h2>
          <p>
            5.1 Die Vergütung für die zu erbringenden Leistungen und die Berechnungsgrundlage hierfür ergeben sich aus dem 
            Vertrag. Alle Preise verstehen sich zuzüglich der jeweils geltenden gesetzlichen Mehrwertsteuer.
          </p>
          <p>
            5.2 Rechnungen des Anbieters sind innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zahlbar, sofern nichts 
            anderes vereinbart wurde. Bei Zahlungsverzug ist der Anbieter berechtigt, Verzugszinsen in Höhe von 9 Prozentpunkten 
            über dem Basiszinssatz zu berechnen.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold mb-4 text-gold">6. Laufzeit und Kündigung</h2>
          <p>
            6.1 Die Laufzeit des Vertrages beginnt mit dem im Vertrag genannten Datum. Ist kein Datum genannt, beginnt die 
            Laufzeit mit der Unterzeichnung des Vertrages.
          </p>
          <p>
            6.2 Verträge mit einer festen Laufzeit verlängern sich automatisch um die im Vertrag festgelegte Dauer der 
            Laufzeit, wenn sie nicht mit einer Frist von drei Monaten zum Ende der Laufzeit gekündigt werden.
          </p>
          <p>
            6.3 Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
          </p>
        </section>

        <section className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-gold">7. Schlussbestimmungen</h2>
          <p>
            7.1 Erfüllungsort und Gerichtsstand für alle Streitigkeiten aus und im Zusammenhang mit diesem Vertrag ist bei 
            Verträgen mit Kaufleuten Frankfurt am Main.
          </p>
          <p>
            7.2 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
          </p>
          <p>
            7.3 Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so wird hierdurch die Gültigkeit der 
            übrigen Bestimmungen nicht berührt.
          </p>
        </section>
      </div>
    </PageLayout>
  );
};

export default AGB;
