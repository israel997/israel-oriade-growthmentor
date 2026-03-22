"use client";

import { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { formationCards } from "@/lib/site-data";

const typeColor: Record<string, string> = {
  Formation: "#14B8A6",
  Masterclass: "#F5C200",
  Accompagnement: "#A855F7",
};

export default function AdminFormationsPage() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [items, setItems] = useState(formationCards);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Formations" subtitle={`${items.length} programme${items.length > 1 ? "s" : ""}`} />
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

      <div className="space-y-3">
        {items.map((f) => (
          <div
            key={f.id}
            className="flex items-center gap-4 rounded-2xl px-5 py-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* Cover */}
            <div className="h-12 w-12 shrink-0 rounded-xl" style={{ background: f.coverGradient }} />

            {/* Info */}
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

            {/* Actions */}
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

      <ConfirmModal
        open={!!deleteTarget}
        message="La formation sera supprimée définitivement."
        onConfirm={() => { setItems(items.filter((f) => f.id !== deleteTarget)); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
