"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BG = "#060B2E";

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #6B21E8 0%, #9333EA 100%)",
    title: "Des outils testés",
    desc: "Des outils concrets que tu peux utiliser dès aujourd'hui pour avancer dans ton business.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
    title: "Des ressources business gratuites",
    desc: "Ebooks, checklists et templates offerts pour structurer ton projet sans dépenser un centime.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #B45309 0%, #F5C200 100%)",
    title: "Formations & accompagnements",
    desc: "Accède à toutes mes formations et mes programmes d'accompagnement en un seul endroit.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #15803D 0%, #22C55E 100%)",
    title: "Diagnostic personnel gratuit",
    desc: "Un diagnostic sur mesure pour identifier le meilleur business adapté à ton profil de débutant.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)",
    title: "Mes contenus sociaux",
    desc: "Retrouve tous mes contenus, vidéos et posts pour t'inspirer et rester dans l'action.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #C2410C 0%, #FB923C 100%)",
    title: "Un espace personnel",
    desc: "Sauvegarde tes ressources, tes formations et tes progressions dans ton espace dédié.",
  },
];

function BenefitCard({ b, i }: { b: typeof benefits[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const fromLeft = i % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: fromLeft ? -48 : 48 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
        transition={{ duration: 0.22 }}
        className="flex h-full flex-col gap-3 rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(96,165,250,0.15)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ background: b.iconBg }}
          >
            {b.icon}
          </div>
          <h3 className="text-base font-bold text-white leading-tight">{b.title}</h3>
        </div>
        <p className="text-sm text-white/55 leading-relaxed">{b.desc}</p>
      </motion.div>
    </motion.div>
  );
}

export default function BenefitsSection() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      {/* Halo bleu central */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(30,80,200,0.35) 0%, rgba(10,30,100,0.15) 50%, transparent 80%)" }} />

      {/* Triangles décoratifs */}
      {/* Triangle haut gauche */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, top: "6%", left: "5%", borderLeft: "50px solid transparent", borderRight: "50px solid transparent", borderBottom: "86px solid rgba(245,194,0,0.07)" }} />
      {/* Triangle haut droite (plus grand) */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, top: "-20px", right: "8%", borderLeft: "80px solid transparent", borderRight: "80px solid transparent", borderBottom: "138px solid rgba(96,165,250,0.06)" }} />
      {/* Triangle bas gauche (retourné) */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, bottom: "8%", left: "12%", borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderTop: "104px solid rgba(245,194,0,0.05)" }} />
      {/* Triangle milieu droite (retourné, grand) */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, top: "40%", right: "3%", borderLeft: "45px solid transparent", borderRight: "45px solid transparent", borderBottom: "78px solid rgba(96,165,250,0.05)" }} />
      {/* Petit triangle bas droite */}
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 0, height: 0, bottom: "12%", right: "18%", borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderTop: "52px solid rgba(245,194,0,0.06)" }} />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
            Ma Plateforme
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ce dont tu vas <em>profiter ici</em>
          </h2>
          <p className="mt-3 max-w-xl text-white/50">
            Tout ce qu'il te faut pour lancer, structurer et faire croître ton business — au même endroit.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {benefits.map((b, i) => (
            <BenefitCard key={b.title} b={b} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
