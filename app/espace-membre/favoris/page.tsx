"use client";

import { useEffect, useState } from "react";
import type React from "react";
import Link from "next/link";

type Tab = "formations" | "outils" | "contenus";
type FavFormation = { id: string; title: string; type: string; coverGradient: string; price: string; href?: string };
type FavTool = { slug: string; name: string; category: string; logoGradient: string; price: string };
type FavContent = { id: string; platform?: string; description?: string; coverGradient?: string; href?: string };

const CARD = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" };

export default function FavorisPage() {
  const [tab, setTab] = useState<Tab>("formations");
  const [favFormations, setFavFormations] = useState<FavFormation[]>([]);
  const [favTools, setFavTools] = useState<FavTool[]>([]);
  const [favContents, setFavContents] = useState<FavContent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavoris = () => {
    Promise.all([
      fetch("/api/favoris").then((r) => r.json()),
      fetch("/api/formations").then((r) => r.json()),
      fetch("/api/outils").then((r) => r.json()),
      fetch("/api/contenus").then((r) => r.json()),
    ])
      .then(([favs, formations, outils, contenus]) => {
        const fIds: string[] = favs?.formations ?? [];
        const tIds: string[] = favs?.outils ?? [];
        const cIds: string[] = favs?.contenus ?? [];
        setFavFormations(Array.isArray(formations) ? formations.filter((f: FavFormation) => fIds.includes(f.id)) : []);
        setFavTools(Array.isArray(outils) ? outils.filter((t: FavTool) => tIds.includes(t.slug)) : []);
        setFavContents(Array.isArray(contenus) ? contenus.filter((c: FavContent) => cIds.includes(c.id)) : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadFavoris(); }, []);

  const removeFav = (category: "formations" | "outils" | "contenus", id: string) => {
    fetch("/api/favoris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category, id, action: "remove" }),
    }).then(() => loadFavoris()).catch(() => {});
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "formations", label: "Formations", count: favFormations.length },
    { id: "outils",     label: "Outils",     count: favTools.length },
    { id: "contenus",   label: "Contenus",   count: favContents.length },
  ];

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Mes Favoris</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Tout ce que tu as sauvegardé au fil de ta navigation.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
            style={{
              background: tab === t.id ? "rgba(26,63,216,0.18)" : "rgba(255,255,255,0.04)",
              color: tab === t.id ? "#93C5FD" : "rgba(255,255,255,0.45)",
              border: tab === t.id ? "1px solid rgba(96,165,250,0.25)" : "1px solid rgba(255,255,255,0.06)",
            }}>
            {t.label}
            <span className="rounded-full px-1.5 py-0.5 text-xs font-bold"
              style={{ background: tab === t.id ? "rgba(96,165,250,0.2)" : "rgba(255,255,255,0.08)", color: tab === t.id ? "#60A5FA" : "rgba(255,255,255,0.4)" }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Formations */}
      {tab === "formations" && (
        <div className="space-y-2">
          {favFormations.length === 0 ? (
            <Empty label="formation" href="/formations" />
          ) : favFormations.map((f) => (
            <div key={f.id} className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all hover:border-blue-400/20" style={CARD}>
              <div className="h-10 w-10 shrink-0 rounded-xl" style={{ background: f.coverGradient }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{f.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{f.type} · {f.price}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={f.href ?? "/formations"}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium transition-transform hover:scale-[1.02]"
                  style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
                  Voir
                </Link>
                <button onClick={() => removeFav("formations", f.id)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.15)" }}>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Outils */}
      {tab === "outils" && (
        <div className="space-y-2">
          {favTools.length === 0 ? (
            <Empty label="outil" href="/testes" />
          ) : favTools.map((t) => (
            <div key={t.slug} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={CARD}>
              <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black text-white" style={{ background: t.logoGradient }}>
                {t.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{t.category} · {t.price}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/testes/${t.slug}`}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
                  Voir
                </Link>
                <button onClick={() => removeFav("outils", t.slug)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.15)" }}>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contenus */}
      {tab === "contenus" && (
        <div className="space-y-2">
          {favContents.length === 0 ? (
            <Empty label="contenu" href="/contenus" />
          ) : favContents.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={CARD}>
              <div className="h-10 w-10 shrink-0 rounded-xl" style={{ background: c.coverGradient ?? "linear-gradient(135deg,#1877F2,#0D1B5E)" }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{c.platform}</p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{c.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {c.href && (
                  <a href={c.href} target="_blank" rel="noopener noreferrer"
                    className="rounded-lg px-3 py-1.5 text-sm font-medium"
                    style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
                    Voir
                  </a>
                )}
                <button onClick={() => removeFav("contenus", c.id)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.15)" }}>
                  Retirer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const EMPTY_ICONS: Record<string, React.ReactNode> = {
  formation: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84 51.39 51.39 0 0 0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
  ),
  outil: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#A78BFA" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  contenu: (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
};

const EMPTY_COLORS: Record<string, { color: string; bg: string }> = {
  formation: { color: "#60A5FA", bg: "rgba(96,165,250,0.08)" },
  outil:     { color: "#A78BFA", bg: "rgba(167,139,250,0.08)" },
  contenu:   { color: "#34D399", bg: "rgba(52,211,153,0.08)" },
};

const EMPTY_CTXTS: Record<string, string> = {
  formation: "Explore les formations et clique sur ♡ pour les retrouver ici.",
  outil:     "Parcours les outils testés et sauvegarde ceux qui t'intéressent.",
  contenu:   "Découvre les contenus et marque ceux que tu veux relire.",
};

function Empty({ label, href }: { label: string; href: string }) {
  const icon = EMPTY_ICONS[label];
  const colors = EMPTY_COLORS[label] ?? { color: "#93C5FD", bg: "rgba(96,165,250,0.08)" };
  const ctx = EMPTY_CTXTS[label] ?? `Aucun ${label} favori pour l'instant.`;
  return (
    <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-5"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: colors.bg }}>
        {icon}
      </div>
      <div>
        <p className="text-base font-bold text-white mb-1">Aucun {label} sauvegardé</p>
        <p className="text-sm max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>{ctx}</p>
      </div>
      <Link href={href}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
        style={{ background: `linear-gradient(135deg, #1A3FD8, ${colors.color})` }}>
        Explorer les {label}s →
      </Link>
    </div>
  );
}
