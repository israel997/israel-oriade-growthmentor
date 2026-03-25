"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DiagResult = { date: string; score: number; badge: string };

function Crown({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1.2} strokeLinejoin="round">
      <path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 8-18 4z" />
    </svg>
  );
}

const BADGES = [
  {
    label: "Apprenti",
    crowns: 1,
    range: [0, 29],
    color: "#94A3B8",
    bg: "rgba(148,163,184,0.08)",
    border: "rgba(148,163,184,0.2)",
    description: "Tu démarres ton parcours. Ton activité n'est pas encore structurée mais tu as pris conscience de l'importance de progresser.",
    traits: ["Pas encore d'offre définie", "Peu ou pas de contenu publié", "Aucun système de vente en place"],
    advice: "Commence par définir une offre claire et un positionnement précis avant de passer à la prochaine étape.",
  },
  {
    label: "En croissance",
    crowns: 2,
    range: [30, 49],
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    description: "Tu as posé les premières bases. Tu publies du contenu et tu commences à construire ton audience, mais ton système de vente reste fragile.",
    traits: ["Offre en cours de définition", "Contenu publié irrégulièrement", "Premiers contacts clients"],
    advice: "Mets en place un tunnel de conversion simple et commence à collecter des témoignages.",
  },
  {
    label: "Confirmé",
    crowns: 3,
    range: [50, 69],
    color: "#60A5FA",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.2)",
    description: "Ton activité tourne. Tu as une offre claire, tu publies régulièrement et tu génères des ventes. Il te manque encore de la régularité et de l'optimisation.",
    traits: ["Offre définie et prix fixé", "Publication régulière (1-2x/semaine)", "Premières ventes récurrentes"],
    advice: "Travaille ton positionnement différenciant et automatise une partie de ton tunnel de vente.",
  },
  {
    label: "Expert",
    crowns: 4,
    range: [70, 87],
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    description: "Tu maîtrises les fondamentaux. Ton business tourne bien, tu as une audience engagée et un système de vente qui fonctionne en continu.",
    traits: ["Système de vente opérationnel", "Audience de plus de 500 personnes", "Analyse régulière des chiffres"],
    advice: "Scale ton activité : délègue, automatise davantage et travaille ta notoriété à plus grande échelle.",
  },
  {
    label: "Elite",
    crowns: 5,
    range: [88, 100],
    color: "#F5C200",
    bg: "rgba(245,194,0,0.08)",
    border: "rgba(245,194,0,0.2)",
    description: "Tu es au sommet. Ton activité digitale est un moteur bien huilé — offre premium, audience large, système de vente optimisé et des chiffres qui parlent d'eux-mêmes.",
    traits: ["6+ clients payants par mois", "Publication 3x/semaine ou plus", "Investissement continu en formation"],
    advice: "Tu peux envisager de former les autres, créer un programme de groupe ou développer une marque forte.",
  },
];

