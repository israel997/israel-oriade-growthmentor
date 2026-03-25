"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

type Ressource = { id: string; title: string; category: string; type: string; topic: string; rating: number; downloads: number; price?: string };

const catColor: Record<string, string> = { Ebook: "#6366F1", Template: "#F5C200", Checklist: "#14B8A6" };

export default function AdminRessourcesPage() {
  const [items, setItems] = useState<Ressource[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/ressources")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/ressources/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Ressources" subtitle={loading ? "…" : `${items.length} ressource${items.length > 1 ? "s" : ""}`} />
        <Link
          href="/admin/ressources/nouvelle"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvelle ressource
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white truncate">{r.title}</p>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: (catColor[r.category] ?? "#60A5FA") + "22", color: catColor[r.category] ?? "#60A5FA" }}>{r.category}</span>
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: r.type === "Gratuit" ? "rgba(52,211,153,0.15)" : "rgba(245,194,0,0.15)", color: r.type === "Gratuit" ? "#34D399" : "#F5C200" }}>{r.type}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {r.topic} · ★ {r.rating} · {r.downloads} téléchargements{r.price ? ` · ${r.price}` : ""}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/admin/ressources/${r.id}`} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</Link>
                <button onClick={() => setDeleteTarget(r.id)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        message="La ressource sera supprimée définitivement."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
