
import PageLayout from "@/components/landing/PageLayout";
import { useBranding } from "@/contexts/BrandingContext";
import DynamicText from "@/components/common/DynamicText";

const Press = () => {
  const { branding } = useBranding();
  
  // Default press links
  const defaultPressLinks = [
    { name: "Focus", url: "https://www.focus.de" },
    { name: "Handelsblatt", url: "https://www.handelsblatt.com" },
    { name: "WirtschaftsWoche", url: "https://www.wiwo.de" }
  ];
  
  // Use custom press links if available, otherwise use defaults
  const pressLinks = (branding?.press_links && branding.press_links.length > 0) 
    ? branding.press_links 
    : defaultPressLinks;
    
  return (
    <PageLayout
      title="Presse"
      description="Pressemitteilungen und Medienpräsenz"
    >
      <div className="max-w-4xl mx-auto">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gold">Pressemitteilungen</h2>
          
          <div className="space-y-6">
            <div className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg">
              <span className="text-gray-400 text-sm">23. März 2025</span>
              <h3 className="text-xl font-semibold mt-2 mb-3 text-white">
                <DynamicText text="bitloon setzt neue Maßstäbe im KI-gestützten Krypto-Trading" />
              </h3>
              <p className="text-gray-300">
                <DynamicText text="Frankfurt am Main - Das Fintech-Startup bitloon hat heute seine innovative Plattform für KI-gestütztes Krypto-Trading offiziell vorgestellt. Mit der Nutzung fortschrittlicher künstlicher Intelligenz verspricht das Unternehmen, den Kryptowährungshandel zu revolutionieren und für Anleger jeder Erfahrungsstufe zugänglich zu machen." />
              </p>
              <div className="mt-4">
                <a 
                  href="#" 
                  className="text-gold hover:text-gold/80 transition-colors font-medium inline-flex items-center"
                >
                  Vollständige Pressemitteilung lesen
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div className="bg-casino-card border border-gold/20 p-6 rounded-lg shadow-lg">
              <span className="text-gray-400 text-sm">10. Februar 2025</span>
              <h3 className="text-xl font-semibold mt-2 mb-3 text-white">
                <DynamicText text="bitloon erhält 5 Millionen Euro in Seed-Finanzierungsrunde" />
              </h3>
              <p className="text-gray-300">
                <DynamicText text="Frankfurt am Main - Das deutsche Fintech-Startup bitloon hat in einer Seed-Finanzierungsrunde 5 Millionen Euro eingesammelt. Die Runde wurde von führenden deutschen und europäischen Risikokapitalgebern angeführt, die das Potenzial der KI-gestützten Handelsplattform für Kryptowährungen erkannt haben." />
              </p>
              <div className="mt-4">
                <a 
                  href="#" 
                  className="text-gold hover:text-gold/80 transition-colors font-medium inline-flex items-center"
                >
                  Vollständige Pressemitteilung lesen
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" 
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 text-gold">In den Medien</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pressLinks.map((press, index) => (
              <a 
                key={index}
                href={press.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-casino-card border border-gold/20 p-4 rounded-lg shadow-lg hover:border-gold/40 transition-all group flex flex-col items-center justify-center"
              >
                <div className="w-40 h-20 flex items-center justify-center mb-2">
                  <img 
                    src={`/press/${press.name.toLowerCase()}-logo.png`} 
                    alt={`${press.name} Logo`}
                    className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      // Fallback for missing logos
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/160x80?text=" + press.name;
                    }}
                  />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors text-sm mt-2">
                  Artikel lesen
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Press;