export default function BadgesPage() {
  const [results, setResults] = useState<DiagResult[]>([]);

  useEffect(() => {
    fetch("/api/user/results")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data && data.length > 0) {
          const diag = data
            .filter((d: { type: string; date: string; score: number; badge: string }) => d.type === "diagnostic")
            .map((d: { date: string; score: number; badge: string }) => ({ date: d.date, score: d.score, badge: d.badge }));
          if (diag.length > 0) { setResults(diag); return; }
        }
        try {
          const r = localStorage.getItem("gm_diag_results");
          if (r) setResults(JSON.parse(r));
        } catch {}
      })
      .catch(() => {
        try {
          const r = localStorage.getItem("gm_diag_results");
          if (r) setResults(JSON.parse(r));
        } catch {}
      });
  }, []);

  const currentBadge = results.length > 0 ? results[results.length - 1].badge : null;
  const currentScore = results.length > 0 ? results[results.length - 1].score : null;

  return (
    <div className="max-w-2xl space-y-8">

      <div>
        <h1 className="text-xl font-bold text-white">Mes Badges</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          5 niveaux de maîtrise — de l'apprenti à l'élite. Chaque badge correspond à un score obtenu lors du test de progression.
        </p>
      </div>

      {/* Score actuel */}
      {currentBadge && currentScore !== null && (
        <div className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
          <div className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-base font-black"
            style={{ background: (BADGES.find(b => b.label === currentBadge)?.bg ?? "rgba(255,255,255,0.08)"), color: BADGES.find(b => b.label === currentBadge)?.color ?? "white" }}>
            {currentScore}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Ton badge actuel</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Score de <strong className="text-white">{currentScore}/100</strong> — niveau{" "}
              <strong style={{ color: BADGES.find(b => b.label === currentBadge)?.color }}>{currentBadge}</strong>
            </p>
          </div>
          <Link href="/espace-membre/diagnostic"
            className="ml-auto shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            Nouveau test
          </Link>
        </div>
      )}

      {/* Score range bar */}
      <div className="rounded-2xl p-5 space-y-3"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Échelle des scores</p>
        <div className="relative h-3 rounded-full overflow-hidden flex">
          {BADGES.map((b, i) => (
            <div key={b.label} className="h-full flex-1 relative" style={{ background: b.color + "55" }}>
              {i < BADGES.length - 1 && (
                <div className="absolute right-0 top-0 h-full w-px" style={{ background: "rgba(0,0,0,0.3)" }} />
              )}
            </div>
          ))}
          {/* Current score cursor */}
          {currentScore !== null && (
            <div className="absolute top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-white shadow-lg"
              style={{ left: `${currentScore}%`, transition: "left 0.4s ease" }} />
          )}
        </div>
        <div className="flex justify-between">
          {BADGES.map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-0.5" style={{ flex: 1 }}>
              <span className="text-xs font-semibold" style={{ color: b.color }}>{b.range[0]}</span>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{b.label}</span>
              <span className="flex items-center gap-px mt-0.5">
                {Array.from({ length: b.crowns }).map((_, i) => (
                  <Crown key={i} color={b.color} size={9} />
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge cards */}
      <div className="space-y-4">
        {BADGES.map((b) => {
          const isOwned = currentBadge === b.label;
          const isPassed = currentScore !== null && currentScore > b.range[1];
          return (
            <div key={b.label} className="rounded-2xl overflow-hidden transition-all"
              style={{
                background: isOwned ? b.bg : "rgba(255,255,255,0.03)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${isOwned ? b.border : "rgba(96,165,250,0.1)"}`,
                opacity: isPassed && !isOwned ? 0.65 : 1,
              }}>

              {/* Header */}
              <div className="flex items-center gap-4 px-6 pt-5 pb-4">
                {/* Score range badge */}
                <div className="shrink-0 rounded-xl px-3 py-1.5 text-center min-w-[64px]"
                  style={{ background: b.color + "15", border: `1px solid ${b.color}30` }}>
                  <p className="text-xs font-black" style={{ color: b.color }}>{b.range[0]}–{b.range[1]}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>/100</p>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold" style={{ color: b.color }}>{b.label}</span>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: b.crowns }).map((_, i) => (
                        <Crown key={i} color={b.color} size={13} />
                      ))}
                    </span>
                    {isOwned && (
                      <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                        style={{ background: b.color + "20", color: b.color }}>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                        Ton niveau
                      </span>
                    )}
                    {isPassed && !isOwned && (
                      <span className="rounded-full px-2 py-0.5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Dépassé
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>{b.description}</p>
                </div>
              </div>

              {/* Traits + conseil */}
              <div className="px-6 pb-5 space-y-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="pt-4 grid grid-cols-1 gap-1.5">
                  {b.traits.map((t) => (
                    <div key={t} className="flex items-start gap-2">
                      <svg className="h-4 w-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke={b.color} strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                      <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Conseil</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{b.advice}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!currentBadge && (
        <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-5"
          style={{ background: "rgba(245,194,0,0.04)", border: "1px dashed rgba(245,194,0,0.2)" }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "rgba(245,194,0,0.1)" }}>
            <svg className="h-8 w-8" viewBox="0 0 24 24" fill="#F5C200" stroke="#F5C200" strokeWidth={1} strokeLinejoin="round">
              <path d="M2 19h20v2H2zM2 17l4-10 6 6 4-8 4 8-18 4z" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-white mb-1">Ton badge t&apos;attend</p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Passe le diagnostic pour obtenir ton niveau — de l&apos;Apprenti à l&apos;Élite.<br />
              Le test prend 1 minute et te donne un score sur 100.
            </p>
          </div>
          <Link href="/espace-membre/diagnostic"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            Passer mon premier test
          </Link>
        </div>
      )}

    </div>
  );
}
