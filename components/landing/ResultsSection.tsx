"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const stats = [
  {
    prefix: "+", num: 180, suffix: "", value: "+180",
    sub: "apprenants",
    label: "Formés au business 3.0 et à l'IA",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14c3.314 0 6 1.343 6 3v1H6v-1c0-1.657 2.686-3 6-3zm0 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 0c1.657 0 3 1.343 3 3v1h-3m-9 0H3v-1c0-1.657 1.343-3 3-3" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #6B21E8 0%, #9333EA 100%)",
  },
  {
    prefix: "", num: 90, suffix: "%", value: "90%",
    sub: "de résultats",
    label: "En moins de 17 jours",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)",
  },
  {
    prefix: "", num: 8, suffix: " ans", value: "8 ans",
    sub: "d'expérience",
    label: "En business management",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #15803D 0%, #22C55E 100%)",
  },
  {
    prefix: "+", num: 20, suffix: "", value: "+20",
    sub: "formations",
    label: "Et accompagnements offerts",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #B45309 0%, #F5C200 100%)",
  },
  {
    prefix: "", num: 10, suffix: "+", value: "10+",
    sub: "pays",
    label: "Touchés en organique",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 0c-1.657 2.686-2 5.657-2 10s.343 7.314 2 10m0-20c1.657 2.686 2 5.657 2 10s-.343 7.314-2 10M2 12h20" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)",
  },
  {
    prefix: "+", num: 30, suffix: "", value: "+30",
    sub: "TPE/PME",
    label: "Accompagnées en croissance sur 8 ans",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    iconBg: "linear-gradient(135deg, #C2410C 0%, #FB923C 100%)",
  },
];

function CountUp({ prefix = "", num, suffix = "", inView }: { prefix?: string; num: number; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(ease * num));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);

  return <>{prefix}{count}{suffix}</>;
}

function StatCard({ s, delay }: { s: typeof stats[0]; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className="h-full"
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}
        transition={{ duration: 0.22 }}
        className="flex h-full flex-col rounded-2xl p-8"
        style={{
          background: "linear-gradient(135deg, #05092A 0%, #0D1B5E 60%, #07103A 100%)",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
            style={{ background: s.iconBg }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
              {s.icon.props.children}
            </svg>
          </div>
          <p className="text-2xl font-extrabold text-white leading-none">
            <CountUp prefix={s.prefix} num={s.num} suffix={s.suffix} inView={inView} />
            {" "}<span className="text-2xl font-extrabold text-white/80">{s.sub}</span>
          </p>
        </div>
        <p className="mt-3 text-sm text-white/45">{s.label}</p>
      </motion.div>
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
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
              Un mentor,{" "}
              <span
                className="italic"
                style={{
                  background: "linear-gradient(90deg, #818CF8 0%, #A78BFA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                avec une vraie expérience
              </span>
              .
            </h2>
            <p className="mt-5 max-w-xl text-base text-white/50">
              Un jour j'étais comme toi. Et avec le temps, j'ai fait mes preuves :
            </p>
            <ul className="mt-3 space-y-2 max-w-xl">
              {["Des résultats concrets", "Des clients satisfaits", "Des formations reconnues", "Une communauté qui grandit chaque jour"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/60">
                  <span style={{ color: "#F5C200" }}>→</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 max-w-xl text-base text-white/50">
              Voici ce que j'ai accompli ; et ce que je peux t'aider à accomplir aussi.
            </p>
          </div>
        </FadeIn>

        {/* 6 cards — 3 colonnes × 2 rangées */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {stats.map((s, i) => (
            <StatCard key={s.label} s={s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
