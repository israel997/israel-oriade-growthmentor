"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

type Formation = { id: string; title: string; type: string; coverGradient: string; price: string; originalPrice?: string; promo?: string; period: string; members: number };

const typeColor: Record<string, string> = {
  Formation: "#14B8A6",
  Masterclass: "#F5C200",
  Accompagnement: "#A855F7",
};

export default function AdminFormationsPage() {
  const [items, setItems] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/formations")
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await fetch(`/api/formations/${deleteTarget}`, { method: "DELETE" });
    setDeleteTarget(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Formations" subtitle={loading ? "…" : `${items.length} programme${items.length > 1 ? "s" : ""}`} />
        <Link
          href="/admin/formations/nouvelle"
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Nouvelle formation
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 rounded-full border-2 border-teal-500/30 border-t-teal-500 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="h-12 w-12 shrink-0 rounded-xl" style={{ background: f.coverGradient }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-white truncate">{f.title}</p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ background: (typeColor[f.type] ?? "#60A5FA") + "20", color: typeColor[f.type] ?? "#60A5FA" }}
                  >
                    {f.type}
                  </span>
                  {f.promo && (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300">
                      {f.promo}
                    </span>
                  )}
                </div>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {f.price}{f.originalPrice ? ` · barré ${f.originalPrice}` : ""} · {f.period} · {f.members} membres
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/formations/${f.id}`}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}
                >
                  Éditer
                </Link>
                <button
                  onClick={() => setDeleteTarget(f.id)}
                  className="rounded-lg px-3 py-1.5 text-xs font-medium"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        message="La formation sera supprimée définitivement."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
