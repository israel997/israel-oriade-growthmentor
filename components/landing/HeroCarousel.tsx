"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const BG = "linear-gradient(135deg, #8C8C8C 0%, #D0D0D0 55%, #B8B8B8 100%)";

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
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className="overflow-hidden rounded-3xl p-8 sm:p-12"
          style={{
            background: "rgba(255,255,255,0.35)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.6)",
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
                style={{ background: "rgba(6,11,46,0.1)", color: "#060B2E" }}
              >
                {slide.tag}
              </span>
              <h2 className="mt-4 whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-[#111] sm:text-4xl lg:text-5xl">
                {slide.title}
              </h2>
              <p className="mt-4 max-w-lg text-base text-[#444] sm:text-lg">{slide.desc}</p>
              <Link
                href={slide.cta.href}
                className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                style={{ background: "#F5C200" }}
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
                  background: current === i ? "#F5C200" : "rgba(0,0,0,0.2)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
