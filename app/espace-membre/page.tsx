"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Session = { name: string; email: string; method?: string };
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
  { label: "Passer mon test",    href: "/espace-membre/diagnostic",  color: "#34D399", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  { label: "Discuter avec Izzy", href: "/espace-membre/izzy",        color: "#A78BFA", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg> },
  { label: "Mes favoris",        href: "/espace-membre/favoris",     color: "#60A5FA", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg> },
  { label: "Programme Mentee",   href: "/espace-membre/mentee",      color: "#F5C200", icon: <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg> },
];

export default function EspaceMembreDashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [results, setResults] = useState<DiagResult[]>([]);
  const [canTest, setCanTest] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem("gm_member_session");
      if (s) setSession(JSON.parse(s));
      const r = localStorage.getItem("gm_diag_results");
      if (r) {
        const parsed: DiagResult[] = JSON.parse(r);
        setResults(parsed);
        if (parsed.length > 0) {
          const last = new Date(parsed[parsed.length - 1].date).getTime();
          setCanTest(Date.now() - last > 7 * 24 * 60 * 60 * 1000);
        }
      }
    } catch {}
  }, []);

  const lastResult = results[results.length - 1];
  const badge = lastResult?.badge ?? "Apprenti";
  const badgeStyle = BADGE_CONFIG[badge] ?? BADGE_CONFIG["Apprenti"];
  const firstName = session?.name?.split(" ")[0] ?? "Membre";

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
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{session?.email}</p>
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
