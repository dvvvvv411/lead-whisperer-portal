
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CtaSection from "@/components/landing/CtaSection";
import ContactSection from "@/components/landing/ContactSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import PartnersSection from "@/components/landing/PartnersSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-casino-darker text-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <TestimonialsSection />
        <PartnersSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
