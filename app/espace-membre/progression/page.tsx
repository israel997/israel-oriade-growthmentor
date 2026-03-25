"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Result = { date: string; score: number; badge: string };

const BADGE_COLOR: Record<string, string> = {
  "Apprenti":      "#94A3B8",
  "En croissance": "#34D399",
  "Confirmé":      "#60A5FA",
  "Expert":        "#A78BFA",
  "Elite":         "#F5C200",
};

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

const OTHER_TESTS = [
  { slug: "contenu", label: "Stratégies de Contenu", storageKey: "gm_test_contenu_results", color: "#3B82F6" },
  { slug: "vente",   label: "Test de Vente",          storageKey: "gm_test_vente_results",   color: "#34D399" },
  { slug: "digital", label: "Compétence Digital",     storageKey: "gm_test_digital_results", color: "#A78BFA" },
];

const AVG_COMMUNITY = 61;
const CARD = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" };

function MiniScoreBar({ results, color }: { results: Result[]; color: string }) {
  if (results.length === 0) return (
    <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun test passé</p>
  );
  const last = results[results.length - 1];
  const prev = results[results.length - 2];
  const delta = prev ? last.score - prev.score : null;
  const badgeColor = BADGE_COLOR[last.badge] ?? color;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold"
            style={{ background: badgeColor + "18", color: badgeColor }}>
            {last.badge}
            <Crowns badge={last.badge} color={badgeColor} />
          </span>
          {delta !== null && (
            <span className="text-xs font-semibold" style={{ color: delta >= 0 ? "#34D399" : "#F87171" }}>
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-white">{last.score}<span className="text-xs font-normal" style={{ color: "rgba(255,255,255,0.3)" }}>/100</span></span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${last.score}%`, background: `linear-gradient(90deg, #1A3FD8, ${color})` }} />
      </div>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        {results.length} test{results.length > 1 ? "s" : ""} · dernier le {new Date(last.date).toLocaleDateString("fr-FR")}
      </p>
    </div>
  );
}

export default function ProgressionPage() {
  const { data: authSession } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [otherResults, setOtherResults] = useState<Record<string, Result[]>>({});
  const [showInfo, setShowInfo] = useState(false);

  const firstName = authSession?.user?.name?.split(" ")[0] ?? "toi";

  useEffect(() => {
    try {
      const r = localStorage.getItem("gm_diag_results");
      if (r) setResults(JSON.parse(r));
      const other: Record<string, Result[]> = {};
      for (const t of OTHER_TESTS) {
        try {
          const v = localStorage.getItem(t.storageKey);
          other[t.slug] = v ? JSON.parse(v) : [];
        } catch { other[t.slug] = []; }
      }
      setOtherResults(other);
    } catch {}
  }, []);

  const last = results[results.length - 1];
  const prev = results[results.length - 2];
  const delta = last && prev ? last.score - prev.score : null;
  const maxScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  const hasAnyOther = OTHER_TESTS.some((t) => (otherResults[t.slug] ?? []).length > 0);

  const W = 520, H = 100, PAD = 20;
  const points = results.map((r, i) => {
    const x = results.length === 1 ? W / 2 : PAD + (i / (results.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((r.score / 100) * (H - PAD * 2));
    return { x, y, ...r };
  });
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white leading-tight">
              {firstName}, voici ton évolution
            </h1>
            <button
              onClick={() => setShowInfo(v => !v)}
              className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full transition-colors"
              style={{ background: showInfo ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.07)", color: "#93C5FD" }}
              aria-label="En savoir plus">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </button>
          </div>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            Diagnostic principal + tests thématiques sur les derniers jours.
          </p>
        </div>
        <Link href="/espace-membre/diagnostic"
          className="shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
          + Nouveau test
        </Link>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="rounded-2xl p-5 space-y-3"
          style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", backdropFilter: "blur(16px)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <p className="text-sm font-bold text-white">Comment fonctionne Ma Progression, {firstName} ?</p>
            </div>
            <button onClick={() => setShowInfo(false)} className="shrink-0 transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.4)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            Cette page est ton tableau de bord personnel, {firstName}. Chaque fois que tu passes un test — diagnostic principal ou test thématique — ton score est enregistré et affiché ici.
          </p>
          <ul className="space-y-2">
            {[
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
                text: "Suis ton évolution dans le temps grâce à la courbe de progression.",
              },
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
                text: "Compare ton score à la moyenne de la communauté pour savoir où tu en es.",
              },
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"/><path d="M15 7a3 3 0 1 0-6 0c0 1.5.8 2.8 2 3.5V12h2v-1.5c1.2-.7 2-2 2-3.5Z"/><path d="M12 2v1"/></svg>,
                text: "Débloque des badges (Apprenti → Elite) en améliorant tes résultats.",
              },
              {
                icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>,
                text: "Passe les tests thématiques (Contenu, Vente, Digital) pour identifier tes points forts.",
              },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                <span className="shrink-0 mt-0.5" style={{ color: "#93C5FD" }}>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 pt-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <p className="text-xs font-medium" style={{ color: "rgba(96,165,250,0.7)" }}>
              Plus tu te testes régulièrement, plus tu mesures concrètement ta progression, {firstName}.
            </p>
          </div>
        </div>
      )}

      {/* ── DIAGNOSTIC PRINCIPAL ─────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
            Diagnostic principal
          </p>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          <Link href="/espace-membre/diagnostic" className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: "#93C5FD" }}>
            Voir →
          </Link>
        </div>

        {results.length === 0 ? (
          <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-5"
            style={{ background: "rgba(59,130,246,0.04)", border: "1px dashed rgba(96,165,250,0.2)" }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(96,165,250,0.1)" }}>
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">Pas encore de données</p>
              <p className="text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Passe ton premier diagnostic pour voir ta courbe de progression et te comparer à la communauté.
              </p>
            </div>
            <Link href="/espace-membre/diagnostic"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
              Lancer le diagnostic →
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: last.score.toString(), sub: "Score actuel", color: "white" },
                { value: delta === null ? "—" : `${delta >= 0 ? "+" : ""}${delta}`, sub: "vs test précédent", color: delta === null ? "white" : delta >= 0 ? "#34D399" : "#F87171" },
                { value: last.score >= AVG_COMMUNITY ? "Au-dessus" : "En dessous", sub: `Moy. communauté (${AVG_COMMUNITY})`, color: last.score >= AVG_COMMUNITY ? "#34D399" : "#F87171" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-4 text-center" style={CARD}>
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Graphe */}
            {results.length >= 2 && (
              <div className="rounded-2xl p-5" style={CARD}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.35)" }}>Courbe de progression</p>
                <svg width="100%" viewBox={`0 0 ${W} ${H}`} className="overflow-visible">
                  {[25, 50, 75, 100].map((v) => {
                    const y = H - PAD - ((v / 100) * (H - PAD * 2));
                    return <line key={v} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />;
                  })}
                  <line
                    x1={PAD} y1={H - PAD - ((AVG_COMMUNITY / 100) * (H - PAD * 2))}
                    x2={W - PAD} y2={H - PAD - ((AVG_COMMUNITY / 100) * (H - PAD * 2))}
                    stroke="rgba(245,194,0,0.3)" strokeWidth="1" strokeDasharray="4 4"
                  />
                  <polyline points={polyline} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points={`${points[0].x},${H - PAD} ${polyline} ${points[points.length - 1].x},${H - PAD}`} fill="rgba(59,130,246,0.08)" />
                  {points.map((p, i) => (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r="4" fill="#3B82F6" stroke="#060B2E" strokeWidth="2" />
                      <text x={p.x} y={p.y - 8} textAnchor="middle" fill="white" fontSize="8">{p.score}</text>
                    </g>
                  ))}
                </svg>
                <div className="flex items-center gap-5 mt-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 bg-blue-400 inline-block rounded" />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Ton score</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-0.5 w-4 inline-block rounded" style={{ borderTop: "1px dashed rgba(245,194,0,0.6)" }} />
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Moy. communauté ({AVG_COMMUNITY})</span>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-2xl p-5 space-y-3" style={CARD}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Historique</p>
              {[...results].reverse().map((r, i) => {
                const prevResult = results[results.length - i - 2];
                const d = prevResult ? r.score - prevResult.score : null;
                const color = BADGE_COLOR[r.badge] ?? "#94A3B8";
                return (
                  <div key={r.date} className="flex items-center gap-3 py-2"
                    style={{ borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                    <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: color + "20", color }}>
                      {r.score}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: color + "15", color }}>
                          {r.badge}
                          <Crowns badge={r.badge} color={color} />
                        </span>
                        {d !== null && (
                          <span className="text-xs font-semibold" style={{ color: d >= 0 ? "#34D399" : "#F87171" }}>
                            {d >= 0 ? "▲" : "▼"} {Math.abs(d)} pts
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(r.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Meilleur score */}
            <div className="rounded-2xl p-5 text-center" style={{ background: "rgba(245,194,0,0.05)", border: "1px solid rgba(245,194,0,0.18)", backdropFilter: "blur(16px)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Meilleur score</p>
              <p className="text-3xl font-black" style={{ color: "#F5C200" }}>{maxScore}<span className="text-sm font-normal text-white/40">/100</span></p>
            </div>
          </>
        )}
      </div>

      {/* ── AUTRES TESTS ─────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
            Tests thématiques
          </p>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
          <Link href="/espace-membre/autres-tests" className="text-xs font-medium transition-opacity hover:opacity-70" style={{ color: "#93C5FD" }}>
            Voir tous →
          </Link>
        </div>

        {!hasAnyOther ? (
          <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-5"
            style={{ background: "rgba(167,139,250,0.04)", border: "1px dashed rgba(167,139,250,0.2)" }}>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(167,139,250,0.1)" }}>
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#A78BFA" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-white mb-1">Aucun test thématique</p>
              <p className="text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                Contenu, vente, digital — 3 tests pour identifier précisément tes points forts et tes axes d'amélioration.
              </p>
            </div>
            <Link href="/espace-membre/autres-tests"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #A78BFA)" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
              Découvrir les tests →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {OTHER_TESTS.map((t) => {
              const list = otherResults[t.slug] ?? [];
              return (
                <div key={t.slug} className="rounded-2xl p-5" style={CARD}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: t.color }} />
                      <p className="text-sm font-semibold text-white">{t.label}</p>
                    </div>
                    <Link href={`/espace-membre/autres-tests/${t.slug}`}
                      className="text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: t.color }}>
                      {list.length === 0 ? "Passer →" : "Repasser →"}
                    </Link>
                  </div>
                  <MiniScoreBar results={list} color={t.color} />
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
