"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import GradientPicker from "@/components/admin/GradientPicker";

const FIELD = "rounded-lg px-3 py-2.5 text-sm text-white outline-none w-full";
const STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
const LABEL = "block text-xs font-semibold mb-1.5";
const LSTYLE = { color: "rgba(255,255,255,0.6)" };

type RessourceData = {
  title?: string; desc?: string; fullDesc?: string; category?: string; type?: string;
  topic?: string; author?: string; rating?: number; downloads?: number; price?: string;
  downloadHref?: string; gradient?: string;
};

export default function RessourceForm({ initial, title }: { initial?: RessourceData; title: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    desc: initial?.desc ?? "",
    fullDesc: initial?.fullDesc ?? "",
    category: initial?.category ?? "Ebook",
    type: initial?.type ?? "Gratuit",
    topic: initial?.topic ?? "Business",
    author: initial?.author ?? "Israël Oriadé",
    rating: String(initial?.rating ?? 4.5),
    downloads: String(initial?.downloads ?? 0),
    price: initial?.price ?? "",
    downloadHref: initial?.downloadHref ?? "#",
    gradient: initial?.gradient ?? "linear-gradient(135deg, #1A3FD8 0%, #6366F1 100%)",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => { setSaved(true); setTimeout(() => { setSaved(false); router.push("/admin/ressources"); }, 1200); };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title={title} />
        <button onClick={save} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: saved ? "#14B8A6" : "linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)" }}>
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold text-white">Informations générales</h2>
          <div>
            <label className={LABEL} style={LSTYLE}>Titre *</label>
            <input className={FIELD} style={STYLE} value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div>
            <label className={LABEL} style={LSTYLE}>Description courte</label>
            <input className={FIELD} style={STYLE} value={form.desc} onChange={(e) => set("desc", e.target.value)} />
          </div>
          <div>
            <label className={LABEL} style={LSTYLE}>Description longue</label>
            <textarea className={FIELD} style={STYLE} rows={4} value={form.fullDesc} onChange={(e) => set("fullDesc", e.target.value)} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={LABEL} style={LSTYLE}>Catégorie</label>
              <select className={FIELD} style={STYLE} value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option>Ebook</option><option>Template</option><option>Checklist</option>
              </select>
            </div>
            <div>
              <label className={LABEL} style={LSTYLE}>Type</label>
              <select className={FIELD} style={STYLE} value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option>Gratuit</option><option>Payant</option>
              </select>
            </div>
            <div>
              <label className={LABEL} style={LSTYLE}>Topic</label>
              <select className={FIELD} style={STYLE} value={form.topic} onChange={(e) => set("topic", e.target.value)}>
                {["Business","Création de Contenu","Vente","Marketing","Social Media","Développement personnel","Design","Tech"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL} style={LSTYLE}>Note (ex: 4.8)</label>
              <input className={FIELD} style={STYLE} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => set("rating", e.target.value)} />
            </div>
            <div>
              <label className={LABEL} style={LSTYLE}>Téléchargements</label>
              <input className={FIELD} style={STYLE} type="number" value={form.downloads} onChange={(e) => set("downloads", e.target.value)} />
            </div>
            <div>
              <label className={LABEL} style={LSTYLE}>Prix (si payant)</label>
              <input className={FIELD} style={STYLE} placeholder="ex: 19€" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </div>
          </div>
          <div>
            <label className={LABEL} style={LSTYLE}>Auteur</label>
            <input className={FIELD} style={STYLE} value={form.author} onChange={(e) => set("author", e.target.value)} />
          </div>
          <div>
            <label className={LABEL} style={LSTYLE}>Lien de téléchargement</label>
            <input className={FIELD} style={STYLE} value={form.downloadHref} onChange={(e) => set("downloadHref", e.target.value)} />
          </div>
          <GradientPicker value={form.gradient} onChange={(v) => set("gradient", v)} />
        </section>
      </div>
    </div>
  );
}
