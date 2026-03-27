"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import ConfirmModal from "@/components/admin/ConfirmModal";
import GradientPicker from "@/components/admin/GradientPicker";
import ImageUpload from "@/components/admin/ImageUpload";

type Post = { id: string; platform: string; description: string; coverGradient: string; imageUrl?: string; postedAt: string; href: string; author?: string };
type Profile = { id: string; name: string; domain: string; profileHref: string; avatarGradient: string; imageUrl?: string; rating: number };

const initPosts: Post[] = [
  { id: "fb-1", platform: "Facebook", description: "Tu veux lancer ton business digital mais tu ne sais pas par où commencer ? Voici la méthode en 3 étapes.", coverGradient: "linear-gradient(135deg, #1877F2 0%, #0D1B5E 100%)", postedAt: "2026-03-20", href: "https://facebook.com" },
  { id: "li-1", platform: "LinkedIn", description: "J'ai analysé 200 offres digitales qui se vendent bien. Voici les 5 caractéristiques communes.", coverGradient: "linear-gradient(135deg, #0A66C2 0%, #0D1B5E 100%)", postedAt: "2026-03-21", href: "https://linkedin.com" },
  { id: "yt-1", platform: "YouTube", description: "Comment créer un tunnel de vente qui convertit à froid — Étude de cas complète.", coverGradient: "linear-gradient(135deg, #FF0000 0%, #7C0000 100%)", postedAt: "2026-03-19", href: "https://youtube.com" },
  { id: "ac-1", platform: "Autres Créateurs", description: "Un article de Alex Hormozi sur la structure d'une offre irrésistible.", coverGradient: "linear-gradient(135deg, #7C3AED 0%, #0D1B5E 100%)", postedAt: "2026-03-22", href: "https://acquisition.com", author: "Alex Hormozi" },
];

const initProfiles: Profile[] = [
  { id: "p1", name: "Marie Dupont", domain: "E-commerce & Dropshipping", profileHref: "#", avatarGradient: "linear-gradient(135deg, #1877F2 0%, #6366F1 100%)", rating: 5 },
  { id: "p2", name: "Jean Konan", domain: "Marketing Digital & SEO", profileHref: "#", avatarGradient: "linear-gradient(135deg, #10B981 0%, #0D9488 100%)", rating: 4 },
  { id: "p3", name: "Sophie Martin", domain: "Coaching Business & Mindset", profileHref: "#", avatarGradient: "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)", rating: 4 },
];

const platColor: Record<string, string> = { Facebook: "#1877F2", LinkedIn: "#0A66C2", YouTube: "#FF0000", "Autres Créateurs": "#8B5CF6" };

function PostForm({ post, onSave, onCancel }: { post?: Partial<Post>; onSave: (p: Post) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Post>({
    id: post?.id ?? "post-" + Date.now(),
    platform: post?.platform ?? "Facebook",
    description: post?.description ?? "",
    coverGradient: post?.coverGradient ?? "linear-gradient(135deg, #1877F2 0%, #0D1B5E 100%)",
    imageUrl: post?.imageUrl ?? "",
    postedAt: post?.postedAt ?? new Date().toISOString().split("T")[0],
    href: post?.href ?? "",
    author: post?.author ?? "",
  });
  const s = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
  const fc = "rounded-lg px-3 py-2 text-sm text-white outline-none w-full";
  return (
    <div className="rounded-2xl p-5 space-y-3 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Plateforme</label>
          <select className={fc} style={s} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
            <option>Facebook</option><option>LinkedIn</option><option>YouTube</option><option>Autres Créateurs</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Date (YYYY-MM-DD)</label>
          <input className={fc} style={s} value={form.postedAt} onChange={(e) => setForm({ ...form, postedAt: e.target.value })} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Description</label>
        <textarea className={fc} style={s} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Lien externe</label>
        <input className={fc} style={s} value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} />
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Auteur (si Autres Créateurs)</label>
        <input className={fc} style={s} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
      </div>
      <GradientPicker value={form.coverGradient} onChange={(v) => setForm({ ...form, coverGradient: v })} />
      <ImageUpload label="Image du post (optionnel)" value={form.imageUrl ?? ""} onChange={(v) => setForm({ ...form, imageUrl: v })} maxWidth={1200} maxHeight={800} quality={0.78} aspectHint="16:9" />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)} className="rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>Sauvegarder</button>
        <button onClick={onCancel} className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Annuler</button>
      </div>
    </div>
  );
}

