"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { saveUserData } from "@/lib/sync-user-data";
import { saveResult } from "@/lib/saveResult";
import { toast } from "sonner";
import { matchScenarios } from "@/lib/match-scenarios";
import { BadgeLabel } from "@/lib/diagnostic-scenarios";
import DiagnosticRecommendations from "@/components/member/DiagnosticRecommendations";

const QUESTIONS = [
  { q: "Tu as une offre clairement définie avec un prix et une cible précise ?",        opts: ["Pas encore", "En cours", "Oui mais à affiner", "Oui, clairement définie"] },
  { q: "Tu publies du contenu de manière régulière sur au moins 1 plateforme ?",         opts: ["Jamais", "Rarement", "1-2x/semaine", "3x/semaine ou plus"] },
  { q: "Tu as un tunnel ou un système pour convertir tes prospects ?",                   opts: ["Non", "J'ai une idée mais rien de concret", "En construction", "Oui, opérationnel"] },
  { q: "Tu fais des appels de vente ou de découverte régulièrement ?",                   opts: ["Jamais", "Parfois", "1-2x/semaine", "Chaque jour"] },
  { q: "Tu as des témoignages ou des preuves sociales clients ?",                        opts: ["Aucun", "1-2", "3-5", "6 et plus"] },
  { q: "Tu analyses tes chiffres (CA, conversions, taux d'ouverture...) ?",              opts: ["Jamais", "Rarement", "Mensuellement", "Chaque semaine"] },
  { q: "Ton positionnement te différencie clairement de la concurrence ?",               opts: ["Pas du tout", "Légèrement", "Assez bien", "Très clairement"] },
  { q: "Tu as une liste email ou une audience que tu peux contacter directement ?",      opts: ["Non", "Moins de 100", "100-500", "Plus de 500"] },
  { q: "Tu investis en toi (formations, coaching, outils) pour progresser ?",           opts: ["Jamais", "Rarement", "Régulièrement", "C'est une priorité"] },
  { q: "Tu as généré des ventes ou des clients payants ce mois-ci ?",                   opts: ["Non", "1-2", "3-5", "6 et plus"] },
];

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

type Phase = "intro" | "quiz" | "result";

