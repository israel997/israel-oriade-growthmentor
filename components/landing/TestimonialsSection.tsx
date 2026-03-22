"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const BG = "#05092A";

const images = [
  "/images/P3.jpeg",
  "/images/P4.jpeg",
  "/images/P5.jpeg",
  "/images/P6.jpeg",
  "/images/P7.jpeg",
  "/images/P8.jpeg",
  "/images/P9.jpeg",
  "/images/P10.jpeg",
  "/images/P11.jpeg",
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % images.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + images.length) % images.length, -1);
  }, [current, goTo]);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      {/* Halo bleu central — même style que CTASection */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,80,200,0.3) 0%, transparent 70%)" }} />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}
          >
            Témoignages
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ils ont fait le saut. Et ça a marché.
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative mt-12">
          <div
            className="relative overflow-hidden rounded-3xl"
            style={{
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.6)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              aspectRatio: "16/9",
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={images[current]}
                  alt={`Témoignage ${current + 3}`}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 900px"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Flèche gauche */}
          <button
            type="button"
            onClick={prev}
            aria-label="Précédent"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ background: "rgba(6,11,46,0.7)", backdropFilter: "blur(8px)" }}
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Flèche droite */}
          <button
            type="button"
            onClick={next}
            aria-label="Suivant"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ background: "rgba(6,11,46,0.7)", backdropFilter: "blur(8px)" }}
          >
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indicateurs */}
          <div className="mt-6 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Image ${i + 3}`}
                className="rounded-full transition-all duration-300"
                style={{
                  width: current === i ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  background: current === i ? "#F5C200" : "rgba(0,0,0,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
