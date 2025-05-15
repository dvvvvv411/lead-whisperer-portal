
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import PageLayout from "@/components/landing/PageLayout";
import { 
  Info, 
  Lock, 
  Key, 
  Settings, 
  Wallet, 
  HelpCircle, 
  Headphones, 
  BarChart3, 
  LineChart, 
  Shield 
} from "lucide-react";
import CtaBanner from "@/components/landing/CtaBanner";

// Helper function to highlight specific terms in gold
const highlightTerms = (text: string) => {
  // Terms to highlight
  const termsToHighlight = [
    "Aktivierungsgebühr", 
    "30 %", 
    "250 €", 
    "bis zu 90 %", 
    "KI-gestützt",
    "KI-gesteuerte",
    "jederzeit auszahlbar"
  ];
  
  // Split the text by terms to highlight
  let parts = [text];
  
  termsToHighlight.forEach(term => {
    const newParts: string[] = [];
    
    parts.forEach(part => {
      const splitPart = part.split(term);
      
      for (let i = 0; i < splitPart.length; i++) {
        newParts.push(splitPart[i]);
        
        // Add the highlighted term after each part except the last one
        if (i < splitPart.length - 1) {
          newParts.push(`__HIGHLIGHT__${term}__HIGHLIGHT__`);
        }
      }
    });
    
    parts = newParts;
  });
  
  // Convert parts to JSX with highlighted terms
  return parts.map((part, index) => {
    if (part.startsWith('__HIGHLIGHT__') && part.endsWith('__HIGHLIGHT__')) {
      const highlightedTerm = part.replace(/__HIGHLIGHT__/g, '');
      return (
        <span key={index} className="text-gold font-semibold">
          {highlightedTerm}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

// FAQ categories and items
const faqCategories = [
  {
    id: "general",
    title: "🔍 Allgemeines zu bitloon",
    items: [
      {
        id: "what-is-bitloon",
        question: "Was ist bitloon?",
        answer: "bitloon ist ein KI-gestützter Kryptobot, der automatisiert Kryptowährungen handelt. Mithilfe künstlicher Intelligenz erkennt er Marktchancen und trifft präzise Entscheidungen – ohne dass du selbst handeln musst.",
        icon: <Info className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "how-it-works",
        question: "Wie funktioniert bitloon?",
        answer: "Die KI analysiert in Echtzeit Marktdaten, Trends, Nachrichten und Blockchain-Informationen. Mit einer Trefferquote von bis zu 90 % führt bitloon automatisch profitable Trades durch – direkt über dein persönliches Bot-Panel.",
        icon: <Settings className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "difference",
        question: "Was unterscheidet bitloon von anderen Trading-Bots?",
        answer: "bitloon erkennt potenzielle Verlusttrades frühzeitig und bricht diese automatisch ab, bevor sie ausgeführt werden. Das senkt dein Risiko und erhöht die Stabilität der Rendite.",
        icon: <Shield className="w-5 h-5 text-gold mr-2" />
      }
    ]
  },
  {
    id: "costs",
    title: "💰 Kosten, Erträge & Auszahlung",
    items: [
      {
        id: "costs",
        question: "Was kostet bitloon?",
        answer: "Die einmalige Aktivierungsgebühr beträgt 250 €. Diese wird dir vollständig als Tradingguthaben gutgeschrieben und kann bei Bedarf auch wieder ausgezahlt werden. Du bezahlst also nichts „on top" – dein Kapital arbeitet sofort für dich.",
        icon: <Wallet className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "earnings",
        question: "Wie hoch sind die Erträge mit bitloon?",
        answer: "bitloon erzielt abhängig von der Marktlage eine Rendite von bis zu 30 % pro Monat – durch KI-gesteuerte, intelligente Handelsstrategien.",
        icon: <BarChart3 className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "withdrawal",
        question: "Kann ich mein Geld jederzeit auszahlen lassen?",
        answer: "Ja. Sowohl das eingezahlte Kapital, die Gewinne als auch die Aktivierungsgebühr (als Tradingguthaben) sind jederzeit auszahlbar.",
        icon: <Key className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "minimum",
        question: "Gibt es ein Mindestanlagevolumen?",
        answer: "Mit den 250 € Aktivierungsgebühr bist du direkt startklar. Für höhere Erträge kannst du selbstverständlich weiteres Kapital hinzufügen.",
        icon: <Info className="w-5 h-5 text-gold mr-2" />
      }
    ]
  },
  {
    id: "technology",
    title: "⚙️ Technologie, Sicherheit & Strategie",
    items: [
      {
        id: "decisions",
        question: "Wie entscheidet bitloon, wann gehandelt wird?",
        answer: "Die KI analysiert fortlaufend Daten aus Märkten, Newsfeeds, On-Chain-Quellen und technischen Indikatoren – so erkennt sie profitable Einstiegspunkte mit hoher Präzision.",
        icon: <Settings className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "bad-market",
        question: "Was passiert bei einem schlechten Marktumfeld?",
        answer: "bitloon schützt dein Kapital aktiv: Sollte sich ein Trade als verlustreich herausstellen, wird dieser vor Ausführung abgebrochen. So wird unnötiger Schaden vermieden.",
        icon: <Shield className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "security",
        question: "Wie sicher ist mein Investment?",
        answer: "Es gibt keine Garantien, aber bitloon verwendet fortschrittliches Risikomanagement, Stop-Loss-Strategien und Kapitalschutzmechanismen, um deine Anlage zu sichern.",
        icon: <Lock className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "cryptocurrencies",
        question: "Welche Kryptowährungen werden gehandelt?",
        answer: "Der Bot fokussiert sich auf große Coins wie Bitcoin, Ethereum und etablierte Altcoins – mit stetiger Anpassung an neue Marktchancen.",
        icon: <Info className="w-5 h-5 text-gold mr-2" />
      }
    ]
  },
  {
    id: "usage",
    title: "🛠️ Bedienung & Support",
    items: [
      {
        id: "activation",
        question: "Wie kann ich bitloon aktivieren?",
        answer: "Mit der Zahlung der einmaligen Aktivierungsgebühr von 250 € erhältst du sofort Zugriff auf das bitloon Bot Panel, in dem alle Trades und Statistiken live einsehbar sind.",
        icon: <Key className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "panel",
        question: "Wie funktioniert das Bot Panel?",
        answer: "Das Panel zeigt dir aktuelle und vergangene Trades, Performance-Auswertungen und deinen Kapitalstand. Es ist einfach und intuitiv gestaltet.",
        icon: <LineChart className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "knowledge",
        question: "Brauche ich Vorkenntnisse?",
        answer: "Nein. bitloon ist vollständig automatisiert. Du musst weder Charts lesen noch manuell handeln – die KI übernimmt alles für dich.",
        icon: <HelpCircle className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "support",
        question: "Gibt es telefonische Beratung?",
        answer: "Ja. Unser Team von Krypto- und KI-Experten steht dir telefonisch zur Verfügung, um alle deine Fragen zu beantworten – auch nach dem Start.",
        icon: <Headphones className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "demo",
        question: "Gibt es eine Testversion oder Demo?",
        answer: "Eine kostenlose Testversion gibt es aktuell nicht. Aber du kannst mit den 250 € starten und alles testen – ohne Risiko, da du dein Guthaben jederzeit auszahlen kannst.",
        icon: <Info className="w-5 h-5 text-gold mr-2" />
      }
    ]
  },
  {
    id: "performance",
    title: "📈 Handel & Performance",
    items: [
      {
        id: "frequency",
        question: "Wie häufig handelt bitloon?",
        answer: "Je nach Marktlage führt bitloon mehrere Trades pro Tag oder auch seltener aus – die Frequenz richtet sich vollständig nach der Erfolgschance.",
        icon: <BarChart3 className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "settings",
        question: "Kann ich eigene Einstellungen festlegen?",
        answer: "Aktuell ist der Bot vorkonfiguriert für maximale Einfachheit. Erweiterte Einstellungen sind für die Zukunft geplant.",
        icon: <Settings className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "exchanges",
        question: "Welche Börsen nutzt bitloon?",
        answer: "Die Trades erfolgen über geprüfte Schnittstellen (APIs). Partnerschaften mit bekannten Börsen wie Binance, Coinbase und Kraken bestehen.",
        icon: <LineChart className="w-5 h-5 text-gold mr-2" />
      },
      {
        id: "results",
        question: "Wie schnell sehe ich Ergebnisse?",
        answer: "Erste positive Ergebnisse sind oft schon innerhalb der ersten Tage sichtbar – je nach Marktentwicklung und Handelsvolumen.",
        icon: <Info className="w-5 h-5 text-gold mr-2" />
      }
    ]
  }
];

const FAQ = () => {
  const [openCategory, setOpenCategory] = useState<string | null>("general");
  
  return (
    <PageLayout 
      title="Häufig gestellte Fragen" 
      description="Alles was du über bitloon wissen musst"
    >
      <div className="max-w-3xl mx-auto">
        {faqCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              {category.title}
            </h2>
            
            <div className="bg-casino-card border border-white/10 rounded-xl overflow-hidden shadow-lg mb-6">
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
                        {item.icon}
                        <span className="text-white text-lg">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-5 pt-2">
                      <p className="text-gray-300">
                        {highlightTerms(item.answer)}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </motion.div>
        ))}
        
        <CtaBanner />
      </div>
    </PageLayout>
  );
};

export default FAQ;
