"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { testimonials } from "@/lib/site-data";

type Temoignage = { name: string; text: string };

const FC = "rounded-lg px-3 py-2 text-sm text-white outline-none w-full";
const S = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };

export default function AdminTemoignagesPage() {
  const [items, setItems] = useState<Temoignage[]>(testimonials);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Temoignage>({ name: "", text: "" });

  const save = () => {
    if (editing !== null) {
      setItems(items.map((t, i) => i === editing ? draft : t));
      setEditing(null);
    } else {
      setItems([...items, draft]);
      setAdding(false);
    }
    setDraft({ name: "", text: "" });
  };

  const startEdit = (i: number) => { setDraft({ ...items[i] }); setEditing(i); setAdding(false); };
  const startAdd = () => { setDraft({ name: "", text: "" }); setAdding(true); setEditing(null); };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Témoignages" subtitle={`${items.length} témoignage${items.length > 1 ? "s" : ""}`} />
        <button onClick={startAdd} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nouveau
        </button>
      </div>

      {(adding || editing !== null) && (
        <div className="rounded-2xl p-5 space-y-3 mb-5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.3)" }}>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Prénom</label>
            <input className={FC} style={S} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>Témoignage</label>
            <textarea className={FC} style={S} rows={3} value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>Sauvegarder</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((t, i) => (
          <div key={i} className="flex items-start gap-4 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
              {t.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>&ldquo;{t.text}&rdquo;</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(i)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</button>
              <button onClick={() => setDeleteIdx(i)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal open={deleteIdx !== null} message="Le témoignage sera supprimé définitivement."
        onConfirm={() => { setItems(items.filter((_, i) => i !== deleteIdx)); setDeleteIdx(null); }}
        onCancel={() => setDeleteIdx(null)} />
    </div>
  );
}
