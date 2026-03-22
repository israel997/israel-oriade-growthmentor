"use client";

import { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { tools } from "@/lib/tools-data";

export default function AdminOutilsPage() {
  const [items, setItems] = useState(tools);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Outils Testés" subtitle={`${items.length} outil${items.length > 1 ? "s" : ""}`} />
        <Link href="/admin/outils/nouvel" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #059669 0%, #34D399 100%)" }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nouvel outil
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.slug} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="h-12 w-12 shrink-0 rounded-xl flex items-center justify-center text-lg font-black text-white/90" style={{ background: t.logoGradient }}>
              {t.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{t.name}</p>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/15 text-emerald-400">{t.category}</span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>★ {t.rating}/5 · {t.price}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/outils/${t.slug}`} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</Link>
              <button onClick={() => setDeleteTarget(t.slug)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal open={!!deleteTarget} message="L'outil sera supprimé définitivement."
        onConfirm={() => { setItems(items.filter((t) => t.slug !== deleteTarget)); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