export default function DiagnosticPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [cooldown, setCooldown] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [hasWip, setHasWip] = useState(false);
  const [wipData, setWipData] = useState<{ currentQ: number; answers: number[] } | null>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("gm_diag_results");
      if (r) {
        const parsed = JSON.parse(r);
        if (parsed.length > 0) {
          const last = new Date(parsed[parsed.length - 1].date).getTime();
          const diff = Date.now() - last;
          const days7 = 7 * 24 * 60 * 60 * 1000;
          if (diff < days7) {
            setCooldown(true);
            setDaysLeft(Math.ceil((days7 - diff) / (24 * 60 * 60 * 1000)));
            return;
          }
        }
      }
      // Restore in-progress quiz
      const wip = localStorage.getItem("gm_diag_wip");
      if (wip) {
        const parsed = JSON.parse(wip);
        if (parsed && (parsed.currentQ > 0 || parsed.answers?.some((a: number) => a !== -1))) {
          setWipData(parsed);
          setHasWip(true);
        }
      }
    } catch {}
  }, []);

  // Keyboard Enter to go next
  useEffect(() => {
    if (phase !== "quiz") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Enter") handleNext(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const hasAnswered = answers[currentQ] !== -1;
  const progress = (currentQ / QUESTIONS.length) * 100;

  const selectOption = (ai: number) => {
    const next = [...answers];
    next[currentQ] = ai;
    setAnswers(next);
    try {
      localStorage.setItem("gm_diag_wip", JSON.stringify({ currentQ, answers: next }));
    } catch {}
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (currentQ < QUESTIONS.length - 1) {
      setDirection(1);
      const nextQ = currentQ + 1;
      setCurrentQ(nextQ);
      try {
        localStorage.setItem("gm_diag_wip", JSON.stringify({ currentQ: nextQ, answers }));
      } catch {}
    } else {
      const total = answers.reduce((acc, a) => acc + (a === -1 ? 0 : a), 0);
      const pct = Math.round((total / (QUESTIONS.length * 3)) * 100);
      const badge = getBadge(pct);
      setScore(pct);
      try {
        localStorage.removeItem("gm_diag_wip");
        const date = new Date().toISOString();
        const prev = JSON.parse(localStorage.getItem("gm_diag_results") ?? "[]");
        prev.push({ date, score: pct, badge: badge.label });
        saveUserData("gm_diag_results", prev);
        saveResult("diagnostic", pct, badge.label);
        toast.success(`Diagnostic terminé ! Badge obtenu : ${badge.label}`);
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
  const matchedScenarios = useMemo(
    () => phase === "result" ? matchScenarios(badge.label as BadgeLabel, answers) : [],
    [phase, badge.label, answers]
  );

  // ── Cooldown screen ─────────────────────────────────────────────────────
  if (cooldown) return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-bold text-white">Mon Diagnostic</h1>

      <div className="rounded-2xl p-10 text-center"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl mx-auto mb-4" style={{ background: "rgba(96,165,250,0.1)" }}>
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
        </div>
        <p className="text-base font-semibold text-white mb-2">Test déjà passé cette semaine</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          Reviens dans <span className="text-white font-semibold">{daysLeft} jour{daysLeft > 1 ? "s" : ""}</span> pour ton prochain test.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => router.push("/espace-membre/progression")}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            Voir ma progression
          </button>
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="flex items-center justify-center h-10 w-10 rounded-xl transition-all"
            style={{
              background: showInfo ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.06)",
              color: showInfo ? "#93C5FD" : "rgba(255,255,255,0.4)",
              border: showInfo ? "1px solid rgba(96,165,250,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}
            title="À quoi sert ce test ?">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(96,165,250,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <div className="flex items-start gap-3">
            <div className="shrink-0 h-8 w-8 rounded-xl flex items-center justify-center mt-0.5"
              style={{ background: "rgba(96,165,250,0.12)" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">Le diagnostic principal</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Ce test mesure ta <strong className="text-white">progression business globale</strong> — offre, contenu, ventes, audience, positionnement. Il te donne un score sur 100 et un badge qui reflète ton niveau général.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="shrink-0 h-8 w-8 rounded-xl flex items-center justify-center mt-0.5"
              style={{ background: "rgba(167,139,250,0.12)" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#A78BFA" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-white mb-1">Tu veux te tester sur un sujet précis ?</p>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Consulte la section <strong className="text-white">Autres Tests</strong> — tests thématiques indépendants sur le contenu, la vente et les compétences digitales. Chacun a son propre badge et cooldown.
              </p>
              <button onClick={() => router.push("/espace-membre/autres-tests")}
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: "#A78BFA" }}>
                Voir les autres tests
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Retour
      </button>
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
                style={{ background: "rgba(96,165,250,0.12)", color: "#93C5FD" }}>
                Test de progression
              </span>
              <h1 className="text-3xl font-black text-white leading-tight">
                Mesure ton évolution
              </h1>
              <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.5)" }}>
                10 questions pour évaluer honnêtement où tu en es dans ton activité digitale.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: "10", label: "questions" },
                { val: "1 min", label: "pour finir" },
                { val: "5", label: "niveaux de badge" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center"
                  style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
                  <p className="text-xl font-black text-white">{s.val}</p>
                  <p className="text-[10px] mt-0.5 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {hasWip && wipData && (
              <div className="rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{ background: "rgba(245,194,0,0.07)", border: "1px solid rgba(245,194,0,0.2)" }}>
                <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#F5C200" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Test en cours — question {wipData.currentQ + 1}/{QUESTIONS.length}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Tu peux reprendre où tu t&apos;étais arrêté.</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentQ(wipData.currentQ);
                    setAnswers(wipData.answers);
                    setPhase("quiz");
                  }}
                  className="shrink-0 rounded-xl px-4 py-2 text-sm font-bold transition-transform hover:scale-[1.02]"
                  style={{ background: "rgba(245,194,0,0.15)", color: "#F5C200", border: "1px solid rgba(245,194,0,0.3)" }}>
                  Reprendre →
                </button>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  try { localStorage.removeItem("gm_diag_wip"); } catch {}
                  setAnswers(Array(QUESTIONS.length).fill(-1));
                  setCurrentQ(0);
                  setHasWip(false);
                  setPhase("quiz");
                }}
                className="group flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition-transform hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                {hasWip ? "Recommencer à zéro" : "Tester mon évolution"}
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
                  <p className="text-sm font-bold text-white">À quoi sert le diagnostic principal ?</p>
                  <button onClick={() => setShowInfo(false)} className="shrink-0 transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Ce test est conçu pour t&apos;aider à <strong className="text-white">évaluer ton niveau business global</strong> sur les aspects clés de ton activité digitale — offre, contenu, ventes, audience, positionnement — afin que tu puisses identifier tes forces et les axes sur lesquels t&apos;ajuster.
                </p>
                <ul className="space-y-2.5">
                  {[
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>, text: "10 questions couvrant toutes les dimensions de ton business." },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>, text: "Un score sur 100 et un badge qui reflète ton niveau réel." },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>, text: "Repasse-le chaque semaine pour mesurer ta progression dans le temps." },
                    { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, text: "Utilise tes résultats pour ajuster ta stratégie et prioriser tes efforts." },
                  ].map((item) => (
                    <li key={item.text} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span className="shrink-0 mt-0.5" style={{ color: "#93C5FD" }}>{item.icon}</span>
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
                  Question {currentQ + 1} sur {QUESTIONS.length}
                </span>
                <span className="text-sm font-semibold" style={{ color: "#93C5FD" }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #1A3FD8, #3B82F6)" }}
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
                    {QUESTIONS[currentQ].q}
                  </h2>
                  <div className="space-y-3">
                    {QUESTIONS[currentQ].opts.map((opt, ai) => (
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
                    {currentQ === QUESTIONS.length - 1 ? "Voir mon résultat" : "Question suivante"}
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

            <h1 className="text-xl font-bold text-white">Résultat</h1>

            {/* Score card */}
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
                  style={{ background: `linear-gradient(90deg, #1A3FD8, ${badge.color})` }}
                />
              </div>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Badge <strong style={{ color: badge.color }}>{badge.label}</strong> enregistré sur ton profil.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button onClick={() => router.push("/espace-membre/progression")}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                  Voir ma progression
                </button>
                <button onClick={() => router.push("/espace-membre")}
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap"
                  style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
                  Tableau de bord
                </button>
              </div>
            </div>

            {/* Recommandations contextuelles */}
            <DiagnosticRecommendations matched={matchedScenarios} />

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
