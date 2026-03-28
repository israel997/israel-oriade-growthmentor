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
      {/* PP2 — mobile uniquement, après le hero */}
      <div className="md:hidden w-full relative overflow-hidden" style={{ background: "#060B2E" }}>
        {/* Grain */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-[0.35]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "300px 300px" }} />
        {/* Grille or */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)", backgroundSize: "140px 140px" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/PP2.webp" alt="" className="w-full block" style={{ height: "80vh", objectFit: "cover", objectPosition: "top" }} />
        {/* Overlay vignette */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10" style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, rgba(4,8,22,0.70) 100%)" }} />
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
