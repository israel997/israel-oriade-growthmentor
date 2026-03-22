"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BG = "#05092A";

const milestones = [
  { year: "2017", title: "La découverte", desc: "Je découvre la rédaction web : mon tout premier business digital." },
  { year: "2018", title: "Le saut", desc: "Je perds mon boulot. Je me lance en tant que freelance, sans filet." },
  { year: "2019", title: "Les premiers revenus", desc: "Je génère entre 200 000 et 400 000 XOF par mois grâce à la rédaction web. Je lance mon entreprise." },
  { year: "2020", title: "Le 1er Million", desc: "Je fais mon premier million. Je forme +30 personnes en rédaction web — 50% sont réinsérées en entreprise." },
  { year: "2022", title: "L'impact TPE", desc: "+50 TPE accompagnées dans la croissance de leur business. La méthode fait ses preuves." },
  { year: "2024", title: "Le sommet", desc: "J'organise le TLIGUI DIGITAL SUMMIT avec +300 participants. Lancement des formations structurées à grande échelle." },
  { year: "2025", title: "Tech & IA", desc: "Je suis un parcours fullstack avec l'université EPITECH. Je forme des entrepreneurs à l'intelligence artificielle." },
  { year: "2026", title: "Aujourd'hui", desc: "Mentor de +180 jeunes entrepreneurs africains. La mission continue.", accent: true },
];

function MilestoneCard({ m, i }: { m: typeof milestones[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const isLeft = i % 2 === 0;

  return (
    <div className="relative flex items-center">
      {/* Carte gauche */}
      <div className={`w-[calc(50%-2rem)] ${isLeft ? "pr-6" : "ml-auto pl-6"}`}>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 3.5 + i * 0.25, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1.5px solid rgba(245,194,0,0.35)",
              boxShadow: "0 8px 32px rgba(245,194,0,0.08)",
              textAlign: isLeft ? "right" : "left",
            }}
          >
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-xs font-bold tracking-widest"
              style={{
                background: "rgba(245,194,0,0.12)",
                color: "#F5C200",
              }}
            >
              {m.year}
            </span>
            <h3 className="mt-3 text-sm font-bold text-white">{m.title}</h3>
            <p className="mt-1.5 text-sm text-white/55 leading-relaxed">{m.desc}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Point sur la ligne */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10">
        <div
          className="h-4 w-4 rounded-full border-2"
          style={{
            background: m.accent ? "#F5C200" : "#060B2E",
            borderColor: m.accent ? "#F5C200" : "#F5C200",
            boxShadow: m.accent ? "0 0 12px rgba(245,194,0,0.5)" : "0 0 8px rgba(245,194,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}

export default function StorySection() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      {/* Halo bleu central */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(30,80,200,0.45) 0%, rgba(10,30,100,0.2) 50%, transparent 80%)" }} />

      {/* Grille subtile */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "160px 160px" }} />

      {/* Formes abstraites */}
      {/* Cercle haut gauche */}
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 260, height: 260, top: "-80px", left: "-60px", background: "rgba(30,80,220,0.12)", border: "1px solid rgba(255,255,255,0.06)", filter: "blur(2px)" }} />
      {/* Carré rotatif haut droite */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 140, height: 140, top: "6%", right: "8%", background: "transparent", border: "1px solid rgba(255,255,255,0.07)", transform: "rotate(18deg)", borderRadius: "16px" }} />
      {/* Cercle bas droite */}
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 200, height: 200, bottom: "5%", right: "-50px", background: "rgba(20,60,180,0.1)", border: "1px solid rgba(255,255,255,0.05)", filter: "blur(1px)" }} />
      {/* Petit losange milieu gauche */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 80, height: 80, top: "50%", left: "4%", background: "transparent", border: "1px solid rgba(245,194,0,0.12)", transform: "rotate(45deg)", borderRadius: "8px" }} />
      {/* Grand cercle bas gauche */}
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 320, height: 320, bottom: "-100px", left: "15%", background: "transparent", border: "1px solid rgba(255,255,255,0.04)" }} />
      {/* Petit carré bas centre */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 60, height: 60, bottom: "18%", right: "30%", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", transform: "rotate(30deg)", borderRadius: "6px" }} />
      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
            Mon parcours
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">De l&apos;incertitude <em>à un positionnement fort</em></h2>
          <p className="mt-3 max-w-xl text-white/50">Des années de terrain condensées en un système simple pour lancer, vendre et scaler sans se disperser.</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mt-16">
          {/* Ligne verticale centrale */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: "2px", background: "linear-gradient(to bottom, transparent 0%, #F5C200 8%, #F5C200 92%, transparent 100%)" }} />

          <div className="space-y-10">
            {milestones.map((m, i) => (
              <MilestoneCard key={m.year} m={m} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
