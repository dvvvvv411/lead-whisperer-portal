
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Markus Schmidt",
    role: "Privatinvestor",
    content: "Der KI Trading Bot hat meine Erwartungen übertroffen. In nur zwei Monaten konnte ich mein Portfolio um 23% steigern, ohne selbst aktiv handeln zu müssen.",
    rating: 5,
    avatar: "MS"
  },
  {
    id: 2,
    name: "Laura Weber",
    role: "Finanzberaterin",
    content: "Als Finanzberaterin war ich skeptisch gegenüber automatisierten Trading-Systemen. Dieser Bot hat mich jedoch überzeugt - die Algorithmen arbeiten präzise und die Renditen sind beeindruckend.",
    rating: 5,
    avatar: "LW"
  },
  {
    id: 3,
    name: "Thomas Becker",
    role: "Selbstständiger",
    content: "Endlich eine Möglichkeit, am Kryptomarkt zu partizipieren, ohne ständig den Markt beobachten zu müssen. Die Ergebnisse sprechen für sich - definitiv eine Empfehlung.",
    rating: 4,
    avatar: "TB"
  },
  {
    id: 4,
    name: "Sophia Müller",
    role: "Tech-Enthusiastin",
    content: "Die Kombination aus KI und Blockchain-Technologie ist genial. Der Bot erkennt Muster, die ich selbst übersehen würde, und handelt zum optimalen Zeitpunkt.",
    rating: 5,
    avatar: "SM"
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const testimonialsPerView = 1;
  
  // Autoplay functionality
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex, autoplay]);
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => 
      prev + testimonialsPerView >= testimonials.length ? 0 : prev + testimonialsPerView
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => 
      prev - testimonialsPerView < 0 ? testimonials.length - testimonialsPerView : prev - testimonialsPerView
    );
  };

  return (
    <section id="testimonials" className="py-20 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-casino-darker to-casino-card opacity-50"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
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
              Was unsere Nutzer sagen
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Erfahre, wie unser KI Trading Bot das Leben unserer Nutzer verändert hat und welche Ergebnisse sie erzielen konnten.
          </p>
        </motion.div>
        
        <div className="relative">
          <div 
            className="overflow-hidden"
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="min-w-full px-4"
                >
                  <div className="bg-casino-card border border-white/10 rounded-xl p-8 shadow-lg relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-purple-500/20 rounded-xl blur opacity-20"></div>
                    
                    <div className="relative">
                      {/* Quote mark */}
                      <div className="absolute -top-4 -left-2 text-6xl text-gold/20 font-serif">"</div>
                      
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Avatar and user info */}
                        <div className="flex flex-col items-center mb-4 md:mb-0">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/80 to-amber-600/80 flex items-center justify-center text-2xl font-bold text-black mb-3">
                            {testimonial.avatar}
                          </div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-sm text-gray-400">{testimonial.role}</p>
                          
                          <div className="flex mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < testimonial.rating ? "text-gold" : "text-gray-600"
                                }`}
                                fill={i < testimonial.rating ? "#FFD700" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* Testimonial content */}
                        <div className="flex-1">
                          <p className="text-lg md:text-xl leading-relaxed italic">
                            "{testimonial.content}"
                          </p>
                          
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-gray-400">Verifizierter Nutzer</p>
                              <div className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                                Verifiziert ✓
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Navigation arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 -translate-y-1/2 bg-casino-darker border border-white/20 rounded-full p-2 text-white hover:bg-casino-card hover:border-gold/50 transition-all"
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 -translate-y-1/2 bg-casino-darker border border-white/20 rounded-full p-2 text-white hover:bg-casino-card hover:border-gold/50 transition-all"
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-6 bg-gold" : "bg-gray-500"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
