"use client";

import CinematicHero from "@/components/landing/CinematicHero";
import HeroCarousel from "@/components/landing/HeroCarousel";
import Image from "next/image";
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
      {/* Photo P2 — mobile only, avant le carousel */}
      <div className="md:hidden relative w-full overflow-hidden" style={{ background: "#060B2E", aspectRatio: "3/4" }}>
        {/* Overlay sombre progressif */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: "linear-gradient(to bottom, rgba(6,11,46,0.25) 0%, rgba(6,11,46,0.1) 40%, rgba(6,11,46,0.55) 100%)" }} />
        <Image src="/images/P2.webp" alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: "center 15%" }} />
      </div>
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
