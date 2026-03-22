"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  {
    value: "+180",
    label: "Membres accompagnés",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c3.314 0 6 1.343 6 3v1H6v-1c0-1.657 2.686-3 6-3zm0 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 0c1.657 0 3 1.343 3 3v1h-3m-9 0H3v-1c0-1.657 1.343-3 3-3" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #6B21E8 0%, #9333EA 100%)",
  },
  {
    value: "87%",
    label: "De résultats en < 8 sem.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
  },
  {
    value: "×2.4",
    label: "Taux de conversion moyen",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #15803D 0%, #22C55E 100%)",
  },
  {
    value: "14j",
    label: "Pour le 1er revenu en ligne",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #B45309 0%, #F5C200 100%)",
  },
  {
    value: "4.9★",
    label: "Note moyenne des membres",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #C2410C 0%, #FB923C 100%)",
  },
  {
    value: "3×",
    label: "ROI moyen à 90 jours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)",
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function ResultsSection() {
  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(135deg, #2E2E2E 0%, #424242 55%, #383838 100%)" }}
    >
      {/* Motif dots bleu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(rgba(245,194,0,0.35) 1.5px, transparent 1.5px)", backgroundSize: "72px 72px" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header aligné à droite */}
        <FadeIn>
          <div className="text-left">
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}
            >
              Mes résultats
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Des chiffres,{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(90deg, #818CF8 0%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                pas des promesses
              </span>
              .
            </h2>
            <p className="mt-5 max-w-xl text-base text-white/50">
              Depuis le lancement de GrowthMentor, j'ai accompagné des centaines de personnes à lancer leur activité et à générer leurs premiers revenus en ligne. Voici ce que ça donne.
            </p>
          </div>
        </FadeIn>

        {/* 6 cards — 3 colonnes × 2 rangées */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-start rounded-2xl p-6"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                }}
              >
                {/* Icône */}
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                  style={{ background: s.iconBg }}
                >
                  {s.icon}
                </div>

                {/* Valeur */}
                <p className="mt-5 text-4xl font-extrabold text-white">{s.value}</p>

                {/* Label */}
                <p className="mt-2 text-sm text-white/50">{s.label}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
