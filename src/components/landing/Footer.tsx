
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-casino-darker relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2 lg:col-span-1"
          >
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">KRYPTO AI</span>
            </div>
            <p className="text-gray-400 mb-4">
              Die Zukunft des Krypto-Tradings mit KI-Unterstützung. Maximiere deine Renditen durch unseren fortschrittlichen Algorithmus.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Twitter">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="LinkedIn">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors" aria-label="Telegram">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"></path>
                </svg>
              </a>
            </div>
          </motion.div>
          
          {/* Links columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold mb-4">Plattform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Trading Bot</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Marktanalyse</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Portfolioperformance</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">KI-Algorithmus</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-bold mb-4">Unternehmen</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Über uns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Team</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Karriere</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Blog</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Kontakt</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Dokumentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-gold transition-colors">Ressourcen</a></li>
            </ul>
          </motion.div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {currentYear} KRYPTO AI. Alle Rechte vorbehalten.
            </p>
            
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">AGB</a>
              <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">Datenschutz</a>
              <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">Cookies</a>
              <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">Impressum</a>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Risikohinweis: Der Handel mit Kryptowährungen birgt erhebliche Risiken und kann zum Verlust Ihres investierten Kapitals führen. Bitte investieren Sie nur Beträge, deren Verlust Sie sich leisten können.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
