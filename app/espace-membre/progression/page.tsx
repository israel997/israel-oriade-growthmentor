"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Result = { date: string; score: number; badge: string };

const BADGE_COLOR: Record<string, string> = {
  "Apprenti":      "#94A3B8",
  "En croissance": "#34D399",
  "Confirmé":      "#60A5FA",
  "Expert":        "#A78BFA",
  "Elite":         "#F5C200",
};

const AVG_COMMUNITY = 61;
const CARD = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" };

export default function ProgressionPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    try {
      const r = localStorage.getItem("gm_diag_results");
      if (r) setResults(JSON.parse(r));
    } catch {}
  }, []);

  const last = results[results.length - 1];
  const prev = results[results.length - 2];
  const delta = last && prev ? last.score - prev.score : null;
  const maxScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;

  const W = 520, H = 100, PAD = 20;
  const points = results.map((r, i) => {
    const x = results.length === 1 ? W / 2 : PAD + (i / (results.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((r.score / 100) * (H - PAD * 2));
    return { x, y, ...r };
  });
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Ma Progression</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            {results.length} test{results.length > 1 ? "s" : ""} passé{results.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/espace-membre/diagnostic"
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
          + Nouveau test
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(96,165,250,0.15)" }}>
          <p className="text-sm font-semibold text-white mb-1">Aucun test encore passé</p>
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Passe ton premier test de progression pour commencer à suivre ton évolution.</p>
          <Link href="/espace-membre/diagnostic"
            className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            Passer le test →
          </Link>
        </div>
      ) : (
        <>
          {/* Stats résumé */}
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
                      <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ background: color + "15", color }}>{r.badge}</span>
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
  );
}
