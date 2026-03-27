"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const BG = "#060B2E";

const slides = [
  {
    tag: "Formations",
    title: "Lance ton premier\nproduit digital",
    desc: "De zéro à ta première vente en 30 jours. Méthode étape par étape, sans blabla.",
    cta: { label: "Voir les formations", href: "/formations" },
  },
  {
    tag: "Ressources",
    title: "Des guides conçus\npour l'action",
    desc: "Ebooks, checklists et templates prêts à l'emploi pour avancer sans se perdre.",
    cta: { label: "Accéder aux ressources", href: "/ressources" },
  },
  {
    tag: "Communauté",
    title: "Rejoins +500 membres\nqui avancent",
    desc: "Une communauté active, des retours concrets et un accompagnement humain.",
    cta: { label: "Notre communauté", href: "/contenus" },
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 1);
  }, [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section id="next-section" className="relative overflow-hidden py-20" style={{ background: BG }}>
      {/* Grain — identique CinematicHero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "300px 300px" }} />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-3xl p-8 sm:p-12"
          style={{
            background: "rgba(5,9,42,0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <span
                className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}
              >
                {slide.tag}
              </span>
              <h2 className="mt-4 whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-lg text-base text-white/60 sm:text-lg">{slide.desc}</p>
              <Link
                href={slide.cta.href}
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
              >
                {slide.cta.label}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Slide ${i + 1}`}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: current === i ? "2.5rem" : "0.5rem",
                  background: current === i ? "#3B82F6" : "rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
