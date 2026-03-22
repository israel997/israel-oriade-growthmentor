"use client";

import CinematicHero from "@/components/landing/CinematicHero";
import HeroCarousel from "@/components/landing/HeroCarousel";
import ResultsSection from "@/components/landing/ResultsSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FeaturesCarousel from "@/components/landing/FeaturesCarousel";
import CertificationsSection from "@/components/landing/CertificationsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";
import SectionSidebar from "@/components/landing/SectionSidebar";

export default function HomeClient() {
  return (
    <div>
      <SectionSidebar />
      <CinematicHero />
      <div id="section-carousel"><HeroCarousel /></div>
      <div id="section-results"><ResultsSection /></div>
      <div id="section-story"><CertificationsSection /></div>
      <div id="section-benefits"><BenefitsSection /></div>
      <div id="section-features"><FeaturesCarousel /></div>
      <div id="section-testimonials"><TestimonialsSection /></div>
      <div id="section-cta"><CTASection /></div>
    </div>
  );
}
