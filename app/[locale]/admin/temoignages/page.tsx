"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import ImageUpload from "@/components/admin/ImageUpload";

type Temoignage = { id?: string; name: string; text: string; imageUrl?: string };

const FC = "rounded-lg px-3 py-2 text-sm text-white outline-none w-full";
const S = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };

const EMPTY: Temoignage = { name: "", text: "", imageUrl: "" };

export default function AdminTemoignagesPage() {
  const [items, setItems] = useState<Temoignage[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Temoignage>(EMPTY);

  useEffect(() => {
    fetch("/api/temoignages").then((r) => r.json()).then(setItems);
  }, []);

  const save = async () => {
    if (editing !== null) {
      await fetch("/api/temoignages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      setItems(items.map((t) => t.id === editing ? { ...draft } : t));
      setEditing(null);
    } else {
      const res = await fetch("/api/temoignages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      if (res.ok) {
        const updated = await fetch("/api/temoignages").then((r) => r.json());
        setItems(updated);
      }
      setAdding(false);
    }
    setDraft(EMPTY);
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/temoignages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setItems(items.filter((t) => t.id !== id));
    setDeleteTarget(null);
  };

  const startEdit = (t: Temoignage) => { setDraft({ ...t }); setEditing(t.id ?? null); setAdding(false); };
  const startAdd = () => { setDraft(EMPTY); setAdding(true); setEditing(null); };

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
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
          <ImageUpload label="Photo (optionnel)" value={draft.imageUrl ?? ""} onChange={(v) => setDraft({ ...draft, imageUrl: v })} maxWidth={200} maxHeight={200} quality={0.8} aspectHint="1:1" />
          <div className="flex gap-2">
            <button onClick={save} className="rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>Sauvegarder</button>
            <button onClick={() => { setAdding(false); setEditing(null); }} className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="flex items-start gap-4 rounded-2xl px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/15" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {t.imageUrl ? (
              <img src={t.imageUrl} alt={t.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)" }}>
                {t.name[0]}
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{t.name}</p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>&ldquo;{t.text}&rdquo;</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => startEdit(t)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</button>
              <button onClick={() => t.id && setDeleteTarget(t.id)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal open={!!deleteTarget} message="Le témoignage sera supprimé définitivement."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
