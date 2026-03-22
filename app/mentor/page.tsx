"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import StorySection from "@/components/landing/StorySection";

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
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

const stats = [
  { val: "+180", label: "Entrepreneurs mentorés" },
  { val: "+50", label: "TPE accompagnées" },
  { val: "+30", label: "Formateurs certifiés" },
  { val: "+300", label: "Participants au Tligui Summit" },
];

const expertise = [
  {
    icon: "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941",
    title: "Business Digital",
    desc: "Lancement de produits digitaux, tunnels de vente, acquisition et conversion en ligne.",
  },
  {
    icon: "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6",
    title: "Marketing & Contenu",
    desc: "Stratégie de contenu, réseaux sociaux, personal branding et email marketing.",
  },
  {
    icon: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
    title: "Formation & Mentorat",
    desc: "Accompagnement individuel, formation structurée, transfert de compétences actionnable.",
  },
  {
    icon: "M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3",
    title: "Tech & Intelligence Artificielle",
    desc: "Intégration des outils IA dans les business, automatisation, parcours fullstack EPITECH.",
  },
];

const values = [
  { emoji: "01", title: "L'action avant la théorie", desc: "Je ne forme pas pour former. Chaque session produit un résultat concret, mesurable, immédiat." },
  { emoji: "02", title: "La clarté comme levier", desc: "Un business flou ne vend pas. Ma méthode part toujours d'un positionnement ultra précis." },
  { emoji: "03", title: "L'impact réel avant les chiffres", desc: "Le but n'est pas d'avoir de grandes stats, mais de voir mes mentees construire une vraie indépendance." },
];

export default function MentorPage() {
  return (
    <div style={{ background: "#05092A" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Grain */}
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.28]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "300px 300px" }} />
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 70% 50%, rgba(30,80,200,0.25) 0%, transparent 70%)" }} />

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="pointer-events-none absolute right-0 top-0 hidden h-full lg:block"
          style={{ width: "48%" }}
        >
          <Image src="/images/P1.PNG" alt="" fill className="object-cover object-top" sizes="48vw" priority />
          {/* Gradient masque gauche */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #05092A 0%, transparent 35%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #05092A 0%, transparent 30%)" }} />
        </motion.div>

        <div className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide" style={{ borderColor: "rgba(245,194,0,0.4)", color: "#F5C200", background: "rgba(245,194,0,0.08)" }}>
                <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "#F5C200" }} />
                The Growth Mentor
              </span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="mt-6 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Israël<br />
              <span style={{ color: "rgba(255,255,255,0.6)" }}>Oriadé</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-6 max-w-lg text-lg leading-relaxed text-white/55">
              Entrepreneur digital, formateur et mentor de +180 jeunes entrepreneurs africains. Je transforme l'ambition en résultats concrets grâce à des méthodes éprouvées sur le terrain.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.38 }} className="mt-10 flex flex-wrap gap-4">
              <Link href="/diagnostic" className="group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
                Évaluer mon niveau
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/communaute" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5">
                Rejoindre la communauté
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="relative py-16 border-y border-white/6">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.08}>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                  className="rounded-2xl p-6 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <p className="text-3xl font-bold text-white">{s.val}</p>
                  <p className="mt-1 text-xs text-white/40">{s.label}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="relative py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(26,63,216,0.12) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-5xl px-6 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-start">
          <FadeIn>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.12)", color: "#60A5FA" }}>
              À propos
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Qui est Israël Oriadé ?
            </h2>
            <div className="mt-6 space-y-4 text-white/60 leading-relaxed text-sm">
              <p>
                Je suis Israël Oriadé, entrepreneur digital basé en Afrique. Mon parcours a commencé en 2017 avec la rédaction web — une découverte qui a tout changé. En 2018, j'ai tout misé sur le digital en perdant mon emploi, avec zéro filet de sécurité.
              </p>
              <p>
                Depuis, j'ai accompagné <strong className="text-white">+180 entrepreneurs</strong>, formé +30 rédacteurs réinsérés en entreprise, soutenu +50 TPE dans leur croissance, et organisé le <strong className="text-white">Tligui Digital Summit</strong> avec plus de 300 participants.
              </p>
              <p>
                Aujourd'hui, je combine expertise business, marketing digital et intelligence artificielle pour aider les entrepreneurs africains à construire un revenu réel et durable en ligne — sans perdre 6 mois à tâtonner.
              </p>
              <p>
                Je suis également en formation fullstack chez <strong className="text-white">EPITECH</strong>, ce qui me permet d'intégrer la tech dans les stratégies de mes mentees.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="mt-12 lg:mt-0 space-y-4">
              {values.map((v, i) => (
                <div key={v.title} className="flex gap-4 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="text-xl font-bold shrink-0 mt-0.5" style={{ color: "#F5C200" }}>{v.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-white">{v.title}</h3>
                    <p className="mt-1 text-sm text-white/50 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── EXPERTISE ── */}
      <section className="relative py-24 border-t border-white/6">
        <div className="mx-auto max-w-5xl px-6">
          <FadeIn>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(245,194,0,0.1)", color: "#F5C200" }}>
              Domaines d'expertise
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Ce que je maîtrise</h2>
          </FadeIn>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {expertise.map((e, i) => (
              <FadeIn key={e.title} delay={i * 0.08}>
                <div className="group flex gap-4 rounded-2xl p-6 transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(26,63,216,0.15)", color: "#60A5FA" }}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={e.icon} />
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-bold text-white">{e.title}</h3>
                    <p className="mt-1.5 text-sm text-white/50 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY SECTION (timeline) ── */}
      <StorySection />

      {/* ── CTA FINAL ── */}
      <section className="relative py-24 border-t border-white/6">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,80,200,0.18) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Prêt à construire avec moi ?
            </h2>
            <p className="mt-4 text-white/50">
              Commence par évaluer ton niveau. Je t'indiquerai le chemin le plus direct pour atteindre tes objectifs.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/diagnostic" className="group inline-flex items-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-white transition-transform hover:scale-[1.02]" style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
                Faire mon diagnostic gratuit
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              </Link>
              <Link href="/formations" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-7 py-4 text-sm font-semibold text-white transition-all hover:border-white/40 hover:bg-white/5">
                Voir les formations
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
