"use client";

import { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

const initialRessources = [
  { id: "ebook-positionnement", title: "Trouver ton positionnement rentable", category: "Ebook", type: "Gratuit", topic: "Business", rating: 4.8, downloads: 312, price: "" },
  { id: "checklist-lancement", title: "Checklist lancement produit digital", category: "Checklist", type: "Gratuit", topic: "Vente", rating: 4.9, downloads: 541, price: "" },
  { id: "template-tunnel", title: "Template tunnel de vente 7 étapes", category: "Template", type: "Payant", topic: "Vente", rating: 4.7, downloads: 189, price: "19€" },
  { id: "ebook-mindset", title: "Mindset de l'entrepreneur digital", category: "Ebook", type: "Gratuit", topic: "Développement personnel", rating: 4.6, downloads: 278, price: "" },
  { id: "template-contenu", title: "Templates de contenu réseaux sociaux", category: "Template", type: "Payant", topic: "Social Media", rating: 4.5, downloads: 143, price: "29€" },
  { id: "checklist-ia", title: "Checklist outils IA pour ton business", category: "Checklist", type: "Gratuit", topic: "Tech", rating: 4.9, downloads: 407, price: "" },
  { id: "guide-contenu-viral", title: "Guide contenu viral organique", category: "Ebook", type: "Gratuit", topic: "Création de Contenu", rating: 4.7, downloads: 356, price: "" },
  { id: "template-strategie-marketing", title: "Template stratégie marketing 90 jours", category: "Template", type: "Payant", topic: "Marketing", rating: 4.8, downloads: 201, price: "24€" },
];

const catColor: Record<string, string> = { Ebook: "#6366F1", Template: "#F5C200", Checklist: "#14B8A6" };

export default function AdminRessourcesPage() {
  const [items, setItems] = useState(initialRessources);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Ressources" subtitle={`${items.length} ressource${items.length > 1 ? "s" : ""}`} />
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

      <div className="space-y-3">
        {items.map((r) => (
          <div
            key={r.id}
            className="flex items-center gap-4 rounded-2xl px-5 py-4"
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

      <ConfirmModal
        open={!!deleteTarget}
        message="La ressource sera supprimée définitivement."
        onConfirm={() => { setItems(items.filter((r) => r.id !== deleteTarget)); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
