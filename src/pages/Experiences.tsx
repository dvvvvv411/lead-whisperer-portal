import { motion } from "framer-motion";
import PageLayout from "@/components/landing/PageLayout";
import { Star } from "lucide-react";
import CtaBanner from "@/components/landing/CtaBanner";

const testimonials = [
  {
    id: 1,
    name: "Markus Weber",
    age: 28,
    occupation: "Marketing Manager",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    text: "Als Tech-affiner Mensch war ich anfangs skeptisch, ob ein Bot tatsächlich profitabel traden kann. Nach zwei Monaten mit durchschnittlich 25€ Tagesgewinn bin ich überzeugt! Die KI trifft Entscheidungen, die ich selbst nie getroffen hätte.",
    beforeAfter: "Vorher: Frustration beim manuellen Trading mit Verlusten. Nachher: Passive Einnahmen von ca. 750€ monatlich."
  },
  {
    id: 2,
    name: "Sabine Müller",
    age: 42,
    occupation: "Lehrerin",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "Als alleinerziehende Mutter habe ich keine Zeit, mich intensiv mit Kryptowährungen zu beschäftigen. Der KI-Bot nimmt mir diese Arbeit ab und erzielt konstante Renditen. Mit nur 250€ Startkapital konnte ich innerhalb von 3 Monaten über 800€ erwirtschaften.",
    beforeAfter: "Vorher: Keine Ahnung von Investments. Nachher: Nebeneinkommen für die Zukunft meiner Kinder."
  },
  {
    id: 3,
    name: "Dr. Herbert Schneider",
    age: 67,
    occupation: "Pensionierter Arzt",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    text: "In meinem Alter wollte ich meine Ersparnisse nicht riskieren, aber die niedrigen Zinsen haben mich frustriert. Der KI-Trading-Bot bietet mir eine sichere Alternative mit überraschend guten Ergebnissen. Ich schätze besonders die transparente Darstellung aller Trades.",
    beforeAfter: "Vorher: 0,01% Zinsen bei der Bank. Nachher: 15-20% monatliche Rendite durch automatisiertes Trading."
  },
  {
    id: 4,
    name: "Julia Becker",
    age: 23,
    occupation: "BWL-Studentin",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    text: "Als Studentin mit begrenztem Budget bin ich froh, diese Plattform gefunden zu haben. Mit meiner kleinen Einlage von 250€ konnte ich in nur einem Monat genug verdienen, um meine Studiengebühren zu bezahlen. Die KI reagiert unglaublich schnell auf Marktveränderungen!",
    beforeAfter: "Vorher: Nebenjob mit 450€ monatlich. Nachher: Zusätzlich ca. 50€ tägliche Gewinne durch den Bot."
  },
  {
    id: 5,
    name: "Thomas Krause",
    age: 35,
    occupation: "Software-Entwickler",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200&auto=format&fit=crop",
    text: "Als Entwickler wollte ich die Algorithmen verstehen, bevor ich investiere. Der Support hat mir alle technischen Details offen erklärt, was mein Vertrauen gestärkt hat. Nach 4 Monaten Nutzung habe ich mein initiales Investment vervierfacht.",
    beforeAfter: "Vorher: Manuelles Trading mit gemischten Ergebnissen. Nachher: Konstante Gewinne von 3-7% pro Trade."
  },
  {
    id: 6,
    name: "Lisa Hoffmann",
    age: 31,
    occupation: "Grafikdesignerin",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    text: "Als Kreative habe ich keine Ahnung von Finanzen, und ehrlich gesagt auch keine Lust, mich damit zu beschäftigen. Der Bot nimmt mir diese Last ab und generiert nebenbei ein zweites Einkommen. Die Benutzeroberfläche ist so einfach zu verstehen!",
    beforeAfter: "Vorher: Angst vor Finanzentscheidungen. Nachher: Selbstbewusst durch regelmäßige Gewinne von ca. 600€ monatlich."
  }
];

const Experiences = () => {
  return (
    <PageLayout 
      title="Erfahrungen unserer Nutzer" 
      description="Echte Ergebnisse von Menschen, die unseren KI-Trading-Bot nutzen"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gradient-to-br from-casino-card to-black border border-white/5 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="p-6">
              {/* User info */}
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-gold/30">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                  <p className="text-gray-400 text-sm">{testimonial.age} Jahre, {testimonial.occupation}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Testimonial content */}
              <div className="space-y-3">
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gold font-medium">{testimonial.beforeAfter}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <CtaBanner />
    </PageLayout>
  );
};

export default Experiences;
