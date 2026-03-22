"use client";

import CinematicHero from "@/components/landing/CinematicHero";
import HeroCarousel from "@/components/landing/HeroCarousel";
import ResultsSection from "@/components/landing/ResultsSection";
import FeaturesCarousel from "@/components/landing/FeaturesCarousel";
import StorySection from "@/components/landing/StorySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import CTASection from "@/components/landing/CTASection";

export default function HomeClient() {
  return (
    <div>
      <CinematicHero />
      <HeroCarousel />
      <ResultsSection />
      <StorySection />
      <FeaturesCarousel />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
