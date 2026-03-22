"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BG = "linear-gradient(135deg, #8C8C8C 0%, #D0D0D0 55%, #B8B8B8 100%)";

const milestones = [
  { year: "2019", title: "Les débuts", desc: "Premier business en ligne lancé avec zéro budget. Premières erreurs, premières leçons." },
  { year: "2021", title: "La méthode", desc: "Développement d'un système reproductible après +180 accompagnements individuels." },
  { year: "2023", title: "La plateforme", desc: "Lancement des formations structurées pour transmettre la méthode à grande échelle." },
  { year: "2026", title: "Aujourd'hui", desc: "+180 membres accompagnés, 87% de résultats en moins de 8 semaines.", accent: true },
];

const stats = [
  { value: "+180", label: "membres accompagnés" },
  { value: "87%", label: "de résultats < 8 sem." },
  { value: "×2.4", label: "taux de conversion" },
  { value: "14j", label: "1er revenu en moyenne" },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

export default function StorySection() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(6,11,46,0.1)", color: "#060B2E" }}>
            Mon parcours
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">De l&apos;incertitude à une méthode claire</h2>
          <p className="mt-3 max-w-xl text-[#444]">Des années de terrain condensées en un système simple pour lancer, vendre et scaler sans se disperser.</p>
        </FadeIn>

        <div className="mt-16 relative">
          <div className="absolute left-6 top-0 h-full w-px bg-black/10 sm:left-1/2" aria-hidden />
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <FadeIn key={m.year} delay={i * 0.1}>
                <div className={`relative flex items-start gap-8 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  <div className="absolute left-6 top-1 -translate-x-1/2 sm:left-1/2">
                    <div className="h-3 w-3 rounded-full border-2 border-white" style={{ background: m.accent ? "#C9A84C" : "#999" }} />
                  </div>
                  <div className={`ml-14 w-full sm:ml-0 sm:w-[45%] ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12 sm:ml-[55%]"}`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#777]">{m.year}</span>
                    <h3 className="mt-1 text-lg font-semibold text-[#111]">{m.title}</h3>
                    <p className="mt-1 text-sm text-[#555] leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08}>
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
              >
                <p className="text-3xl font-bold text-[#111]">{s.value}</p>
                <p className="mt-1 text-xs text-[#666]">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
