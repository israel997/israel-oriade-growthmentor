"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";

type BlogPost = { slug: string; title: string; excerpt: string; date: string };

export default function AdminBlogPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/blog").then((r) => r.json()).then(setItems);
  }, []);

  const handleDelete = async (slug: string) => {
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setItems(items.filter((p) => p.slug !== slug));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <AdminHeader title="Blog" subtitle={`${items.length} article${items.length > 1 ? "s" : ""}`} />
        <Link href="/admin/blog/nouvel" className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #B45309 0%, #F5C200 100%)", color: "#000" }}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Nouvel article
        </Link>
      </div>

      <div className="space-y-3">
        {items.map((post) => (
          <div key={post.slug} className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{post.title}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{post.date} · {post.excerpt}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href={`/admin/blog/${post.slug}`} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</Link>
              <button onClick={() => setDeleteTarget(post.slug)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal open={!!deleteTarget} message="L'article sera supprimé définitivement."
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
