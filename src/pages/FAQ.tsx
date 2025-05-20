
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import PageLayout from "@/components/landing/PageLayout";
import { Activity, Coins, HelpCircle, Lock, Settings, Wallet } from "lucide-react";
import CtaBanner from "@/components/landing/CtaBanner";

const faqCategories = [
  {
    id: "general",
    title: "🔍 Allgemeines zu bitloon",
    icon: <HelpCircle className="w-5 h-5 text-gold mr-2" />,
    items: [
      {
        id: "what-is-bitloon",
        question: "Was ist bitloon?",
        answer: "bitloon ist ein KI-gestützter Kryptobot, der automatisiert Kryptowährungen handelt. Mithilfe künstlicher Intelligenz erkennt er Marktchancen und trifft präzise Entscheidungen – ohne dass du selbst handeln musst."
      },
      {
        id: "how-works",
        question: "Wie funktioniert bitloon?",
        answer: "Die KI analysiert in Echtzeit Marktdaten, Trends, Nachrichten und Blockchain-Informationen. Mit einer Trefferquote von bis zu 90 % führt bitloon automatisch profitable Trades durch – direkt über dein persönliches Bot-Panel."
      },
      {
        id: "difference",
        question: "Was unterscheidet bitloon von anderen Trading-Bots?",
        answer: "bitloon erkennt potenzielle Verlusttrades frühzeitig und bricht diese automatisch ab, bevor sie ausgeführt werden. Das senkt dein Risiko und erhöht die Stabilität der Rendite."
      }
    ]
  },
  {
    id: "costs",
    title: "💰 Kosten, Erträge & Auszahlung",
    icon: <Wallet className="w-5 h-5 text-gold mr-2" />,
    items: [
      {
        id: "cost",
        question: "Was kostet bitloon?",
        answer: "Die einmalige Aktivierungsgebühr beträgt 250 €. Diese wird dir vollständig als Tradingguthaben gutgeschrieben und kann bei Bedarf auch wieder ausgezahlt werden. Du bezahlst also nichts \"on top\" – dein Kapital arbeitet sofort für dich."
      },
      {
        id: "returns",
        question: "Wie hoch sind die Erträge mit bitloon?",
        answer: "bitloon erzielt abhängig von der Marktlage eine Rendite von bis zu 30 % pro Monat – durch KI-gesteuerte, intelligente Handelsstrategien."
      },
      {
        id: "withdraw",
        question: "Kann ich mein Geld jederzeit auszahlen lassen?",
        answer: "Ja. Sowohl das eingezahlte Kapital, die Gewinne als auch die Aktivierungsgebühr (als Tradingguthaben) sind jederzeit auszahlbar."
      },
      {
        id: "minimum",
        question: "Gibt es ein Mindestanlagevolumen?",
        answer: "Mit den 250 € Aktivierungsgebühr bist du direkt startklar. Für höhere Erträge kannst du selbstverständlich weiteres Kapital hinzufügen."
      }
    ]
  },
  {
    id: "technology",
    title: "⚙️ Technologie, Sicherheit & Strategie",
    icon: <Settings className="w-5 h-5 text-gold mr-2" />,
    items: [
      {
        id: "decisions",
        question: "Wie entscheidet bitloon, wann gehandelt wird?",
        answer: "Die KI analysiert fortlaufend Daten aus Märkten, Newsfeeds, On-Chain-Quellen und technischen Indikatoren – so erkennt sie profitable Einstiegspunkte mit hoher Präzision."
      },
      {
        id: "bad-market",
        question: "Was passiert bei einem schlechten Marktumfeld?",
        answer: "bitloon schützt dein Kapital aktiv: Sollte sich ein Trade als verlustreich herausstellen, wird dieser vor Ausführung abgebrochen. So wird unnötiger Schaden vermieden."
      },
      {
        id: "security",
        question: "Wie sicher ist mein Investment?",
        answer: "Es gibt keine Garantien, aber bitloon verwendet fortschrittliches Risikomanagement, Stop-Loss-Strategien und Kapitalschutzmechanismen, um deine Anlage zu sichern."
      },
      {
        id: "cryptocurrencies",
        question: "Welche Kryptowährungen werden gehandelt?",
        answer: "Der Bot fokussiert sich auf große Coins wie Bitcoin, Ethereum und etablierte Altcoins – mit stetiger Anpassung an neue Marktchancen."
      }
    ]
  },
  {
    id: "usage",
    title: "🛠️ Bedienung & Support",
    icon: <Lock className="w-5 h-5 text-gold mr-2" />,
    items: [
      {
        id: "activation",
        question: "Wie kann ich bitloon aktivieren?",
        answer: "Mit der Zahlung der einmaligen Aktivierungsgebühr von 250 € erhältst du sofort Zugriff auf das bitloon Bot Panel, in dem alle Trades und Statistiken live einsehbar sind."
      },
      {
        id: "panel",
        question: "Wie funktioniert das Bot Panel?",
        answer: "Das Panel zeigt dir aktuelle und vergangene Trades, Performance-Auswertungen und deinen Kapitalstand. Es ist einfach und intuitiv gestaltet."
      },
      {
        id: "prerequisites",
        question: "Brauche ich Vorkenntnisse?",
        answer: "Nein. bitloon ist vollständig automatisiert. Du musst weder Charts lesen noch manuell handeln – die KI übernimmt alles für dich."
      },
      {
        id: "phone-support",
        question: "Gibt es telefonische Beratung?",
        answer: "Ja. Unser Team von Krypto- und KI-Experten steht dir telefonisch zur Verfügung, um alle deine Fragen zu beantworten – auch nach dem Start."
      },
      {
        id: "demo",
        question: "Gibt es eine Testversion oder Demo?",
        answer: "Eine kostenlose Testversion gibt es aktuell nicht. Aber du kannst mit den 250 € starten und alles testen – ohne Risiko, da du dein Guthaben jederzeit auszahlen kannst."
      }
    ]
  },
  {
    id: "trading",
    title: "📈 Handel & Performance",
    icon: <Activity className="w-5 h-5 text-gold mr-2" />,
    items: [
      {
        id: "frequency",
        question: "Wie häufig handelt bitloon?",
        answer: "Je nach Marktlage führt bitloon mehrere Trades pro Tag oder auch seltener aus – die Frequenz richtet sich vollständig nach der Erfolgschance."
      },
      {
        id: "settings",
        question: "Kann ich eigene Einstellungen festlegen?",
        answer: "Aktuell ist der Bot vorkonfiguriert für maximale Einfachheit. Erweiterte Einstellungen sind für die Zukunft geplant."
      },
      {
        id: "exchanges",
        question: "Welche Börsen nutzt bitloon?",
        answer: "Die Trades erfolgen über geprüfte Schnittstellen (APIs). Anbindungen an bekannte Börsen wie Binance, Coinbase und Kraken sind in Arbeit."
      },
      {
        id: "results",
        question: "Wie schnell sehe ich Ergebnisse?",
        answer: "Erste positive Ergebnisse sind oft schon innerhalb der ersten Tage sichtbar – je nach Marktentwicklung und Handelsvolumen."
      }
    ]
  }
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  
  return (
    <PageLayout 
      title="Häufig gestellte Fragen" 
      description="Antworten auf die wichtigsten Fragen zu unserem KI-Trading-System"
    >
      <div className="max-w-4xl mx-auto">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base flex items-center transition-all ${
                activeCategory === category.id 
                  ? "bg-gold text-black font-medium" 
                  : "bg-casino-card hover:bg-casino-highlight text-white"
              }`}
            >
              {category.icon}
              <span className="hidden md:inline">{category.title}</span>
            </button>
          ))}
        </div>
        
        {/* FAQ Items */}
        {faqCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: activeCategory === category.id ? 1 : 0,
              y: activeCategory === category.id ? 0 : 20,
              display: activeCategory === category.id ? "block" : "none"
            }}
            transition={{ duration: 0.5 }}
            className="bg-casino-card border border-white/10 rounded-xl overflow-hidden shadow-lg mb-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-gold px-6 py-4 border-b border-white/10 flex items-center">
              {category.icon} {category.title}
            </h2>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
            >
              {category.items.map((item) => (
                <AccordionItem 
                  key={item.id} 
                  value={item.id}
                  className="border-white/10 last:border-none"
                >
                  <AccordionTrigger className="py-5 px-6 hover:bg-casino-highlight hover:no-underline">
                    <div className="flex items-center text-left">
                      <span className="text-white text-lg">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-2">
                    <p className="text-gray-300">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        ))}
        
        <CtaBanner />
      </div>
    </PageLayout>
  );
};

export default FAQ;
