"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import DynamicList from "@/components/admin/DynamicList";
import GradientPicker from "@/components/admin/GradientPicker";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Tool } from "@/lib/tools-data";

const FIELD = "rounded-lg px-3 py-2.5 text-sm text-white outline-none w-full";
const S = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
const L = "block text-xs font-semibold mb-1.5";
const LS = { color: "rgba(255,255,255,0.6)" };

export default function OutilForm({ initial, title }: { initial?: Partial<Tool>; title: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "Productivité",
    rating: String(initial?.rating ?? 4),
    tagline: initial?.tagline ?? "",
    logoGradient: initial?.logoGradient ?? "linear-gradient(135deg, #1A1A1A 0%, #3B3B3B 100%)",
    imageUrl: initial?.imageUrl ?? "",
    officialUrl: initial?.officialUrl ?? "",
    price: initial?.price ?? "",
    features: initial?.features ?? [""],
    pros: initial?.pros ?? [""],
    cons: initial?.cons ?? [""],
    tip: initial?.tip ?? "",
    howToTry: initial?.howToTry ?? "",
  });

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => { setSaved(false); router.push("/admin/outils"); }, 1200); };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title={title} />
        <button onClick={save} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: saved ? "#14B8A6" : "linear-gradient(135deg, #059669 0%, #34D399 100%)" }}>
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Infos */}
        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold text-white">Informations générales</h2>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={L} style={LS}>Nom *</label><input className={FIELD} style={S} value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div><label className={L} style={LS}>Slug *</label><input className={FIELD} style={S} value={form.slug} onChange={(e) => set("slug", e.target.value)} /></div>
            <div>
              <label className={L} style={LS}>Catégorie</label>
              <select className={FIELD} style={S} value={form.category} onChange={(e) => set("category", e.target.value)}>
                {["Productivité","Email Marketing","Design","Tunnel de Vente","Intelligence Artificielle","Vidéo & Communication"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={L} style={LS}>Note (1–5)</label><input className={FIELD} style={S} type="number" min={1} max={5} value={form.rating} onChange={(e) => set("rating", e.target.value)} /></div>
          </div>
          <div><label className={L} style={LS}>Tagline</label><input className={FIELD} style={S} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></div>
          <div><label className={L} style={LS}>Prix (ex: Freemium — 8$/mois)</label><input className={FIELD} style={S} value={form.price} onChange={(e) => set("price", e.target.value)} /></div>
          <div><label className={L} style={LS}>URL officielle</label><input className={FIELD} style={S} value={form.officialUrl} onChange={(e) => set("officialUrl", e.target.value)} /></div>
          <GradientPicker label="Logo gradient" value={form.logoGradient} onChange={(v) => set("logoGradient", v)} />
          <ImageUpload label="Logo / Image (optionnel)" value={form.imageUrl} onChange={(v) => set("imageUrl", v)} maxWidth={400} maxHeight={400} quality={0.8} aspectHint="1:1" />
        </section>

        {/* Lists */}
        <section className="rounded-2xl p-6 space-y-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold text-white">Contenu de la review</h2>
          <DynamicList label="Fonctionnalités" items={form.features} onChange={(v) => set("features", v)} placeholder="Ex: API publique pour automatisations" />
          <DynamicList label="Avantages" items={form.pros} onChange={(v) => set("pros", v)} placeholder="Ex: Interface intuitive" />
          <DynamicList label="Inconvénients" items={form.cons} onChange={(v) => set("cons", v)} placeholder="Ex: Prix élevé" />
        </section>

        {/* Tip & HowToTry */}
        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold text-white">Conseils</h2>
          <div><label className={L} style={LS}>Tip</label><textarea className={FIELD} style={S} rows={3} value={form.tip} onChange={(e) => set("tip", e.target.value)} /></div>
          <div><label className={L} style={LS}>Comment essayer</label><textarea className={FIELD} style={S} rows={3} value={form.howToTry} onChange={(e) => set("howToTry", e.target.value)} /></div>
        </section>
      </div>
    </div>
  );
}
