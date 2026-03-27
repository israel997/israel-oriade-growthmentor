"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
// ── Floating Particles bg ─────────────────────────────────────────────────────
function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId: number;
    let lastTs = 0;
    const FRAME_MS = 1000 / 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastTs = 0;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Each particle drifts in a slow, slightly curved path
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 0.8 + Math.random() * 2.8,
      alpha: 0.08 + Math.random() * 0.35,
      // Drift velocity — very slow
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.05 - Math.random() * 0.2, // bias upward like rising dust
      // Sinusoidal horizontal wobble
      wobbleAmp: 0.2 + Math.random() * 0.5,
      wobbleFreq: 0.3 + Math.random() * 0.5,
      wobbleOffset: Math.random() * Math.PI * 2,
      // Pulse opacity
      pulseFreq: 0.2 + Math.random() * 0.4,
      pulseOffset: Math.random() * Math.PI * 2,
      baseAlpha: 0.08 + Math.random() * 0.3,
    }));

    const draw = (t: number) => {
      ctx.fillStyle = "#03071A";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const H = canvas.height;
      const W = canvas.width;

      for (const p of particles) {
        // Drift
        p.x += p.vx + Math.sin(t * p.wobbleFreq + p.wobbleOffset) * p.wobbleAmp;
        p.y += p.vy;

        // Wrap around edges
        if (p.y < -10) p.y = H + 10;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        // Pulsing opacity
        const alpha = p.baseAlpha * (0.5 + 0.5 * Math.sin(t * p.pulseFreq + p.pulseOffset));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${alpha.toFixed(2)})`;
        ctx.fill();
      }
    };

    const loop = (ts: number) => {
      rafId = requestAnimationFrame(loop);
      if (ts - lastTs < FRAME_MS) return;
      lastTs = ts;
      draw(ts / 1000);
    };
    rafId = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafId);
      else { lastTs = 0; rafId = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Platform = "Facebook" | "LinkedIn" | "YouTube" | "Autres Créateurs" | "Profils Business";

type BusinessProfile = {
  id: string;
  name: string;
  domain: string;
  profileHref: string;
  avatarGradient: string;
  imageUrl?: string;
  rating: number; // 1–5
};

type Post = {
  id: string;
  platform: Platform;
  description: string;
  coverGradient: string;
  imageUrl?: string;
  postedAt: string; // ISO date
  href: string;
  author?: string; // pour Autres Créateurs
};

// ── Platform config ───────────────────────────────────────────────────────────
const platformConfig: Record<Platform, { color: string; icon: React.ReactNode; label: string }> = {
  Facebook: {
    color: "#1877F2",
    label: "Facebook",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073C24 5.406 18.627 0 12 0S0 5.406 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
      </svg>
    ),
  },
  LinkedIn: {
    color: "#0A66C2",
    label: "LinkedIn",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  YouTube: {
    color: "#FF0000",
    label: "YouTube",
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  "Profils Business": {
    color: "#F5C200",
    label: "Profils Business",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
      </svg>
    ),
  },
  "Autres Créateurs": {
    color: "#8B5CF6",
    label: "Autres Créateurs",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
};

// ── Posts data ────────────────────────────────────────────────────────────────
const posts: Post[] = [
  // Facebook
  {
    id: "fb-1",
    platform: "Facebook",
    description: "🚀 Tu veux lancer ton business digital mais tu ne sais pas par où commencer ? Voici la méthode en 3 étapes que j'ai utilisée pour passer de 0 à mes premières ventes en 30 jours.",
    coverGradient: "linear-gradient(135deg, #1877F2 0%, #0D1B5E 100%)",
    postedAt: "2026-03-20T10:00:00Z",
    href: "https://www.facebook.com/profile.php?id=100005386759461",
  },
  {
    id: "fb-2",
    platform: "Facebook",
    description: "💡 L'erreur #1 que font 90% des entrepreneurs débutants : vouloir tout faire en même temps. La clarté, c'est ton meilleur actif. Thread complet ici 👇",
    coverGradient: "linear-gradient(135deg, #0D1B5E 0%, #1877F2 100%)",
    postedAt: "2026-03-17T14:30:00Z",
    href: "https://www.facebook.com/profile.php?id=100005386759461",
  },
  {
    id: "fb-3",
    platform: "Facebook",
    description: "📈 Résultats de mars : +47% de conversions sur mon tunnel en appliquant UNE seule modification. Je t'explique laquelle dans ce post.",
    coverGradient: "linear-gradient(135deg, #1877F2 0%, #6366F1 100%)",
    postedAt: "2026-03-14T09:15:00Z",
    href: "https://www.facebook.com/profile.php?id=100005386759461",
  },
  {
    id: "fb-4",
    platform: "Facebook",
    description: "🎯 Live ce soir à 20h : je réponds à toutes tes questions sur le lancement digital. Pose ta question en commentaire avant 19h30.",
    coverGradient: "linear-gradient(135deg, #1A3FD8 0%, #1877F2 100%)",
    postedAt: "2026-03-10T08:00:00Z",
    href: "https://www.facebook.com/profile.php?id=100005386759461",
  },

  // LinkedIn
  {
    id: "li-1",
    platform: "LinkedIn",
    description: "J'ai analysé 200 offres digitales qui se vendent bien. Voici les 5 caractéristiques communes que j'ai trouvées. Ça m'a pris 3 semaines à compiler.",
    coverGradient: "linear-gradient(135deg, #0A66C2 0%, #0D1B5E 100%)",
    postedAt: "2026-03-21T08:00:00Z",
    href: "https://www.linkedin.com/in/isra%C3%ABl-oriad%C3%A9/",
  },
  {
    id: "li-2",
    platform: "LinkedIn",
    description: "Mon bilan après 2 ans en tant que solopreneur digital : ce que j'ai appris, ce que j'aurais fait différemment, et les chiffres que je n'avais jamais partagés.",
    coverGradient: "linear-gradient(135deg, #0D1B5E 0%, #0A66C2 100%)",
    postedAt: "2026-03-18T11:00:00Z",
    href: "https://www.linkedin.com/in/isra%C3%ABl-oriad%C3%A9/",
  },
  {
    id: "li-3",
    platform: "LinkedIn",
    description: "Le pricing est souvent sous-estimé. Voici comment j'ai triplé la valeur perçue de mon accompagnement sans changer le contenu — juste en repositionnant l'offre.",
    coverGradient: "linear-gradient(135deg, #0A66C2 0%, #1A3FD8 100%)",
    postedAt: "2026-03-12T09:30:00Z",
    href: "https://www.linkedin.com/in/isra%C3%ABl-oriad%C3%A9/",
  },

  // YouTube
  {
    id: "yt-1",
    platform: "YouTube",
    description: "🎬 Comment créer un tunnel de vente qui convertit à froid — Étude de cas complète sur mon tunnel qui génère des ventes automatiquement.",
    coverGradient: "linear-gradient(135deg, #FF0000 0%, #7C0000 100%)",
    postedAt: "2026-03-19T16:00:00Z",
    href: "https://www.youtube.com",
  },
  {
    id: "yt-2",
    platform: "YouTube",
    description: "🎬 Mes 5 outils indispensables pour gérer un business digital solo — revue honnête, avantages et inconvénients de chacun.",
    coverGradient: "linear-gradient(135deg, #7C0000 0%, #FF0000 100%)",
    postedAt: "2026-03-13T15:00:00Z",
    href: "https://www.youtube.com",
  },
  {
    id: "yt-3",
    platform: "YouTube",
    description: "🎬 De 0 à 1 000€/mois en digital : le plan semaine par semaine que j'aurais aimé avoir au départ. Tutoriel complet de 45 minutes.",
    coverGradient: "linear-gradient(135deg, #FF0000 0%, #C2410C 100%)",
    postedAt: "2026-03-06T14:00:00Z",
    href: "https://www.youtube.com",
  },

  // Autres Créateurs
  {
    id: "ac-1",
    platform: "Autres Créateurs",
    description: "📌 Un article de Alex Hormozi sur la structure d'une offre irrésistible. L'un des meilleurs que j'ai lu sur le sujet — à lire absolument si tu veux vendre plus.",
    coverGradient: "linear-gradient(135deg, #7C3AED 0%, #0D1B5E 100%)",
    postedAt: "2026-03-22T07:00:00Z",
    href: "https://www.acquisition.com",
    author: "Alex Hormozi",
  },
  {
    id: "ac-2",
    platform: "Autres Créateurs",
    description: "📌 Thread de Dan Koe sur le modèle 1-personne business. Si tu es solo, ce thread va changer ta vision du business digital pour toujours.",
    coverGradient: "linear-gradient(135deg, #0D1B5E 0%, #8B5CF6 100%)",
    postedAt: "2026-03-16T10:00:00Z",
    href: "https://twitter.com",
    author: "Dan Koe",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  if (months > 0) return `il y a ${months} mois`;
  if (days > 0) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (hours > 0) return `il y a ${hours}h`;
  return `il y a ${minutes}min`;
}

// ── Redirect Modal ────────────────────────────────────────────────────────────
function RedirectModal({ post, onConfirm, onCancel }: { post: Post; onConfirm: () => void; onCancel: () => void }) {
  const config = platformConfig[post.platform];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
    >
      <div className="absolute inset-0" style={{ background: "rgba(2,5,22,0.85)", backdropFilter: "blur(12px)" }} />
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl p-7 text-center"
        style={{
          background: "#08123A",
          border: "1px solid rgba(96,165,250,0.18)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Platform icon */}
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-white"
          style={{ background: config.color + "22", border: `1px solid ${config.color}44`, color: config.color }}
        >
          {config.icon}
        </div>

        <h2 className="mt-4 text-base font-bold text-white">Redirection vers {config.label}</h2>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          Tu vas quitter GrowthMentor et être redirigé vers{" "}
          <span className="font-semibold" style={{ color: config.color }}>{config.label}</span>.
          Veux-tu continuer ?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Non, revenir
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: config.color }}
          >
            Oui, continuer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Favorite hook ─────────────────────────────────────────────────────────────
function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/favoris")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d?.contenus)) setFavorites(d.contenus); })
      .catch(() => {});
  }, []);

  const toggle = (id: string) => {
    const isFav = favorites.includes(id);
    setFavorites((prev) => isFav ? prev.filter((f) => f !== id) : [...prev, id]);
    fetch("/api/favoris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "contenus", id, action: isFav ? "remove" : "add" }),
    }).catch(() => {});
  };

  return { favorites, toggle };
}

// ── Post Card ─────────────────────────────────────────────────────────────────
function PostCard({ post, onRead, isFav, onToggleFav }: {
  post: Post;
  onRead: () => void;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const config = platformConfig[post.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.45)" }}
        transition={{ duration: 0.22 }}
        className="flex flex-col rounded-2xl overflow-hidden h-full"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Cover */}
        <div
          className="relative h-36 w-full shrink-0 flex items-center justify-center"
          style={{ background: post.imageUrl ? undefined : post.coverGradient }}
        >
          {post.imageUrl
            ? <img src={post.imageUrl} alt="" className="h-full w-full object-cover" />
            : <span className="opacity-20" style={{ color: "#fff", transform: "scale(2.5)" }}>{config.icon}</span>
          }
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,11,46,0.6) 0%, transparent 60%)" }} />

          {/* Time badge */}
          <span
            className="absolute bottom-2 left-3 rounded-full px-2 py-0.5 text-xs text-white/70"
            style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
          >
            {timeAgo(post.postedAt)}
          </span>

          {/* Author badge for Autres Créateurs */}
          {post.author && (
            <span
              className="absolute top-2 left-3 rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ background: "rgba(0,0,0,0.5)", color: "#C4B5FD", backdropFilter: "blur(6px)" }}
            >
              {post.author}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <p className="text-sm text-white/70 leading-relaxed flex-1 line-clamp-3">{post.description}</p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRead}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: config.color }}
            >
              Lire
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button
              onClick={onToggleFav}
              aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all"
              style={{
                background: isFav ? "rgba(245,194,0,0.12)" : "rgba(255,255,255,0.06)",
                border: isFav ? "1px solid rgba(245,194,0,0.3)" : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <svg
                className="h-4 w-4 transition-all"
                fill={isFav ? "#F5C200" : "none"}
                viewBox="0 0 24 24"
                stroke={isFav ? "#F5C200" : "rgba(255,255,255,0.45)"}
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0z" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


// ── Business Profiles data ────────────────────────────────────────────────────
const businessProfiles: BusinessProfile[] = [
  {
    id: "bp-1",
    name: "Alex Hormozi",
    domain: "Acquisition & Offres Premium",
    profileHref: "https://www.facebook.com/AlexHormozi",
    avatarGradient: "linear-gradient(135deg, #C2410C 0%, #F5C200 100%)",
    imageUrl: "https://ui-avatars.com/api/?name=Alex+Hormozi&size=128&background=C2410C&color=fff&bold=true",
    rating: 5,
  },
  {
    id: "bp-2",
    name: "Dan Koe",
    domain: "Solopreneuriat & Business Digital",
    profileHref: "https://www.facebook.com/thedankoe",
    avatarGradient: "linear-gradient(135deg, #1A3FD8 0%, #8B5CF6 100%)",
    imageUrl: "https://ui-avatars.com/api/?name=Dan+Koe&size=128&background=1A3FD8&color=fff&bold=true",
    rating: 4,
  },
  {
    id: "bp-3",
    name: "Maxime Lombard",
    domain: "Marketing & Tunnel de Vente",
    profileHref: "https://www.facebook.com",
    avatarGradient: "linear-gradient(135deg, #0D9488 0%, #1A3FD8 100%)",
    imageUrl: "https://ui-avatars.com/api/?name=Maxime+Lombard&size=128&background=0D9488&color=fff&bold=true",
    rating: 3,
  },
  {
    id: "bp-4",
    name: "Simon Squibb",
    domain: "Entrepreneuriat & Investissement",
    profileHref: "https://www.facebook.com/simonsquibb",
    avatarGradient: "linear-gradient(135deg, #7C3AED 0%, #0A66C2 100%)",
    imageUrl: "https://ui-avatars.com/api/?name=Simon+Squibb&size=128&background=7C3AED&color=fff&bold=true",
    rating: 2,
  },
  {
    id: "bp-5",
    name: "Rudy Viard",
    domain: "SEO & Acquisition Organique",
    profileHref: "https://www.facebook.com",
    avatarGradient: "linear-gradient(135deg, #15803D 0%, #0D9488 100%)",
    imageUrl: "https://ui-avatars.com/api/?name=Rudy+Viard&size=128&background=15803D&color=fff&bold=true",
    rating: 4,
  },
  {
    id: "bp-6",
    name: "Nicolas Caron",
    domain: "Vente & Closing",
    profileHref: "https://www.facebook.com",
    avatarGradient: "linear-gradient(135deg, #B45309 0%, #C2410C 100%)",
    imageUrl: "https://ui-avatars.com/api/?name=Nicolas+Caron&size=128&background=B45309&color=fff&bold=true",
    rating: 3,
  },
];

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill={i < rating ? "#F5C200" : "none"}
          stroke={i < rating ? "#F5C200" : "rgba(255,255,255,0.2)"}
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
    </div>
  );
}

// ── Business Profile Card ─────────────────────────────────────────────────────
function BusinessProfileCard({ profile }: { profile: BusinessProfile }) {
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ y: -4, boxShadow: "0 20px 48px rgba(0,0,0,0.45)" }}
        transition={{ duration: 0.22 }}
        className="flex flex-col items-center gap-4 rounded-2xl p-6 text-center"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Avatar photo */}
        <div className="relative h-20 w-20 shrink-0">
          {profile.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt={profile.name}
              className="h-full w-full rounded-full object-cover"
              style={{ border: "2px solid rgba(255,255,255,0.12)" }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: profile.avatarGradient, border: "2px solid rgba(255,255,255,0.12)" }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p className="font-bold text-white">{profile.name}</p>
          <p className="mt-1 text-xs text-white/45 leading-relaxed">{profile.domain}</p>
          <div className="mt-2 flex justify-center">
            <Stars rating={profile.rating} />
          </div>
        </div>

        {/* Facebook CTA */}
        <a
          href={profile.profileHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02]"
          style={{ background: "#1877F222", border: "1px solid #1877F244", color: "#93C5FD" }}
        >
          Découvrir
        </a>
      </motion.div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
const platformOrder: Platform[] = ["Facebook", "LinkedIn", "YouTube", "Autres Créateurs", "Profils Business"];

export default function ContenusPage() {
  const [activeTab, setActiveTab] = useState<Platform>("Facebook");
  const [redirectPost, setRedirectPost] = useState<Post | null>(null);
  const { favorites, toggle } = useFavorites();
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/contenus?type=post")
      .then((r) => r.json())
      .then((data) => setAllPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const activePosts = allPosts.filter((p) => p.platform === activeTab);
  const config = platformConfig[activeTab];

  const handleConfirmRedirect = () => {
    if (redirectPost) {
      window.open(redirectPost.href, "_blank", "noopener,noreferrer");
      setRedirectPost(null);
    }
  };

  return (
    <div className="relative min-h-screen" style={{ background: "#03071A" }}>
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}
          >
            Contenus
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Mes derniers contenus
          </h1>
          <p className="mt-3 mx-auto max-w-xl text-white/50">
            Retrouve tous mes posts, vidéos et partages classés par plateforme. Sauvegarde les contenus que tu veux relire plus tard.
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="mb-10 flex items-center gap-1 overflow-x-auto">
          {platformOrder.map((platform) => {
            const cfg = platformConfig[platform];
            const isActive = activeTab === platform;
            return (
              <button
                key={platform}
                onClick={() => setActiveTab(platform)}
                className="relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
                style={{
                  background: isActive ? cfg.color + "18" : "transparent",
                  color: isActive ? cfg.color : "rgba(255,255,255,0.45)",
                  border: isActive ? `1px solid ${cfg.color}35` : "1px solid transparent",
                }}
              >
                <span style={{ color: isActive ? cfg.color : "rgba(255,255,255,0.35)" }}>
                  {cfg.icon}
                </span>
                {cfg.label}
                {isActive && (
                  <motion.span
                    layoutId="content-tab-indicator"
                    className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                    style={{ background: cfg.color }}
                    transition={{ duration: 0.22 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Active section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {/* Section header */}
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl"
                style={{ background: config.color + "18", color: config.color }}
              >
                {config.icon}
              </div>
              <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                {activeTab === "Profils Business"
                  ? `${businessProfiles.length} profil${businessProfiles.length > 1 ? "s" : ""}`
                  : `${activePosts.length} post${activePosts.length > 1 ? "s" : ""}`}
              </span>
            </div>

            {activeTab === "Profils Business" ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {businessProfiles.map((profile) => (
                  <BusinessProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {activePosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onRead={() => setRedirectPost(post)}
                    isFav={favorites.includes(post.id)}
                    onToggleFav={() => toggle(post.id)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Redirect modal */}
      <AnimatePresence>
        {redirectPost && (
          <RedirectModal
            post={redirectPost}
            onConfirm={handleConfirmRedirect}
            onCancel={() => setRedirectPost(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
