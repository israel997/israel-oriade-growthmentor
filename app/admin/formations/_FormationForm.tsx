"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import DynamicList from "@/components/admin/DynamicList";
import GradientPicker from "@/components/admin/GradientPicker";
import ImageUpload from "@/components/admin/ImageUpload";
import type { FormationCard, FormationModule } from "@/lib/site-data";

const FIELD = "rounded-lg px-3 py-2.5 text-sm text-white outline-none w-full";
const FIELD_STYLE = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
const LABEL = "block text-xs font-semibold mb-1.5";
const LABEL_STYLE = { color: "rgba(255,255,255,0.6)" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL} style={LABEL_STYLE}>{label}</label>
      {children}
    </div>
  );
}

export default function FormationForm({ initial, title }: { initial?: Partial<FormationCard>; title: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    type: initial?.type ?? "Formation",
    coverGradient: initial?.coverGradient ?? "linear-gradient(135deg, #0D9488 0%, #0D1B5E 100%)",
    image: initial?.image ?? "",
    period: initial?.period ?? "",
    validityPeriod: initial?.validityPeriod ?? "",
    price: initial?.price ?? "",
    priceXof: (initial as { priceXof?: string })?.priceXof ?? "",
    originalPrice: initial?.originalPrice ?? "",
    promo: initial?.promo ?? "",
    members: String(initial?.members ?? 0),
    advantages: initial?.advantages ?? [""],
    modules: initial?.modules ?? [{ title: "", lessons: [""] }] as FormationModule[],
    href: initial?.href ?? "",
  });

  const setField = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const updateModule = (i: number, key: keyof FormationModule, val: string | string[]) => {
    const mods = [...form.modules];
    mods[i] = { ...mods[i], [key]: val };
    setField("modules", mods);
  };

  const addModule = () => setField("modules", [...form.modules, { title: "", lessons: [""] }]);
  const removeModule = (i: number) => setField("modules", form.modules.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    setSaved(true);
    const id = (initial as { id?: string })?.id;
    const payload = { ...form, members: Number(form.members) };
    if (id) {
      await fetch(`/api/formations/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    } else {
      await fetch("/api/formations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, id: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }) });
    }
    setTimeout(() => { setSaved(false); router.push("/admin/formations"); }, 800);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title={title} />
        <button
          onClick={handleSave}
          className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: saved ? "#14B8A6" : "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
        >
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Infos de base */}
        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold text-white mb-2">Informations générales</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Titre *">
              <input className={FIELD} style={FIELD_STYLE} value={form.title} onChange={(e) => setField("title", e.target.value)} />
            </Field>
            <Field label="Type">
              <select className={FIELD} style={FIELD_STYLE} value={form.type} onChange={(e) => setField("type", e.target.value)}>
                <option>Formation</option>
                <option>Masterclass</option>
                <option>Accompagnement</option>
              </select>
            </Field>
            <Field label="Prix en € (ex: 79€)">
              <input className={FIELD} style={FIELD_STYLE} value={form.price} onChange={(e) => setField("price", e.target.value)} />
            </Field>
            <Field label="Prix en XOF (ex: 51 821 XOF)">
              <input className={FIELD} style={FIELD_STYLE} value={form.priceXof} onChange={(e) => setField("priceXof", e.target.value)} placeholder="Auto-calculé si vide" />
            </Field>
            <Field label="Prix barré en € (ex: 99€)">
              <input className={FIELD} style={FIELD_STYLE} value={form.originalPrice} onChange={(e) => setField("originalPrice", e.target.value)} />
            </Field>
            <Field label="Promo (ex: -20%)">
              <input className={FIELD} style={FIELD_STYLE} value={form.promo} onChange={(e) => setField("promo", e.target.value)} />
            </Field>
            <Field label="Nb membres">
              <input className={FIELD} style={FIELD_STYLE} type="number" value={form.members} onChange={(e) => setField("members", e.target.value)} />
            </Field>
            <Field label="Durée (ex: 30 jours)">
              <input className={FIELD} style={FIELD_STYLE} value={form.period} onChange={(e) => setField("period", e.target.value)} />
            </Field>
            <Field label="Validité (ex: Accès à vie)">
              <input className={FIELD} style={FIELD_STYLE} value={form.validityPeriod} onChange={(e) => setField("validityPeriod", e.target.value)} />
            </Field>
          </div>
          <Field label="Lien (href)">
            <input className={FIELD} style={FIELD_STYLE} value={form.href} onChange={(e) => setField("href", e.target.value)} />
          </Field>
          <GradientPicker label="Cover gradient" value={form.coverGradient} onChange={(v) => setField("coverGradient", v)} />
          <ImageUpload label="Image de couverture (optionnel)" value={form.image} onChange={(v) => setField("image", v)} maxWidth={1200} maxHeight={800} quality={0.78} aspectHint="16:9" />
        </section>

        {/* Avantages */}
        <section className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="text-sm font-bold text-white mb-4">Avantages</h2>
          <DynamicList label="" items={form.advantages} onChange={(v) => setField("advantages", v)} placeholder="Ex: Accès à vie aux mises à jour" />
        </section>

        {/* Modules */}
        <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">Modules</h2>
            <button type="button" onClick={addModule} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.1)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>
              + Module
            </button>
          </div>
          {form.modules.map((mod, i) => (
            <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex gap-2">
                <input
                  value={mod.title}
                  onChange={(e) => updateModule(i, "title", e.target.value)}
                  placeholder={`Titre du module ${i + 1}`}
                  className={`${FIELD} flex-1`}
                  style={FIELD_STYLE}
                />
                <button type="button" onClick={() => removeModule(i)} className="rounded-lg px-3 py-2 text-xs" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171" }}>✕</button>
              </div>
              <DynamicList label="Leçons" items={mod.lessons} onChange={(v) => updateModule(i, "lessons", v)} placeholder="Titre de la leçon" />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
