
import { ReactNode } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

const PageLayout = ({ children, title, description, className = "" }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-casino-darker text-white overflow-hidden">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            {description && (
              <p className="text-gray-300 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </motion.div>
          
          <div className={`${className}`}>
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PageLayout;
