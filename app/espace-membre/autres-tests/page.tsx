"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TESTS = [
  {
    slug: "contenu",
    label: "Stratégies de Contenu",
    description: "Évalue ta maîtrise de la création, planification et distribution de contenu pour développer ton audience.",
    storageKey: "gm_test_contenu_results",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    slug: "vente",
    label: "Test de Vente",
    description: "Mesure ton niveau en prospection, closing, gestion des objections et construction de ton tunnel de vente.",
    storageKey: "gm_test_vente_results",
    color: "#34D399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
  },
  {
    slug: "digital",
    label: "Compétence Digital",
    description: "Teste ta maîtrise des outils, de l'automatisation, du SEO, de l'email marketing et de l'analyse de données.",
    storageKey: "gm_test_digital_results",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3" />
      </svg>
    ),
  },
];

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
          3 tests thématiques indépendants — chacun avec son propre système de badges, renouvelable chaque semaine.
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
