"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TESTS_CONFIG } from "@/lib/tests-config";

const TESTS = TESTS_CONFIG;

const BADGES = [
  { min: 0,  label: "Apprenti",      color: "#94A3B8" },
  { min: 30, label: "En croissance", color: "#34D399" },
  { min: 50, label: "Confirmé",      color: "#60A5FA" },
  { min: 70, label: "Expert",        color: "#A78BFA" },
  { min: 88, label: "Elite",         color: "#F5C200" },
];

function getBadgeColor(badge: string) {
  return BADGES.find((b) => b.label === badge)?.color ?? "#94A3B8";
}

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

type TestResult = { date: string; score: number; badge: string };

export default function AutresTestsPage() {
  const [results, setResults] = useState<Record<string, TestResult[]>>({});

  useEffect(() => {
    const loaded: Record<string, TestResult[]> = {};
    for (const t of TESTS) {
      try {
        const r = localStorage.getItem(t.storageKey);
        loaded[t.slug] = r ? JSON.parse(r) : [];
      } catch {
        loaded[t.slug] = [];
      }
    }
    setResults(loaded);
  }, []);

  const canTest = (slug: string) => {
    const list = results[slug] ?? [];
    if (list.length === 0) return true;
    const last = new Date(list[list.length - 1].date).getTime();
    return Date.now() - last > 7 * 24 * 60 * 60 * 1000;
  };

  const daysLeft = (slug: string) => {
    const list = results[slug] ?? [];
    if (list.length === 0) return 0;
    const last = new Date(list[list.length - 1].date).getTime();
    const diff = 7 * 24 * 60 * 60 * 1000 - (Date.now() - last);
    return Math.max(1, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Tests Business</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          {TESTS.length} test{TESTS.length > 1 ? "s" : ""} thématique{TESTS.length > 1 ? "s" : ""} indépendant{TESTS.length > 1 ? "s" : ""} — chacun avec son propre système de badges, renouvelable chaque semaine.
        </p>
      </div>

      {/* Diagnostic hebdomadaire */}
      <Link href="/espace-membre/diagnostic"
        className="flex items-center gap-4 rounded-2xl px-6 py-5 transition-opacity hover:opacity-90"
        style={{ background: "linear-gradient(135deg, rgba(5,150,105,0.18) 0%, rgba(52,211,153,0.12) 100%)", border: "1px solid rgba(52,211,153,0.25)" }}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" style={{ background: "rgba(52,211,153,0.15)" }}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-white">Diagnostic Hebdomadaire</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>Évalue ton niveau business global — offre, contenu, ventes, audience, positionnement.</p>
        </div>
        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </Link>

      <div className="space-y-4">
        {TESTS.map((t) => {
          const list = results[t.slug] ?? [];
          const last = list[list.length - 1];
          const available = canTest(t.slug);
          const days = daysLeft(t.slug);

          return (
            <div key={t.slug} className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: `1px solid ${available ? t.border : "rgba(96,165,250,0.1)"}` }}>

              <div className="flex items-start gap-5 px-6 pt-6 pb-5">
                {/* Icon */}
                <div className="shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{ background: t.bg, color: t.color }}>
                  {t.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="text-base font-bold text-white">{t.label}</p>
                      <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{t.description}</p>
                    </div>

                    {last && (() => {
                      const bc = getBadgeColor(last.badge);
                      return (
                        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                          style={{ background: bc + "20", color: bc, border: `1px solid ${bc}40` }}>
                          {last.badge}
                          <Crowns badge={last.badge} color={bc} />
                        </span>
                      );
                    })()}
                  </div>

                  {/* Last score */}
                  {last && (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        <span>Dernier score</span>
                        <span className="font-semibold text-white">{last.score}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${last.score}%`, background: `linear-gradient(90deg, #1A3FD8, ${t.color})` }} />
                      </div>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {new Date(last.date).toLocaleDateString("fr-FR")} · {list.length} test{list.length > 1 ? "s" : ""} passé{list.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 flex items-center justify-between gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                {available ? (
                  <p className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#34D399" }}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                    {last ? "Nouveau test disponible" : "Test disponible"}
                  </p>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    Disponible dans {days} jour{days > 1 ? "s" : ""}
                  </p>
                )}

                <Link href={`/espace-membre/autres-tests/${t.slug}`}
                  className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  style={available
                    ? { background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }
                    : { background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }
                  }>
                  {available ? (last ? "Repasser le test" : "Passer le test") : "Voir mes résultats"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
