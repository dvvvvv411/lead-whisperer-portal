import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import PageLayout from "@/components/landing/PageLayout";
import { Info, Key, Lock } from "lucide-react";
import CtaBanner from "@/components/landing/CtaBanner";

const faqItems = [
  {
    id: "security",
    question: "Wie sicher ist mein Geld?",
    answer: "Alle Transaktionen laufen verschlüsselt. Ihre Einlage bleibt auf Ihrem Nutzerkonto und wir verwenden fortschrittliche Sicherheitsmaßnahmen, um Ihre Daten und Ihr Geld zu schützen. Unser System wird regelmäßig von unabhängigen Sicherheitsexperten geprüft.",
    icon: <Lock className="w-5 h-5 text-gold mr-2" />
  },
  {
    id: "withdrawal",
    question: "Wann kann ich auszahlen?",
    answer: "Auszahlungen sind jederzeit möglich, ohne Gebühren. Der Prozess ist einfach und schnell - normalerweise werden Auszahlungen innerhalb von 24 Stunden bearbeitet. Es gibt keine Mindesthaltezeit für Ihr Kapital.",
    icon: <Key className="w-5 h-5 text-gold mr-2" />
  },
  {
    id: "activation",
    question: "Wie funktioniert die 250 €-Aktivierung?",
    answer: "Die Zahlung von 250 € aktiviert Ihr Konto und wird direkt als Handelskapital verwendet. Diese einmalige Gebühr ermöglicht Ihnen den Zugang zu unserem KI-gestützten Trading-System und wird zu 100% als Startkapital für Ihre ersten Trades eingesetzt.",
    icon: <Info className="w-5 h-5 text-gold mr-2" />
  },
  {
    id: "risk",
    question: "Kann ich mein Kapital verlieren?",
    answer: "Unsere KI minimiert Risiken aktiv. Verluste sind theoretisch möglich, aber sehr selten. Mit einer Erfolgsquote von über 90% sind die meisten Trades profitabel. Wir empfehlen dennoch, nur Kapital zu investieren, dessen potenziellen Verlust Sie verkraften können.",
    icon: <Info className="w-5 h-5 text-gold mr-2" />
  },
  {
    id: "profit",
    question: "Wie hoch sind die durchschnittlichen Gewinne?",
    answer: "Der durchschnittliche Gewinn pro Trade liegt bei 3-7%. Bei mehreren tausend Trades pro Monat kann dies zu einer monatlichen Gesamtrendite von bis zu 30% führen. Die genauen Ergebnisse variieren je nach Marktbedingungen und eingesetztem Kapital.",
    icon: <Info className="w-5 h-5 text-gold mr-2" />
  },
  {
    id: "experience",
    question: "Benötige ich Trading-Erfahrung?",
    answer: "Nein, Sie benötigen keinerlei Vorkenntnisse oder Erfahrung. Unser KI-Bot übernimmt alle Trading-Entscheidungen für Sie. Das System wurde entwickelt, um sowohl für Anfänger als auch für erfahrene Trader optimale Ergebnisse zu liefern.",
    icon: <Info className="w-5 h-5 text-gold mr-2" />
  }
];

const FAQ = () => {
  const [openItem, setOpenItem] = useState<string>("security");
  
  return (
    <PageLayout 
      title="Häufig gestellte Fragen" 
      description="Antworten auf die wichtigsten Fragen zu unserem KI-Trading-System"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-casino-card border border-white/10 rounded-xl overflow-hidden shadow-lg"
        >
          <Accordion 
            type="single" 
            defaultValue="security" 
            collapsible 
            className="w-full"
          >
            {faqItems.map((item) => (
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
                  <p className="text-gray-300">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
        
        <CtaBanner />
      </div>
    </PageLayout>
  );
};

export default FAQ;
