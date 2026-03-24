"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { saveUserData } from "@/lib/sync-user-data";
import { toast } from "sonner";

// ── Test definitions ──────────────────────────────────────────────────────────

const TESTS: Record<string, {
  label: string;
  subtitle: string;
  storageKey: string;
  color: string;
  bg: string;
  questions: { q: string; opts: string[] }[];
}> = {
  contenu: {
    label: "Stratégies de Contenu",
    subtitle: "Évalue ta maîtrise de la création, planification et distribution de contenu.",
    storageKey: "gm_test_contenu_results",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.12)",
    questions: [
      { q: "Tu publies du contenu sur les réseaux sociaux combien de fois par semaine ?",           opts: ["Jamais", "1 fois", "2–3 fois", "4 fois ou plus"] },
      { q: "Tu as un calendrier éditorial ou un planning de contenu défini ?",                      opts: ["Non", "J'improvise", "Partiellement", "Oui, structuré"] },
      { q: "Tu adaptes ton contenu au format de chaque plateforme (LinkedIn, Insta, TikTok...) ?", opts: ["Non, même contenu partout", "Rarement", "Souvent", "Toujours"] },
      { q: "Tu analyses tes statistiques de contenu (portée, engagement, clics...) ?",              opts: ["Jamais", "De temps en temps", "Mensuellement", "Chaque semaine"] },
      { q: "Ton contenu intègre un appel à l'action clair (CTA) ?",                                opts: ["Jamais", "Parfois", "Souvent", "Systématiquement"] },
      { q: "Tu réutilises ou recycles tes anciens contenus performants ?",                          opts: ["Jamais", "Rarement", "Régulièrement", "C'est une stratégie clé"] },
      { q: "Tu produis plusieurs formats (texte, vidéo, carrousel, audio...) ?",                    opts: ["Non, un seul format", "2 formats", "3 formats", "4 formats ou plus"] },
      { q: "Ton contenu reflète un positionnement clair et différenciant ?",                        opts: ["Pas du tout", "Vaguement", "Assez bien", "Très clairement"] },
      { q: "Tu collabores ou fais des partenariats pour amplifier ta portée ?",                     opts: ["Jamais", "J'y pense", "Quelques fois", "Régulièrement"] },
      { q: "Tu génères des leads ou des ventes grâce à ton contenu ?",                             opts: ["Jamais", "Rarement", "Parfois", "Régulièrement"] },
    ],
  },
  vente: {
    label: "Test de Vente",
    subtitle: "Mesure ton niveau en prospection, closing et gestion de ton tunnel de vente.",
    storageKey: "gm_test_vente_results",
    color: "#34D399",
    bg: "rgba(52,211,153,0.12)",
    questions: [
      { q: "Tu as un processus de vente défini (étapes claires de la prise de contact au closing) ?", opts: ["Non", "J'improvise", "En cours de définition", "Oui, structuré"] },
      { q: "Tu fais des appels ou des sessions de découverte avec tes prospects ?",                    opts: ["Jamais", "Rarement", "Régulièrement", "C'est ma priorité"] },
      { q: "Tu sais identifier et traiter les objections de tes prospects ?",                          opts: ["Pas du tout", "Difficilement", "Assez bien", "Très à l'aise"] },
      { q: "Tu as un tunnel de vente (page de capture, emails, offre) opérationnel ?",                opts: ["Non", "En construction", "Partiellement", "Oui, fonctionnel"] },
      { q: "Tu relances tes prospects qui n'ont pas encore décidé ?",                                  opts: ["Jamais", "Rarement", "Parfois", "Systématiquement"] },
      { q: "Tu connais ton taux de conversion (prospects → clients) ?",                               opts: ["Non", "Approximativement", "Oui", "Oui et je l'optimise"] },
      { q: "Tu utilises des témoignages ou preuves sociales dans ton processus de vente ?",           opts: ["Non", "1–2 témoignages", "Quelques-uns", "Beaucoup et variés"] },
      { q: "Tu as une offre clairement packagée avec un prix affiché ?",                              opts: ["Non", "Vague", "Définie", "Premium et optimisée"] },
      { q: "Tu fais des upsells ou cross-sells à tes clients existants ?",                            opts: ["Jamais", "Rarement", "Parfois", "Régulièrement"] },
      { q: "Tu génères des clients payants chaque mois de façon récurrente ?",                        opts: ["Non", "1–2 par mois", "3–5 par mois", "6 ou plus"] },
    ],
  },
  digital: {
    label: "Compétence Digital",
    subtitle: "Teste ta maîtrise des outils, de l'automatisation et de l'analyse digitale.",
    storageKey: "gm_test_digital_results",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.12)",
    questions: [
      { q: "Tu maîtrises les outils de création de contenu (Canva, CapCut, Figma...) ?",               opts: ["Non", "Basique", "Bien", "Expert"] },
      { q: "Tu as une liste email que tu utilises régulièrement pour communiquer ?",                    opts: ["Non", "Moins de 100 contacts", "100–500", "Plus de 500"] },
      { q: "Tu utilises un outil de CRM ou de gestion de prospects (Notion, HubSpot...) ?",            opts: ["Non", "J'y pense", "Oui, basique", "Oui, avancé"] },
      { q: "Tu as des automatisations en place (emails automatiques, Zapier, Make...) ?",              opts: ["Non", "Une ou deux", "Quelques-unes", "Système complet"] },
      { q: "Tu analyses tes données (Google Analytics, Meta Insights, LinkedIn Analytics...) ?",       opts: ["Jamais", "Rarement", "Régulièrement", "Chaque semaine"] },
      { q: "Tu optimises ton contenu ou ta présence pour le SEO ?",                                    opts: ["Non", "Vaguement", "Partiellement", "Stratégie SEO définie"] },
      { q: "Tu utilises des outils d'IA pour gagner du temps (ChatGPT, Midjourney...) ?",             opts: ["Non", "Parfois", "Régulièrement", "Intégré à mon workflow"] },
      { q: "Ton site ou landing page est optimisé pour la conversion ?",                               opts: ["Pas de site", "Site basique", "Optimisé partiellement", "Optimisé et testé"] },
      { q: "Tu as des publicités payantes actives (Meta Ads, Google Ads...) ?",                        opts: ["Non", "J'ai essayé", "Quelques campagnes", "Campagnes optimisées"] },
      { q: "Tu fais des A/B tests ou expérimentations pour améliorer tes résultats ?",                 opts: ["Jamais", "Rarement", "Parfois", "Régulièrement"] },
    ],
  },
};

