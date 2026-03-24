"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const BG = "#05092A";

const certifications = [
  {
    year: "2025",
    org: "NASA",
    title: "NASA Problem Solver",
    desc: "Certification internationale délivrée par la NASA pour la résolution de problèmes complexes à impact global.",
    color: "#60A5FA",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    year: "2025",
    org: "EPITECH",
    title: "Certification EPITECH",
    desc: "Certification technique délivrée par EPITECH, école internationale du numérique, dans le cadre du parcours fullstack.",
    color: "#F5C200",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5 3 12l3.75 4.5m10.5 0L21 12l-3.75-4.5M14.25 4.5l-4.5 15" />
      </svg>
    ),
  },
  {
    year: "2026",
    org: "Future Studio",
    title: "Entrepreneurship Track Program",
    desc: "Programme d'entrepreneuriat international délivré par Future Studio, axé sur la croissance, l'innovation et le leadership.",
    color: "#22C55E",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
  },
];

function CertCard({ cert, i }: { cert: typeof certifications[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        className="relative rounded-3xl p-7 h-full"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1.5px solid ${cert.color}30`,
          boxShadow: `0 0 32px ${cert.color}10`,
        }}
      >
        {/* Badge année */}
        <span
          className="absolute top-5 right-5 rounded-full px-2.5 py-0.5 text-xs font-bold tracking-widest"
          style={{ background: `${cert.color}15`, color: cert.color }}
        >
          {cert.year}
        </span>

        {/* Icône */}
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: `${cert.color}12`, color: cert.color }}
        >
          {cert.icon}
        </span>

        {/* Org */}
        <p className="mt-5 text-xs font-semibold uppercase tracking-widest" style={{ color: cert.color }}>
          {cert.org}
        </p>

        {/* Titre */}
        <h3 className="mt-2 text-xl font-bold text-white">{cert.title}</h3>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-white/50">{cert.desc}</p>

        {/* Badge certifié */}
        <div className="mt-6 inline-flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke={cert.color} strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
          </svg>
          <span className="text-xs font-semibold" style={{ color: cert.color }}>Certifié internationalement</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CertificationsSection() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: BG }}>
      {/* Halo */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(30,80,200,0.35) 0%, rgba(10,30,100,0.15) 55%, transparent 80%)" }} />
      {/* Grille */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "160px 160px" }} />
      {/* Formes décoratives */}
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 260, height: 260, top: "-80px", left: "-60px", background: "rgba(30,80,220,0.1)", border: "1px solid rgba(255,255,255,0.05)", filter: "blur(2px)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 140, height: 140, top: "6%", right: "8%", background: "transparent", border: "1px solid rgba(255,255,255,0.06)", transform: "rotate(18deg)", borderRadius: "16px" }} />
      <div aria-hidden className="pointer-events-none absolute rounded-full" style={{ width: 200, height: 200, bottom: "5%", right: "-50px", background: "rgba(20,60,180,0.08)", border: "1px solid rgba(255,255,255,0.05)" }} />
      <div aria-hidden className="pointer-events-none absolute" style={{ width: 80, height: 80, top: "50%", left: "4%", background: "transparent", border: "1px solid rgba(245,194,0,0.1)", transform: "rotate(45deg)", borderRadius: "8px" }} />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
            Mes Certifications
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Reconnu à l'international
          </h2>
          <p className="mt-3 max-w-xl text-white/50">
            Des certifications obtenues auprès d'institutions mondiales qui valident l'expertise et l'engagement dans l'excellence.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {certifications.map((cert, i) => (
            <CertCard key={cert.title} cert={cert} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
