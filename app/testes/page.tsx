"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ExternalLink } from "lucide-react";
import Link from "next/link";
import { tools } from "@/lib/tools-data";
import TrackView from "@/components/track-view";

const BG = "#03071A";
const PARTICLE_COUNT = 70;

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = 0, h = 0;
    const FRAME_MS = 1000 / 30;
    let lastFrame = 0;
    let raf = 0;
    let paused = false;

    type Particle = { x: number; y: number; vx: number; vy: number; r: number; phase: number; speed: number };
    let particles: Particle[] = [];

    function init() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.2 + 0.05),
        r: Math.random() * 1.5 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01,
      }));
    }

    function draw(ts: number) {
      if (paused) { raf = requestAnimationFrame(draw); return; }
      if (ts - lastFrame < FRAME_MS) { raf = requestAnimationFrame(draw); return; }
      lastFrame = ts;

      ctx!.fillStyle = BG;
      ctx!.fillRect(0, 0, w, h);

      const t = ts * 0.001;
      for (const p of particles) {
        p.x += p.vx + Math.sin(t * p.speed + p.phase) * 0.4;
        p.y += p.vy;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;

        const alpha = 0.3 + 0.3 * Math.sin(t * 1.2 + p.phase);
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(52,211,153,${alpha})`;
        ctx!.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    const onResize = () => init();
    const onVis = () => { paused = document.hidden; };

    init();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < rating ? "#F5C200" : "none"} stroke={i < rating ? "#F5C200" : "rgba(255,255,255,0.25)"} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Productivité": "bg-violet-500/20 text-violet-300",
  "Email Marketing": "bg-rose-500/20 text-rose-300",
  "Design": "bg-cyan-500/20 text-cyan-300",
  "Tunnel de Vente": "bg-blue-500/20 text-blue-300",
  "Intelligence Artificielle": "bg-emerald-500/20 text-emerald-300",
  "Vidéo & Communication": "bg-indigo-500/20 text-indigo-300",
};

const categories = ["Tous", ...Array.from(new Set(tools.map(t => t.category)))];

export default function TestesPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("gm_tool_favorites") || "[]");
      setFavorites(saved);
    } catch {}
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function toggleFavorite(slug: string) {
    setFavorites(prev => {
      const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug];
      localStorage.setItem("gm_tool_favorites", JSON.stringify(next));
      return next;
    });
  }

  const filtered = activeCategory === "Tous" ? tools : tools.filter(t => t.category === activeCategory);

  return (
    <div className="relative min-h-screen" style={{ background: BG }}>
      <FloatingParticles />
      <div className="relative z-10 px-4 py-12 max-w-6xl mx-auto">
        <TrackView label="Outils testés" />

        {/* Hero */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-4">
            Outils Testés
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Ma sélection d&apos;outils validés
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Chaque outil a été testé en conditions réelles. Tu trouves ici les meilleurs pour accélérer ton business.
          </p>
        </div>

        {/* Filter button + tag panel */}
        <div className="mb-8" ref={filterRef}>
          <button
            onClick={() => setFilterOpen(v => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all"
            style={{
              background: filterOpen || activeCategory !== "Tous" ? "linear-gradient(135deg, #059669 0%, #34D399 100%)" : "rgba(255,255,255,0.05)",
              border: filterOpen || activeCategory !== "Tous" ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg className="h-4 w-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            {activeCategory !== "Tous" && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold" style={{ background: "#F5C200", color: "#000" }}>1</span>
            )}
          </button>

          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className="flex flex-wrap gap-2 rounded-2xl p-4"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: activeCategory === cat ? "rgba(52,211,153,0.18)" : "rgba(255,255,255,0.04)",
                        color: activeCategory === cat ? "#34D399" : "rgba(255,255,255,0.4)",
                        border: activeCategory === cat ? "1px solid rgba(52,211,153,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
          {filtered.map((tool, i) => {
            const isFav = favorites.includes(tool.slug);
            const catColor = CATEGORY_COLORS[tool.category] ?? "bg-slate-500/20 text-slate-300";
            return (
              <motion.article
                key={tool.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col"
              >
                {/* Logo / Image banner */}
                <div
                  className="h-36 flex items-center justify-center relative overflow-hidden"
                  style={{ background: tool.logoGradient }}
                >
                  {tool.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tool.imageUrl} alt={tool.name} className="h-16 object-contain drop-shadow-lg" />
                  ) : (
                    <span className="text-4xl font-black text-white/90 drop-shadow-lg tracking-tight">
                      {tool.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  {/* Favorite button */}
                  <button
                    onClick={() => toggleFavorite(tool.slug)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 transition-transform hover:scale-110"
                    aria-label="Ajouter aux favoris"
                  >
                    <Heart
                      size={14}
                      fill={isFav ? "#f43f5e" : "none"}
                      stroke={isFav ? "#f43f5e" : "rgba(255,255,255,0.7)"}
                    />
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-white leading-tight">{tool.name}</h2>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${catColor}`}>
                      {tool.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Stars rating={tool.rating} />
                    <span className="text-xs text-slate-400">{tool.rating}/5</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed flex-1">{tool.tagline}</p>

                  <div className="flex gap-2 mt-1">
                    <Link
                      href={`/testes/${tool.slug}`}
                      className="flex-1 text-center rounded-lg bg-emerald-500 hover:bg-emerald-400 transition-colors px-3 py-2 text-xs font-semibold text-slate-950"
                    >
                      Détails
                    </Link>
                    <a
                      href={tool.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border border-white/10 hover:border-white/25 transition-colors px-3 py-2 text-xs text-slate-300"
                    >
                      <ExternalLink size={12} />
                      Essayer
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
