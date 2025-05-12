
import { motion } from "framer-motion";
import { useState } from "react";
import ContactForm from "@/components/ContactForm";

const ContactSection = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setRotation({ x: rotateX, y: rotateY });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
              Sichere dir jetzt deinen Zugang
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 max-w-2xl mx-auto"
          >
            Fülle das Formular aus und erhalte noch heute Zugang zu unserem exklusiven KI Trading Bot.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* 3D Animation Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block"
          >
            <motion.div
              style={{
                transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="bg-casino-card border border-white/10 rounded-xl p-8 shadow-lg relative overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-purple-500/20 rounded-xl blur opacity-30"></div>
              
              <div className="relative">
                <h3 className="text-2xl font-bold mb-6">Deine Trading-Reise beginnt hier</h3>
                
                {/* Animated Trading Graph */}
                <div className="mb-8 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-gold/50 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-amber-600 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <svg width="100%" height="180" viewBox="0 0 400 100">
                    {/* Background grid */}
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    </pattern>
                    <rect width="400" height="100" fill="url(#grid)" />
                    
                    {/* Chart line */}
                    <path
                      d="M0,80 C30,75 60,30 90,40 C120,50 150,20 180,25 C210,30 240,60 270,50 C300,40 330,10 360,5 C390,0 400,10 400,10"
                      fill="none"
                      stroke="url(#chartGradient)"
                      strokeWidth="2"
                    />
                    
                    {/* Fill area under the chart */}
                    <path
                      d="M0,80 C30,75 60,30 90,40 C120,50 150,20 180,25 C210,30 240,60 270,50 C300,40 330,10 360,5 C390,0 400,10 400,10 V100 H0 Z"
                      fill="url(#areaGradient)"
                      opacity="0.3"
                    />
                    
                    {/* Gradients */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Animated dot */}
                    <circle className="animate-pulse" cx="270" cy="50" r="4" fill="#FFD700" />
                  </svg>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">Automatische Analysen</p>
                    <p className="text-xl font-bold text-gold">24/7</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-xs text-gray-400">KI-Technologie</p>
                    <p className="text-xl font-bold text-gold">Neueste Gen</p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {['Vollautomatisches Trading', 'Echtzeit-Marktanalyse', 'Risikominimierung', 'Gewinnmaximierung'].map((item, i) => (
                    <motion.li 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="flex items-center"
                    >
                      <span className="w-5 h-5 mr-2 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center text-xs text-black">✓</span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Contact Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6"
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
