"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type DiagResult = { date: string; score: number; badge: string };

const BADGE_CROWNS: Record<string, number> = {
  "Apprenti": 1, "En croissance": 2, "Confirmé": 3, "Expert": 4, "Elite": 5,
};

function Crowns({ badge, color }: { badge: string; color: string }) {
  const count = BADGE_CROWNS[badge] ?? 1;
  return (
    <span className="inline-flex items-center gap-px">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width={9} height={9} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round">
          <path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 8-18 4z" />
        </svg>
      ))}
    </span>
  );
}

const BADGE_CONFIG: Record<string, { color: string; bg: string }> = {
  "Apprenti":      { color: "#94A3B8", bg: "rgba(148,163,184,0.12)" },
  "En croissance": { color: "#34D399", bg: "rgba(52,211,153,0.12)" },
  "Confirmé":      { color: "#60A5FA", bg: "rgba(96,165,250,0.12)" },
  "Expert":        { color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
  "Elite":         { color: "#F5C200", bg: "rgba(245,194,0,0.12)" },
};

const quickLinks = [
  { label: "Diagnostic Hebdomadaire", href: "/espace-membre/diagnostic",  color: "#34D399", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  { label: "Discuter avec Izzy", href: "/espace-membre/izzy",        color: "#A78BFA", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> },
  { label: "Mes favoris",        href: "/espace-membre/favoris",     color: "#60A5FA", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg> },
  { label: "Programme Mentee",   href: "/espace-membre/mentee",      color: "#F5C200", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg> },
];

type StepStatus = { diagDone: boolean; contentuDone: boolean; venteDone: boolean; digitalDone: boolean; ressourcesDone: boolean; contentusDone: boolean; communauteDone: boolean };

const STEPS = [
  {
    id: "diagnostic",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    title: "Lance ton diagnostic de niveau",
    desc: "Découvre où tu en es et obtiens ton premier badge personnalisé.",
    cta: "Faire le diagnostic",
    href: "/espace-membre/diagnostic",
    color: "#34D399",
    done: (s: StepStatus) => s.diagDone,
  },
  {
    id: "contenu",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>,
    title: "Passe le test Stratégies de contenu",
    desc: "Évalue tes compétences en création et distribution de contenu.",
    cta: "Passer le test",
    href: "/espace-membre/autres-tests/contenu",
    color: "#60A5FA",
    done: (s: StepStatus) => s.contentuDone,
  },
  {
    id: "vente",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>,
    title: "Passe le test de Vente",
    desc: "Mesure ta maîtrise des techniques de vente et de conversion.",
    cta: "Passer le test",
    href: "/espace-membre/autres-tests/vente",
    color: "#F97316",
    done: (s: StepStatus) => s.venteDone,
  },
  {
    id: "digital",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" /></svg>,
    title: "Passe le test de Compétences Digital",
    desc: "Évalue ton niveau sur les outils et stratégies digitales.",
    cta: "Passer le test",
    href: "/espace-membre/autres-tests/digital",
    color: "#A78BFA",
    done: (s: StepStatus) => s.digitalDone,
  },
  {
    id: "ressources",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>,
    title: "Parcours les ressources gratuites",
    desc: "Formations, outils et guides sélectionnés pour accélérer ta croissance.",
    cta: "Voir les ressources",
    href: "/ressources",
    color: "#F5C200",
    done: (s: StepStatus) => s.ressourcesDone,
  },
  {
    id: "contenus",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>,
    title: "Explore la section Contenus",
    desc: "Articles et stratégies pour booster ton marketing de contenu.",
    cta: "Explorer les contenus",
    href: "/contenus",
    color: "#FB7185",
    done: (s: StepStatus) => s.contentusDone,
  },
  {
    id: "communaute",
    icon: <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" /></svg>,
    title: "Rejoins la communauté",
    desc: "Des centaines d'entrepreneurs digitaux qui s'entraident au quotidien.",
    cta: "Rejoindre la communauté",
    href: "/communaute",
    color: "#22C55E",
    done: (s: StepStatus) => s.communauteDone,
  },
];

export default function EspaceMembreDashboard() {
  const { data: authSession } = useSession();
  const [results, setResults] = useState<DiagResult[]>([]);
  const [canTest, setCanTest] = useState(true);
  const [stepStatus, setStepStatus] = useState<StepStatus>({
    diagDone: false, contentuDone: false, venteDone: false, digitalDone: false,
    ressourcesDone: false, contentusDone: false, communauteDone: false,
  });

  useEffect(() => {
    try {
      const r = localStorage.getItem("gm_diag_results");
      const diagResults: DiagResult[] = r ? JSON.parse(r) : [];
      setResults(diagResults);
      if (diagResults.length > 0) {
        const last = new Date(diagResults[diagResults.length - 1].date).getTime();
        setCanTest(Date.now() - last > 7 * 24 * 60 * 60 * 1000);
      }
      setStepStatus({
        diagDone: diagResults.length > 0,
        contentuDone: JSON.parse(localStorage.getItem("gm_test_contenu_results") || "[]").length > 0,
        venteDone: JSON.parse(localStorage.getItem("gm_test_vente_results") || "[]").length > 0,
        digitalDone: JSON.parse(localStorage.getItem("gm_test_digital_results") || "[]").length > 0,
        ressourcesDone: !!localStorage.getItem("gm_visited_ressources"),
        contentusDone: !!localStorage.getItem("gm_visited_contenus"),
        communauteDone: !!localStorage.getItem("gm_visited_communaute"),
      });
    } catch {}
  }, []);

  const lastResult = results[results.length - 1];
  const badge = lastResult?.badge ?? "Apprenti";
  const badgeStyle = BADGE_CONFIG[badge] ?? BADGE_CONFIG["Apprenti"];
  const firstName = authSession?.user?.name?.split(" ")[0] ?? "Membre";

  const completedCount = STEPS.filter(s => s.done(stepStatus)).length;
  const nextStep = STEPS.find(s => !s.done(stepStatus));

  const hour = new Date().getHours();
  const timeGreeting =
    hour >= 6 && hour < 15 ? "Bien démarré la journée ?" : "Belle fin de journée ?";

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Welcome banner */}
      <div>
        <h1 className="text-3xl font-black text-white leading-tight">
          Bienvenue, {firstName}.
        </h1>
        <p className="text-lg mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
          {timeGreeting}
        </p>
      </div>

      {/* Header profil */}
      <div className="flex items-center gap-5 rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-black text-white"
          style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
          {firstName[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold text-white">Bonjour, {firstName}</p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{authSession?.user?.email}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold"
            style={{ background: badgeStyle.bg, color: badgeStyle.color, border: `1px solid ${badgeStyle.color}40` }}>
            {badge}
            <Crowns badge={badge} color={badgeStyle.color} />
          </span>
          {lastResult && (
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              Dernier test : {lastResult.score}/100
            </span>
          )}
        </div>
      </div>

      {/* Prochaine étape recommandée */}
      {nextStep ? (
        <div className="rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${nextStep.color}12, ${nextStep.color}06)`, border: `1px solid ${nextStep.color}30`, backdropFilter: "blur(16px)" }}>
          <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${nextStep.color}18`, color: nextStep.color }}>
            {nextStep.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: nextStep.color }}>
              Prochaine étape recommandée
            </p>
            <p className="text-base font-bold text-white">{nextStep.title}</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{nextStep.desc}</p>
            {/* Progress bar */}
            <div className="mt-3 flex items-center gap-3">
              <div className="flex gap-1">
                {STEPS.map((s) => (
                  <div key={s.id} className="h-1.5 w-4 rounded-full transition-all"
                    style={{ background: s.done(stepStatus) ? nextStep.color : "rgba(255,255,255,0.12)" }} />
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {completedCount}/{STEPS.length} étapes
              </span>
            </div>
          </div>
          <Link href={nextStep.href}
            onClick={() => {
              if (nextStep.id === "ressources") localStorage.setItem("gm_visited_ressources", "1");
              if (nextStep.id === "contenus") localStorage.setItem("gm_visited_contenus", "1");
              if (nextStep.id === "communaute") localStorage.setItem("gm_visited_communaute", "1");
            }}
            className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:brightness-110"
            style={{ background: nextStep.id === "diagnostic" ? "#1A3FD8" : nextStep.color }}>
            {nextStep.cta} →
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(245,194,0,0.08)", border: "1px solid rgba(245,194,0,0.25)", backdropFilter: "blur(16px)" }}>
          <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: "rgba(245,194,0,0.15)", color: "#F5C200" }}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg>
          </div>
          <div>
            <p className="text-base font-bold text-white">Félicitations, {firstName} !</p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
              Tu as complété toutes les étapes. Postule au programme Mentee pour aller encore plus loin.
            </p>
          </div>
          <Link href="/espace-membre/mentee"
            className="shrink-0 ml-auto rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #F5C200, #F97316)" }}>
            Programme Mentee →
          </Link>
        </div>
      )}

      {/* Accès rapides */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Accès rapides</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="rounded-2xl p-4 flex flex-col gap-3 transition-all hover:scale-[1.02]"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: `1px solid ${l.color}25` }}>
              <span style={{ color: "#F5C200" }}>{l.icon}</span>
              <span className="text-sm font-semibold" style={{ color: l.color }}>{l.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Statut diagnostic + progression */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Diagnostic */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Mon diagnostic</p>
          {lastResult ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>Score actuel</span>
                <span className="font-bold text-white">{lastResult.score}/100</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${lastResult.score}%`, background: "linear-gradient(90deg, #1A3FD8, #34D399)" }} />
              </div>
              <p className="flex items-center gap-1 text-xs" style={{ color: canTest ? "#34D399" : "rgba(255,255,255,0.35)" }}>
                {canTest && <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>}
                {canTest ? "Nouveau test disponible" : "Prochain test dans quelques jours"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>Aucun test encore passé.</p>
              <Link href="/espace-membre/diagnostic"
                className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                Passer mon premier test →
              </Link>
            </div>
          )}
        </div>

        {/* Progression */}
        <div className="rounded-2xl p-5"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>Ma progression</p>
          {results.length >= 2 ? (
            <div className="space-y-2">
              {results.slice(-3).reverse().map((r, i) => {
                const prev = results[results.length - 2 - i];
                const delta = prev ? r.score - prev.score : 0;
                return (
                  <div key={r.date} className="flex items-center justify-between text-sm">
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>{new Date(r.date).toLocaleDateString("fr-FR")}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{r.score}/100</span>
                      {delta !== 0 && (
                        <span className="text-xs font-bold" style={{ color: delta > 0 ? "#34D399" : "#F87171" }}>
                          {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              Passe au moins 2 tests pour voir ta progression.
            </p>
          )}
          <Link href="/espace-membre/progression"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "#93C5FD" }}>
            Voir tout →
          </Link>
        </div>

      </div>
    </div>
  );
}
