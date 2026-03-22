"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import type { BlogPost } from "@/lib/site-data";

const FC = "rounded-lg px-3 py-2.5 text-sm text-white outline-none w-full";
const S = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
const L = "block text-xs font-semibold mb-1.5";
const LS = { color: "rgba(255,255,255,0.6)" };

export default function BlogForm({ initial, title }: { initial?: Partial<BlogPost>; title: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    title: initial?.title ?? "",
    excerpt: initial?.excerpt ?? "",
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    body: initial?.body ?? "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const save = () => { setSaved(true); setTimeout(() => { setSaved(false); router.push("/admin/blog"); }, 1200); };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title={title} />
        <button onClick={save} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: saved ? "#14B8A6" : "linear-gradient(135deg, #B45309 0%, #F5C200 100%)", color: saved ? "#fff" : "#000" }}>
          {saved ? "✓ Sauvegardé" : "Sauvegarder"}
        </button>
      </div>

      <section className="rounded-2xl p-6 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={L} style={LS}>Titre *</label><input className={FC} style={S} value={form.title} onChange={(e) => set("title", e.target.value)} /></div>
          <div><label className={L} style={LS}>Slug *</label><input className={FC} style={S} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="ex: mon-article" /></div>
          <div><label className={L} style={LS}>Date (YYYY-MM-DD)</label><input className={FC} style={S} value={form.date} onChange={(e) => set("date", e.target.value)} /></div>
        </div>
        <div><label className={L} style={LS}>Excerpt (résumé court)</label><input className={FC} style={S} value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></div>
        <div><label className={L} style={LS}>Corps de l&apos;article</label><textarea className={FC} style={S} rows={12} value={form.body} onChange={(e) => set("body", e.target.value)} /></div>
      </section>
    </div>
  );
}