const BADGE_CROWNS: Record<string, number> = {
  "Apprenti": 1, "En croissance": 2, "Confirmé": 3, "Expert": 4, "Elite": 5,
};

function Crowns({ badge, color }: { badge: string; color: string }) {
  const count = BADGE_CROWNS[badge] ?? 1;
  return (
    <span className="inline-flex items-center gap-px">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={10} height={10} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round">
          <path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 8-18 4z" />
        </svg>
      ))}
    </span>
  );
}

const BADGES = [
  { min: 0,  label: "Apprenti",      color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
  { min: 30, label: "En croissance", color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  { min: 50, label: "Confirmé",      color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  { min: 70, label: "Expert",        color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  { min: 88, label: "Elite",         color: "#F5C200", bg: "rgba(245,194,0,0.12)" },
];

function getBadge(score: number) {
  return [...BADGES].reverse().find((b) => score >= b.min) ?? BADGES[0];
}

type Phase = "intro" | "quiz" | "result" | "cooldown";

export default function TestSlugPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";

  const test = TESTS[slug];

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!test) return;
    setAnswers(Array(test.questions.length).fill(-1));
    try {
      const r = localStorage.getItem(test.storageKey);
      if (r) {
        const parsed = JSON.parse(r);
        if (parsed.length > 0) {
          const last = new Date(parsed[parsed.length - 1].date).getTime();
          const diff = Date.now() - last;
          const days7 = 7 * 24 * 60 * 60 * 1000;
          if (diff < days7) {
            setDaysLeft(Math.ceil((days7 - diff) / (24 * 60 * 60 * 1000)));
            setPhase("cooldown");
          }
        }
      }
    } catch {}
  }, [test]);

  // Keyboard Enter to advance
  useEffect(() => {
    if (phase !== "quiz") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Enter") handleNext(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!test) {
    return (
      <div className="max-w-xl space-y-4">
        <p className="text-white">Test introuvable.</p>
        <button onClick={() => router.push("/espace-membre/autres-tests")}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
          Retour aux tests
        </button>
      </div>
    );
  }

  const hasAnswered = answers[currentQ] !== -1;
  const progress = (currentQ / test.questions.length) * 100;

  const selectOption = (ai: number) => {
    const next = [...answers];
    next[currentQ] = ai;
    setAnswers(next);
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (currentQ < test.questions.length - 1) {
      setDirection(1);
      setCurrentQ((q) => q + 1);
    } else {
      const total = answers.reduce((acc, a) => acc + (a === -1 ? 0 : a), 0);
      const pct = Math.round((total / (test.questions.length * 3)) * 100);
      const badge = getBadge(pct);
      setScore(pct);
      try {
        const prev = JSON.parse(localStorage.getItem(test.storageKey) ?? "[]");
        prev.push({ date: new Date().toISOString(), score: pct, badge: badge.label });
        saveUserData(test.storageKey, prev);
        toast.success(`Test terminé ! Badge obtenu : ${badge.label}`);
      } catch {}
      setPhase("result");
    }
  };

  const handleBack = () => {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
    }
  };

  const badge = getBadge(score);

  // ── Cooldown ──────────────────────────────────────────────────────────────
  if (phase === "cooldown") return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.push("/espace-membre/autres-tests")}
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.4)" }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Autres tests
        </button>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
        <span className="text-sm font-semibold text-white">{test.label}</span>
      </div>

      <div className="rounded-2xl p-10 text-center"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl mx-auto mb-4"
          style={{ background: "rgba(96,165,250,0.1)" }}>
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-white mb-2">Test déjà passé cette semaine</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Reviens dans <span className="text-white font-semibold">{daysLeft} jour{daysLeft > 1 ? "s" : ""}</span> pour repasser ce test.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => router.push("/espace-membre/autres-tests")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            Voir les autres tests
          </button>
          <button
            onClick={() => setShowInfo(v => !v)}
            className="flex items-center justify-center h-10 w-10 rounded-xl transition-all"
            style={{
              background: showInfo ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.06)",
              color: showInfo ? "#93C5FD" : "rgba(255,255,255,0.4)",
              border: showInfo ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}
            aria-label="À quoi sert ce test ?">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(96,165,250,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-bold text-white">À quoi sert ce test ?</p>
            <button onClick={() => setShowInfo(false)} className="shrink-0 transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {test.subtitle} Ce test thématique te permet d&apos;évaluer ton niveau sur un aspect précis de ton activité afin de <strong className="text-white">t&apos;ajuster et progresser</strong> là où c&apos;est nécessaire.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.push("/espace-membre/autres-tests")}
          className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
          style={{ color: "rgba(255,255,255,0.4)" }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
          Autres tests
        </button>
        <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
        <span className="text-sm font-semibold text-white">{test.label}</span>
      </div>

      <AnimatePresence mode="wait">

        {/* ── INTRO ─────────────────────────────────────────────────────── */}
        {phase === "intro" && (
          <motion.div key="intro"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8">

            <div>
              <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ background: test.bg, color: test.color }}>
                Test thématique
              </span>
              <h1 className="text-3xl font-black text-white leading-tight">{test.label}</h1>
              <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>{test.subtitle}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: `${test.questions.length}`, label: "questions" },
                { val: "2 min", label: "pour finir" },
                { val: "5", label: "niveaux de badge" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-4 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase("quiz")}
                className="group flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-transform hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                Tester mon niveau
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
              <button
                onClick={() => setShowInfo(v => !v)}
                className="flex items-center justify-center h-14 w-14 rounded-2xl transition-all"
                style={{
                  background: showInfo ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.06)",
                  color: showInfo ? "#93C5FD" : "rgba(255,255,255,0.4)",
                  border: showInfo ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.08)",
                }}
                aria-label="À quoi sert ce test ?">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>
            </div>

            {showInfo && (
              <div className="rounded-2xl p-5 space-y-4"
                style={{ background: "rgba(96,165,250,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.2)" }}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-white">À quoi sert ce test ?</p>
                  <button onClick={() => setShowInfo(false)} className="shrink-0 transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Ce test te permet d&apos;évaluer ton niveau sur un aspect précis de ton activité — <strong className="text-white">{test.label.toLowerCase()}</strong> — afin d&apos;identifier tes forces et les points sur lesquels t&apos;ajuster concrètement.
                </p>
                <ul className="space-y-2.5">
                  {[
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, text: `${test.questions.length} questions ciblées sur ${test.label.toLowerCase()}.` },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, text: "Un score sur 100 pour mesurer où tu en es précisément." },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, text: "Utilise tes résultats pour prioriser tes actions et t'améliorer rapidement." },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span className="shrink-0 mt-0.5" style={{ color: test.color }}>{item.icon}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* ── QUIZ ──────────────────────────────────────────────────────── */}
        {phase === "quiz" && (
          <motion.div key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6">

            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Question {currentQ + 1} sur {test.questions.length}
                </span>
                <span className="text-sm font-semibold" style={{ color: "#93C5FD" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, #1A3FD8, ${test.color})` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQ}
                custom={direction}
                initial={{ opacity: 0, x: 48 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 * direction }}
                transition={{ duration: 0.3, ease: "easeInOut" }}>

                <div className="rounded-2xl p-7"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
                  <h2 className="text-lg font-bold text-white mb-6 leading-snug">
                    {test.questions[currentQ].q}
                  </h2>
                  <div className="space-y-3">
                    {test.questions[currentQ].opts.map((opt, ai) => (
                      <motion.button
                        key={opt}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectOption(ai)}
                        className="w-full rounded-xl px-5 py-4 text-left text-sm font-medium transition-all"
                        style={{
                          background: answers[currentQ] === ai ? "rgba(26,63,216,0.18)" : "rgba(255,255,255,0.03)",
                          border: answers[currentQ] === ai ? "1.5px solid rgba(96,165,250,0.5)" : "1px solid rgba(255,255,255,0.08)",
                          color: answers[currentQ] === ai ? "#93C5FD" : "rgba(255,255,255,0.75)",
                        }}>
                        <span className="mr-3 font-semibold" style={{ color: answers[currentQ] === ai ? "#60A5FA" : "rgba(255,255,255,0.25)" }}>
                          {String.fromCharCode(65 + ai)}.
                        </span>
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="mt-5 flex items-center justify-between gap-3">
                  <button onClick={handleBack}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)" }}>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Retour
                  </button>
                  <motion.button
                    onClick={handleNext}
                    disabled={!hasAnswered}
                    whileTap={hasAnswered ? { scale: 0.97 } : {}}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all"
                    style={{
                      background: hasAnswered ? "linear-gradient(135deg, #1A3FD8, #3B82F6)" : "rgba(255,255,255,0.06)",
                      color: hasAnswered ? "#fff" : "rgba(255,255,255,0.2)",
                      cursor: hasAnswered ? "pointer" : "not-allowed",
                    }}>
                    {currentQ === test.questions.length - 1 ? "Voir mon résultat" : "Question suivante"}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── RESULT ────────────────────────────────────────────────────── */}
        {phase === "result" && (
          <motion.div key="result"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5">

            <h1 className="text-xl font-bold text-white">Résultat — {test.label}</h1>

            <div className="rounded-2xl p-8 text-center space-y-5"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: `1px solid ${badge.color}30` }}>
              <div className="text-5xl font-black" style={{ color: badge.color }}>
                {score}<span className="text-2xl font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>/100</span>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-bold"
                style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}40` }}>
                {badge.label}
                <Crowns badge={badge.label} color={badge.color} />
              </span>
              <div className="h-2.5 rounded-full overflow-hidden mx-4" style={{ background: "rgba(255,255,255,0.07)" }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  style={{ background: `linear-gradient(90deg, #1A3FD8, ${test.color})` }}
                />
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Badge <strong style={{ color: badge.color }}>{badge.label}</strong> enregistré pour le test <strong className="text-white">{test.label}</strong>.
              </p>
              <div className="flex gap-3 justify-center pt-2 flex-wrap">
                <button onClick={() => router.push("/espace-membre/autres-tests")}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                  Voir les autres tests
                </button>
                <button onClick={() => router.push("/espace-membre")}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
                  style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
                  Tableau de bord
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
