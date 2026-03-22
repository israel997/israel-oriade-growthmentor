"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formationCards } from "@/lib/site-data";
import { tools } from "@/lib/tools-data";

type Tab = "formations" | "outils" | "contenus";

const CARD = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" };

export default function FavorisPage() {
  const [tab, setTab] = useState<Tab>("formations");
  const [formFavIds, setFormFavIds] = useState<string[]>([]);
  const [toolFavIds, setToolFavIds] = useState<string[]>([]);
  const [contentFavIds, setContentFavIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setFormFavIds(JSON.parse(localStorage.getItem("gm_formation_favorites") || "[]"));
      setToolFavIds(JSON.parse(localStorage.getItem("gm_tool_favorites") || "[]"));
      setContentFavIds(JSON.parse(localStorage.getItem("gm_content_favorites") || "[]"));
    } catch {}
  }, []);

  const removeFav = (key: string, id: string) => {
    try {
      const prev: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(key, JSON.stringify(next));
      if (key === "gm_formation_favorites") setFormFavIds(next);
      if (key === "gm_tool_favorites") setToolFavIds(next);
      if (key === "gm_content_favorites") setContentFavIds(next);
    } catch {}
  };

  const favFormations = formationCards.filter((f) => formFavIds.includes(f.id));
  const favTools = tools.filter((t) => toolFavIds.includes(t.slug));

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "formations", label: "Formations", count: favFormations.length },
    { id: "outils",     label: "Outils",     count: favTools.length },
    { id: "contenus",   label: "Contenus",   count: contentFavIds.length },
  ];

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
                <button onClick={() => removeFav("gm_formation_favorites", f.id)}
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
                <button onClick={() => removeFav("gm_tool_favorites", t.slug)}
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
          {contentFavIds.length === 0 ? (
            <Empty label="contenu" href="/contenus" />
          ) : contentFavIds.map((id) => (
            <div key={id} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={CARD}>
              <div className="h-10 w-10 shrink-0 rounded-xl" style={{ background: "linear-gradient(135deg,#1877F2,#0D1B5E)" }} />
              <div className="flex-1">
                <p className="text-sm text-white">{id}</p>
              </div>
              <button onClick={() => removeFav("gm_content_favorites", id)}
                className="rounded-lg px-3 py-1.5 text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.08)", color: "#F87171", border: "1px solid rgba(239,68,68,0.15)" }}>
                Retirer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ label, href }: { label: string; href: string }) {
  return (
    <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(96,165,250,0.15)" }}>
      <p className="text-sm font-semibold text-white mb-1">Aucun {label} favori</p>
      <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Clique sur l&apos;icône de sauvegarde sur les pages du site.</p>
      <Link href={href}
        className="inline-flex rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
        style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
        Explorer les {label}s →
      </Link>
    </div>
  );
}
