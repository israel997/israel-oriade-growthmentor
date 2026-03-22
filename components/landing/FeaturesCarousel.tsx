"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

const BG = "linear-gradient(135deg, #8C8C8C 0%, #D0D0D0 55%, #B8B8B8 100%)";

const offers = [
  {
    tag: "Débutant",
    title: "Lancement Digital 30J",
    desc: "Crée ton premier actif digital et obtiens tes premières ventes en 30 jours.",
    price: "79€",
    href: "/formations/lancement-digital-30j",
    points: ["Positionnement", "Offre simple", "Tunnel de vente", "Premiers prospects"],
  },
  {
    tag: "Intermédiaire",
    title: "Croissance Système",
    desc: "Structures un système d'acquisition et de conversion stable et reproductible.",
    price: "149€",
    href: "/formations/croissance-systeme",
    points: ["KPI & tracking", "Email automation", "Pages de conversion", "Meilleure marge"],
    featured: true,
  },
  {
    tag: "Avancé",
    title: "Mentorat Elite",
    desc: "Accompagnement stratégique pour scaler ton activité avec clarté.",
    price: "390€",
    href: "/formations/mentorat-elite",
    points: ["Audit business", "Roadmap 90 jours", "Décisions data-driven", "Accélération du CA"],
  },
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

export default function FeaturesCarousel() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(6,11,46,0.1)", color: "#060B2E" }}>
            Mes offres
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#111] sm:text-4xl">Choisis ton niveau, avance à ton rythme</h2>
          <p className="mt-3 max-w-xl text-[#444]">Trois programmes conçus pour s'adapter à là où tu en es — et t'emmener là où tu veux aller.</p>
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {offers.map((offer, i) => (
            <FadeIn key={offer.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "0 25px 35px -5px rgba(0,0,0,0.15)" }}
                transition={{ duration: 0.25 }}
                className="relative flex h-full flex-col rounded-[24px] p-7"
                style={{
                  background: offer.featured ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.45)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: offer.featured ? "1.5px solid #F5C200" : "1px solid rgba(255,255,255,0.7)",
                  boxShadow: offer.featured ? "0 0 0 1px #F5C200, 0 8px 32px rgba(0,0,0,0.1)" : "0 8px 24px rgba(0,0,0,0.08)",
                }}
              >
                {offer.featured && (
                  <span className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-bold text-black" style={{ background: "#F5C200" }}>
                    Populaire
                  </span>
                )}
                <div>
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "rgba(6,11,46,0.1)", color: "#060B2E" }}>
                    {offer.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[#111]">{offer.title}</h3>
                  <p className="mt-2 text-sm text-[#555] leading-relaxed">{offer.desc}</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  {offer.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-[#333]">
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#F5C200" }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#111]">{offer.price}</span>
                  <Link
                    href={offer.href}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                    style={{ background: offer.featured ? "#F5C200" : "#1a1a1a" }}
                  >
                    Voir la formation
                  </Link>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
