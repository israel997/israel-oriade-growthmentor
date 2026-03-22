"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const BG = "#05092A";

const offers = [
  {
    tag: "Débutant",
    title: "Lancement Digital 30J",
    desc: "Crée ton premier actif digital et obtiens tes premières ventes en 30 jours.",
    price: "79€",
    href: "/formations/lancement-digital-30j",
    points: ["Positionnement", "Offre simple", "Tunnel de vente", "Premiers prospects"],
    image: "/images/P3.jpeg",
  },
  {
    tag: "Intermédiaire",
    title: "Croissance Système",
    desc: "Structures un système d'acquisition et de conversion stable et reproductible.",
    price: "149€",
    href: "/formations/croissance-systeme",
    points: ["KPI & tracking", "Email automation", "Pages de conversion", "Meilleure marge"],
    featured: true,
    image: "/images/P4.jpeg",
  },
  {
    tag: "Avancé",
    title: "Mentorat Elite",
    desc: "Accompagnement stratégique pour scaler ton activité avec clarté.",
    price: "390€",
    href: "/formations/mentorat-elite",
    points: ["Audit business", "Roadmap 90 jours", "Décisions data-driven", "Accélération du CA"],
    image: "/images/P5.jpeg",
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
      {/* Halo bleu central */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(30,80,200,0.3) 0%, transparent 70%)" }} />
      {/* Grille subtile */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "160px 160px" }} />
      {/* Triangles décoratifs */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, top: "-20px", left: "6%", borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: "120px solid rgba(96,165,250,0.06)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, top: "8%", right: "5%", borderLeft: "90px solid transparent", borderRight: "90px solid transparent", borderBottom: "155px solid rgba(245,194,0,0.05)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, bottom: "6%", left: "3%", borderLeft: "55px solid transparent", borderRight: "55px solid transparent", borderTop: "95px solid rgba(96,165,250,0.05)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, top: "45%", right: "10%", borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "70px solid rgba(245,194,0,0.04)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, bottom: "15%", right: "25%", borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "52px solid rgba(96,165,250,0.04)" }} />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <FadeIn>
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
            Top offres
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Choisis ton niveau, avance à ton rythme</h2>
          <p className="mt-3 max-w-xl text-white/50">+10 offres conçues pour aider mes mentees à construire leur business et à gagner au moins 50 000 F chaque mois.<br /><br />Voici mes meilleures recommandations.</p>
        </FadeIn>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {offers.map((offer, i) => (
            <FadeIn key={offer.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6, boxShadow: "inset 0 0 0 2px #1A3FD8, 0 25px 35px -5px rgba(26,63,216,0.2)" }}
                transition={{ duration: 0.25 }}
                className="relative flex h-full flex-col rounded-[24px] overflow-hidden"
                style={{
                  background: offer.featured ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: offer.featured ? "1.5px solid #F5C200" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: offer.featured ? "0 0 0 1px #F5C200, 0 8px 32px rgba(0,0,0,0.3)" : "0 8px 24px rgba(0,0,0,0.2)",
                }}
              >
                {/* Image */}
                <div className="relative w-full h-44 shrink-0">
                  <Image
                    src={offer.image}
                    alt={offer.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                {offer.featured && (
                  <span className="absolute top-3 left-4 rounded-full px-3 py-1 text-xs font-bold text-black z-10" style={{ background: "#F5C200" }}>
                    Populaire
                  </span>
                )}

                <div className="flex flex-col flex-1 p-7">
                <div>
                  <span className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                    {offer.tag}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-white">{offer.title}</h3>
                  <p className="mt-2 text-sm text-white/55 leading-relaxed">{offer.desc}</p>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  {offer.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-white/70">
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" style={{ color: "#F5C200" }}>
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15 3.293 9.879a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{offer.price}</span>
                  <Link
                    href={offer.href}
                    className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                    style={{ background: offer.featured ? "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" : "rgba(255,255,255,0.15)" }}
                  >
                    Voir la formation
                  </Link>
                </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