function ProfileForm({ profile, onSave, onCancel }: { profile?: Partial<Profile>; onSave: (p: Profile) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Profile>({
    id: profile?.id ?? "p-" + Date.now(),
    name: profile?.name ?? "",
    domain: profile?.domain ?? "",
    profileHref: profile?.profileHref ?? "",
    avatarGradient: profile?.avatarGradient ?? "linear-gradient(135deg, #1A3FD8 0%, #6366F1 100%)",
    imageUrl: profile?.imageUrl ?? "",
    rating: profile?.rating ?? 5,
  });
  const s = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
  const fc = "rounded-lg px-3 py-2 text-sm text-white outline-none w-full";
  return (
    <div className="rounded-2xl p-5 space-y-3 mb-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(59,130,246,0.2)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Nom complet</label>
          <input className={fc} style={s} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Domaine</label>
          <input className={fc} style={s} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Lien profil</label>
          <input className={fc} style={s} value={form.profileHref} onChange={(e) => setForm({ ...form, profileHref: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Note (1–5)</label>
          <input className={fc} style={s} type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} />
        </div>
      </div>
      <GradientPicker label="Gradient avatar (si pas de photo)" value={form.avatarGradient} onChange={(v) => setForm({ ...form, avatarGradient: v })} />
      <ImageUpload label="Photo de profil (optionnel)" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} maxWidth={200} maxHeight={200} quality={0.8} aspectHint="1:1" />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(form)} className="rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>Sauvegarder</button>
        <button onClick={onCancel} className="rounded-lg px-4 py-2 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Annuler</button>
      </div>
    </div>
  );
}

export default function AdminContenusPage() {
  const [tab, setTab] = useState<"posts" | "profils">("posts");
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletePost, setDeletePost] = useState<string | null>(null);
  const [deleteProfile, setDeleteProfile] = useState<string | null>(null);
  const [editPost, setEditPost] = useState<Partial<Post> | null>(null);
  const [editProfile, setEditProfile] = useState<Partial<Profile> | null>(null);
  const [addingPost, setAddingPost] = useState(false);
  const [addingProfile, setAddingProfile] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/contenus?type=post").then((r) => r.json()),
      fetch("/api/contenus?type=profile").then((r) => r.json()),
    ]).then(([p, pr]) => {
      setPosts(Array.isArray(p) ? p : []);
      setProfiles(Array.isArray(pr) ? pr : []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const savePost = async (p: Post) => {
    const exists = posts.some((x) => x.id === p.id);
    if (exists) {
      await fetch(`/api/contenus/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, type: "post" }) });
    } else {
      await fetch("/api/contenus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, type: "post" }) });
    }
    setAddingPost(false); setEditPost(null);
    load();
  };
  const saveProfile = async (p: Profile) => {
    const exists = profiles.some((x) => x.id === p.id);
    if (exists) {
      await fetch(`/api/contenus/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, type: "profile" }) });
    } else {
      await fetch("/api/contenus", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...p, type: "profile" }) });
    }
    setAddingProfile(false); setEditProfile(null);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <AdminHeader title="Contenus" subtitle="Posts & Profils Business" />
        <button
          onClick={() => tab === "posts" ? setAddingPost(true) : setAddingProfile(true)}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {tab === "posts" ? "Nouveau post" : "Nouveau profil"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {(["posts", "profils"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors"
            style={{ background: tab === t ? "rgba(59,130,246,0.15)" : "transparent", color: tab === t ? "#60A5FA" : "rgba(255,255,255,0.4)", border: tab === t ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent" }}>
            {t === "posts" ? `Posts (${loading ? "…" : posts.length})` : `Profils Business (${loading ? "…" : profiles.length})`}
          </button>
        ))}
      </div>

      {tab === "posts" && (
        <>
          {addingPost && <PostForm onSave={savePost} onCancel={() => setAddingPost(false)} />}
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id}>
                {editPost?.id === p.id
                  ? <PostForm post={p} onSave={savePost} onCancel={() => setEditPost(null)} />
                  : (
                    <div className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden" style={{ background: p.coverGradient }}>
                        {p.imageUrl && <img src={p.imageUrl} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: (platColor[p.platform] ?? "#60A5FA") + "22", color: platColor[p.platform] ?? "#60A5FA" }}>{p.platform}</span>
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{p.postedAt}</span>
                          {p.author && <span className="text-xs italic" style={{ color: "rgba(255,255,255,0.35)" }}>par {p.author}</span>}
                        </div>
                        <p className="text-sm text-white truncate mt-0.5">{p.description}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setEditPost(p)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</button>
                        <button onClick={() => setDeletePost(p.id)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "profils" && (
        <>
          {addingProfile && <ProfileForm onSave={saveProfile} onCancel={() => setAddingProfile(false)} />}
          <div className="space-y-3">
            {profiles.map((p) => (
              <div key={p.id}>
                {editProfile?.id === p.id
                  ? <ProfileForm profile={p} onSave={saveProfile} onCancel={() => setEditProfile(null)} />
                  : (
                    <div className="flex items-center gap-4 rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-white" style={{ background: p.avatarGradient }}>
                        {p.imageUrl
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                          : p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{p.domain} · ★ {p.rating}/5</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => setEditProfile(p)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>Éditer</button>
                        <button onClick={() => setDeleteProfile(p.id)} className="rounded-lg px-3 py-1.5 text-xs font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>Supprimer</button>
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </>
      )}

      <ConfirmModal open={!!deletePost} message="Le post sera supprimé définitivement."
        onConfirm={async () => { if (deletePost) { await fetch(`/api/contenus/${deletePost}`, { method: "DELETE" }); setDeletePost(null); load(); } }}
        onCancel={() => setDeletePost(null)} />
      <ConfirmModal open={!!deleteProfile} message="Le profil sera supprimé définitivement."
        onConfirm={async () => { if (deleteProfile) { await fetch(`/api/contenus/${deleteProfile}`, { method: "DELETE" }); setDeleteProfile(null); load(); } }}
        onCancel={() => setDeleteProfile(null)} />
    </div>
  );
}
