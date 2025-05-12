
import React from 'react';
import { motion } from "framer-motion";
import { Star, ThumbsUp } from "lucide-react";

interface Testimonial {
  name: string;
  comment: string;
  rating: number;
  profit: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Michael S.",
    comment: "Die KI-Trading Plattform hat meine Erwartungen übertroffen. Einfach zu bedienen und die Ergebnisse sprechen für sich.",
    rating: 5,
    profit: "+1.240€"
  },
  {
    name: "Sophie K.",
    comment: "Nach nur 3 Wochen konnte ich bereits meine erste Auszahlung tätigen. Der Support ist immer hilfsbereit.",
    rating: 5,
    profit: "+980€"
  },
  {
    name: "Thomas M.",
    comment: "Die KI trifft erstaunlich präzise Vorhersagen. Die 250€ Einzahlung haben sich mehr als gelohnt.",
    rating: 4,
    profit: "+2.100€"
  }
];

const Testimonials = () => {
  return (
    <div className="mt-8 mb-2">
      <h3 className="text-lg font-semibold mb-4 text-center">Unsere Nutzer berichten</h3>
      
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 p-4 rounded-lg border border-slate-700 relative"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-white">{testimonial.name}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < testimonial.rating ? 'text-gold' : 'text-gray-500'}`}
                      fill={i < testimonial.rating ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
              </div>
              <div className="bg-green-900/30 py-1 px-2 rounded text-green-400 text-sm font-semibold">
                {testimonial.profit}
              </div>
            </div>
            <p className="text-sm text-gray-300">{testimonial.comment}</p>
            
            <div className="flex items-center text-xs text-gray-400 mt-2">
              <ThumbsUp className="h-3 w-3 mr-1" />
              <span>Verifizierter Nutzer</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
