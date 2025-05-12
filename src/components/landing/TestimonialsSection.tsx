import { motion } from "framer-motion";
import { useState } from "react";
import { Star } from "lucide-react";
import BackgroundEffects from "./testimonials/BackgroundEffects";

// Updated testimonials with realistic German names and updated content
const testimonials = [
  {
    id: 1,
    name: "Michael Schmidt",
    position: "Neueinsteiger",
    image: "https://i.imgur.com/jQzW1xe.png",
    rating: 5,
    text: "Nach nur 3 Wochen mit dem KI-Trading-Bot habe ich bereits 920€ Gewinn gemacht. Die automatischen Trades sind ein Gamechanger für mich als Anfänger. Die Aktivierungsgebühr von 250€ hat sich schnell amortisiert."
  },
  {
    id: 2,
    name: "Hannah Weber",
    position: "Erfahrene Traderin",
    image: "https://i.imgur.com/LVQAWtB.png",
    rating: 5,
    text: "Ich trade seit 5 Jahren und war skeptisch. Nach einem Monat mit der KI habe ich meine bisherigen Ergebnisse verdreifacht. Die KI erkennt Muster, die ich verpasst hätte. Die Rendite von 28% im letzten Monat hat meine Erwartungen übertroffen."
  },
  {
    id: 3,
    name: "Thomas Müller",
    position: "Teilzeit-Investor",
    image: "https://i.imgur.com/XKpedxL.png",
    rating: 4,
    text: "Endlich kann ich nebenbei investieren, ohne ständig die Märkte beobachten zu müssen. Der Bot handelt für mich rund um die Uhr und erzielt durchschnittlich 3-7% Gewinn pro Trade. Die 250€ Aktivierungsgebühr ist fair und wird als Trading-Guthaben gutgeschrieben."
  },
  {
    id: 4,
    name: "Julia Fischer",
    position: "Finanzberaterin",
    image: "https://i.imgur.com/6pAGskz.png",
    rating: 5,
    text: "Als Fachfrau bin ich begeistert von der Technologie. Die Algorithmen sind beeindruckend und die Erfolgsquote von über 90% spricht für sich. Dass die Plattform die Nutzerzahl limitiert, um die Performance hoch zu halten, ist ein kluger Schritt. Klare Empfehlung!"
  }
];

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-casino-darker">
      {/* Background elements */}
      <BackgroundEffects />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Das sagen unsere Kunden
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Erfahre, wie unser KI-Trading-Bot bereits tausenden Nutzern geholfen hat,
            ihr passives Einkommen zu steigern.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto relative">
          {/* Large testimonial display */}
          <motion.div 
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-casino-card to-black backdrop-blur-sm border border-white/5 rounded-xl p-8 mb-8 shadow-lg shadow-black/40 relative overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-accent1/20 rounded-xl blur opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-black/40 border-2 border-gold/30 overflow-hidden mr-4 flex items-center justify-center">
                    {testimonials[activeIndex].image ? (
                      <img 
                        src={testimonials[activeIndex].image} 
                        alt={testimonials[activeIndex].name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white/30">
                        {testimonials[activeIndex].name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{testimonials[activeIndex].name}</h3>
                    <p className="text-sm text-gray-400">{testimonials[activeIndex].position}</p>
                  </div>
                </div>
                
                <div className="flex">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                  {[...Array(5 - testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i + testimonials[activeIndex].rating} className="w-5 h-5 text-gray-500" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-300 italic text-lg md:text-xl leading-relaxed mb-6">
                "{testimonials[activeIndex].text}"
              </p>
              
              {/* Quote marks */}
              <div className="absolute top-4 left-4 text-6xl opacity-10 text-gold">"</div>
              <div className="absolute bottom-4 right-4 text-6xl opacity-10 text-gold">"</div>
            </div>
          </motion.div>
          
          {/* Pagination dots */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-gold scale-125" : "bg-gray-600 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Thumbnails row for other testimonials */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                onClick={() => setActiveIndex(index)}
                className={`p-4 rounded-lg text-left transition-all ${
                  index === activeIndex
                    ? "bg-gradient-to-br from-gold/20 to-black/40 border border-gold/30"
                    : "bg-black/30 border border-white/5 hover:border-white/20"
                }`}
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-black/40 border border-gold/20 overflow-hidden mr-3 flex items-center justify-center">
                    {testimonial.image ? (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-white/30">
                        {testimonial.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white">{testimonial.name}</h4>
                    <div className="flex mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-gold fill-gold" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{testimonial.text.substring(0, 60)}...</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0D0E] to-transparent"></div>
    </section>
  );
};

export default TestimonialsSection;
