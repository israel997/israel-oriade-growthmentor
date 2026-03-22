"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CinematicHero() {
  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: "#060B2E" }}
    >
      {/* Grain / texture noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />
      {/* Grille jaune or — grandes mailles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.15) 1px, transparent 1px)",
          backgroundSize: "140px 140px",
        }}
      />
      {/* Vignette douce sur les bords */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 25%, rgba(4,8,22,0.70) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide"
              style={{ borderColor: "rgba(245,194,0,0.5)", color: "#F5C200", background: "rgba(245,194,0,0.1)" }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#F5C200" }} />
              Mentor Business Digital
            </span>
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Construis ton
            <span
              className="block"
              style={{
                color: "rgba(255,255,255,0.75)",
                WebkitTextFillColor: "rgba(255,255,255,0.75)",
              }}
            >
              business digital.
            </span>
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-blue-100"
          >
            Formations, ressources et accompagnement personnalisé pour lancer, structurer et scaler ton activité sans perdre 6 mois à tâtonner.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/quiz"
              className="group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "#F5C200" }}
            >
              Évaluer mon niveau
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/formations"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5"
            >
              Voir les formations
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-14 flex flex-wrap gap-3"
          >
            {["+180 membres", "87% de résultats < 8 semaines", "×2.4 de conversion"].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-blue-100"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        type="button"
        aria-label="Voir la section suivante"
        onClick={() => document.getElementById("next-section")?.scrollIntoView({ behavior: "smooth" })}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-blue-200/50 cursor-pointer hover:text-blue-200 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
