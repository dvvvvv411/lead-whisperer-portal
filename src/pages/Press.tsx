
import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface PressItem {
  id: string;
  logo: string;
  name: string;
  title: string;
  excerpt: string;
  url: string;
  date: string;
}

const pressItems: PressItem[] = [{
  id: "handelsblatt",
  logo: "https://www.implify.de/wp-content/uploads/2020/07/handelsblatt.png",
  name: "Handelsblatt",
  title: "Frankfurter Start-up Bitloon: KI-Plattform für Krypto-Investments sorgt für Aufmerksamkeit",
  excerpt: "Das Frankfurter Start-up Bitloon hat mit seiner KI-gestützten Plattform für Krypto-Investments für Aufmerksamkeit in der Finanzwelt gesorgt...",
  url: "https://www.handels-blatt.com/finanzen/steuern-recht/steuern/frankfurter-start-up-bitloon-ki-plattform-fuer-krypto-investments-sorgt-fuer-aufmerksamkeit/100124798.html",
  date: "15. Mai 2024"
}, {
  id: "focus",
  logo: "https://d1epvft2eg9h7o.cloudfront.net/filer_public_thumbnails/filer_public/23/c5/23c57677-262c-44a6-95f3-6465aa3f990d/focus_online-2022-logo-color-large.png__1200x628_crop_subject_location-FOCUS%20online-2022-logo-color-large.png_subsampling-2_upscale.png",
  name: "Focus Online",
  title: "Frankfurter KI-Fintech Bitloon überzeugt erste Anleger - Carsten Maschmeyer zeigt sich beeindruckt",
  excerpt: "Das Frankfurter KI-Fintech-Unternehmen Bitloon hat mit seiner automatisierten Krypto-Plattform erste Investoren überzeugt. Auch Investor Carsten Maschmeyer äußerte sich positiv...",
  url: "https://www.focus-online.net/finanzen/boerse/frankfurter-ki-fintech-bitloon-ueberzeugt-erste-anleger-carsten-maschmeyer-zeigt-sich-beeindruckt-von-automatisierter-krypto-plattform_025fd55e-1d5f-4964-83c2-8e73df7c6012.html",
  date: "28. April 2024"
}, {
  id: "wiwo",
  logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/WirtschaftsWoche_Logo.png",
  name: "Wirtschafts Woche",
  title: "Bitloon aus Frankfurt: Wie ein KI-Start-up den Krypto-Handel professionalisieren will",
  excerpt: "Das Frankfurter Start-up Bitloon setzt auf künstliche Intelligenz, um den Krypto-Handel zu professionalisieren. Die innovative Plattform verspricht hohe Renditen bei minimiertem Risiko...",
  url: "https://www.wirtschafts-woche.net/finanzen/geldanlage/bitloon-aus-frankfurt-wie-ein-ki-start-up-den-krypto-handel-professionalisieren-will/100127150.html",
  date: "3. Mai 2024"
}];

const Press = () => {
  return <PageLayout title="Pressemitteilungen" description="Erfahren Sie, was die Medien über unsere KI-gestützte Krypto-Trading-Plattform sagen.">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <motion.h2 className="text-2xl md:text-3xl font-bold mb-4" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            Medienberichte über Bitloon
          </motion.h2>
          <motion.p className="text-gray-300 max-w-2xl mx-auto" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
          >
            Unsere innovative KI-Trading-Technologie erregt Aufmerksamkeit in der Finanzwelt. Hier finden Sie aktuelle Medienberichte über Bitloon.
          </motion.p>
        </div>

        <motion.div className="grid gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {pressItems.map((item, index) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.2 }}
            >
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="block">
                <Card className="overflow-hidden backdrop-blur-sm border-gold/30 bg-gradient-to-b from-casino-card/90 to-casino-dark/90 hover:shadow-lg hover:shadow-gold/10 transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-[180px_1fr] grid-cols-1">
                      <div className="flex items-center justify-center p-6 bg-white/10 backdrop-blur-sm">
                        <div className="h-16 flex items-center justify-center">
                          <img 
                            src={item.logo} 
                            alt={`${item.name} Logo`} 
                            className="max-h-full max-w-full object-contain" 
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                          <ExternalLink className="h-5 w-5 text-gold/70 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-gray-300 mb-4">{item.excerpt}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">{item.date}</span>
                          <span className="text-gold font-medium text-sm hover:underline">Vollständigen Artikel lesen</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageLayout>;
};

export default Press;
