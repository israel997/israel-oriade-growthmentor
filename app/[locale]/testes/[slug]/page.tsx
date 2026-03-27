"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Rocket, ExternalLink, DollarSign, Tag } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Tool } from "@/lib/tools-data";

const BG = "#03071A";

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

    type P = { x: number; y: number; vx: number; vy: number; r: number; phase: number; speed: number };
    let pts: P[] = [];

    function init() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      pts = Array.from({ length: 50 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
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
      for (const p of pts) {
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

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < rating ? "#F5C200" : "none"} stroke={i < rating ? "#F5C200" : "rgba(255,255,255,0.25)"} strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-slate-400">{rating}/5</span>
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "Productivité": "bg-violet-500/20 text-violet-300 border-violet-500/30",
  "Email Marketing": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Design": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Tunnel de Vente": "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Intelligence Artificielle": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "Vidéo & Communication": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

type TabId = "features" | "pros" | "cons" | "tip" | "howToTry";

const TAB_CONFIG: { id: TabId; label: string; color: string; icon: React.ReactNode }[] = [
  { id: "features",  label: "Fonctionnalités", color: "#34D399", icon: <Tag size={15} /> },
  { id: "pros",      label: "Avantages",        color: "#4ADE80", icon: <CheckCircle2 size={15} /> },
  { id: "cons",      label: "Inconvénients",    color: "#FB7185", icon: <XCircle size={15} /> },
  { id: "tip",       label: "Tip",              color: "#FCD34D", icon: <Lightbulb size={15} /> },
  { id: "howToTry",  label: "Comment essayer",  color: "#6EE7B7", icon: <Rocket size={15} /> },
];

export default function ToolDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: session, status } = useSession();
  const [tool, setTool] = useState<Tool | null | undefined>(undefined);
  const [isFav, setIsFav] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("features");

  useEffect(() => {
    fetch(`/api/outils/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setTool(data ?? null))
      .catch(() => setTool(null));
    fetch("/api/favoris")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d?.outils)) setIsFav(d.outils.includes(slug)); })
      .catch(() => {});
  }, [slug]);

  function toggleFav() {
    if (!tool) return;
    const next = !isFav;
    setIsFav(next);
    fetch("/api/favoris", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: "outils", id: tool.slug, action: next ? "add" : "remove" }),
    }).catch(() => {});
  }

  // Auth gate — details require an account
  if (status === "loading") return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: "#03071A" }}>
      <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
    </div>
  );

  if (!session?.user) return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: "#03071A" }}>
      <FloatingParticles />
      <div className="relative rounded-2xl p-10 max-w-md w-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl mb-5"
          style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }}>
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#34D399" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Compte requis</h2>
        <p className="text-sm text-white/50 leading-relaxed mb-6">
          Crée ton compte gratuit pour accéder aux détails complets des outils testés (avis, avantages, inconvénients, tips).
        </p>
        <Link href="/connexion"
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white mb-3"
          style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
          Créer mon compte gratuit
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
        <Link href="/testes" className="text-xs text-white/30 hover:text-white/50 transition-colors">
          ← Retour aux outils
        </Link>
      </div>
    </div>
  );

  if (tool === undefined) return (
    <div className="relative min-h-screen flex items-center justify-center" style={{ background: "#03071A" }}>
      <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
    </div>
  );
  if (!tool) return notFound();

  const catColor = CATEGORY_COLORS[tool.category] ?? "bg-slate-500/20 text-slate-300 border-slate-500/30";
  const activeConfig = TAB_CONFIG.find(t => t.id === activeTab)!;

  return (
    <div className="relative min-h-screen" style={{ background: BG }}>
      <FloatingParticles />

      <div className="relative z-10 px-4 py-10 max-w-3xl mx-auto">
        {/* Back */}
        <Link href="/testes" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft size={15} />
          Retour aux outils
        </Link>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden mb-8"
        >
          {/* Banner */}
          <div
            className="h-40 flex items-center justify-center"
            style={{ background: tool.logoGradient }}
          >
            {tool.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tool.imageUrl} alt={tool.name} className="h-20 object-contain drop-shadow-xl" />
            ) : (
              <span className="text-6xl font-black text-white/90 drop-shadow-xl tracking-tight">
                {tool.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">{tool.name}</h1>
                <p className="text-slate-400 text-sm mt-1">{tool.tagline}</p>
              </div>
              <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${catColor}`}>
                {tool.category}
              </span>
            </div>

            <Stars rating={tool.rating} />

            <div className="flex items-center gap-2 text-sm text-slate-400">
              <DollarSign size={14} className="text-emerald-400" />
              <span>{tool.price}</span>
            </div>

            <div className="flex gap-3 pt-1">
              <a
                href={tool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition-colors px-4 py-2.5 text-sm font-semibold text-slate-950"
              >
                <ExternalLink size={14} />
                Essayer l&apos;outil
              </a>
              <button
                onClick={toggleFav}
                className="flex items-center gap-2 rounded-lg border border-white/10 hover:border-white/25 transition-colors px-4 py-2.5 text-sm text-slate-300"
              >
                <svg viewBox="0 0 24 24" fill={isFav ? "#F5C200" : "none"} stroke={isFav ? "#F5C200" : "currentColor"} strokeWidth={1.8} className="h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                {isFav ? "Sauvegardé" : "Favoris"}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto mb-6">
          {TAB_CONFIG.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-xs font-semibold transition-all"
                style={{
                  background: isActive ? tab.color + "18" : "transparent",
                  color: isActive ? tab.color : "rgba(255,255,255,0.45)",
                  border: isActive ? `1px solid ${tab.color}35` : "1px solid transparent",
                }}
              >
                <span style={{ color: isActive ? tab.color : "rgba(255,255,255,0.35)" }}>
                  {tab.icon}
                </span>
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="tool-tab-indicator"
                    className="absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full"
                    style={{ background: tab.color }}
                    transition={{ duration: 0.22 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="rounded-2xl border bg-white/5 backdrop-blur-sm p-6"
            style={{ borderColor: activeConfig.color + "30" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <span style={{ color: activeConfig.color }}>{activeConfig.icon}</span>
              <h2 className="text-base font-bold text-white">{activeConfig.label}</h2>
            </div>

            {(activeTab === "features" || activeTab === "pros" || activeTab === "cons") && (
              <ul className="space-y-3">
                {(activeTab === "features" ? tool.features : activeTab === "pros" ? tool.pros : tool.cons).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    {activeTab === "cons"
                      ? <XCircle size={15} className="shrink-0 mt-0.5" style={{ color: activeConfig.color }} />
                      : <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: activeConfig.color }} />
                    }
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "tip" && (
              <p className="text-sm text-slate-300 leading-relaxed">{tool.tip}</p>
            )}

            {activeTab === "howToTry" && (
              <>
                <p className="text-sm text-slate-300 leading-relaxed">{tool.howToTry}</p>
                <a
                  href={tool.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition-colors px-4 py-2.5 text-sm font-semibold text-slate-950"
                >
                  <ExternalLink size={14} />
                  Accéder à {tool.name}
                </a>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
