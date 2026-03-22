"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { formationCards, type FormationCard } from "@/lib/site-data";

// ─── Wave Grid Canvas ────────────────────────────────────────────────────────
const COLS = 28;
const ROWS = 18;
const GAP = 38;

function WaveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const offsetX = (canvas.width - (COLS - 1) * GAP) / 2;
      const offsetY = (canvas.height - (ROWS - 1) * GAP) / 2;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const wave = Math.sin(col * 0.5 + row * 0.4 + t * 0.9) * 0.5 + 0.5;
          const alpha = 0.06 + wave * 0.22;
          const radius = 1.2 + wave * 1.4;
          ctx.beginPath();
          ctx.arc(offsetX + col * GAP, offsetY + row * GAP, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(96,165,250,${alpha})`;
          ctx.fill();
        }
      }
      rafId = requestAnimationFrame((ts) => draw(ts / 1000));
    };
    rafId = requestAnimationFrame((ts) => draw(ts / 1000));

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const typeColor: Record<FormationCard["type"], string> = {
  Formation: "#14B8A6",
  Masterclass: "#F5C200",
  Accompagnement: "#A855F7",
};

const filters = ["Tous", "Formation", "Masterclass", "Accompagnement"] as const;

function FavoriteButton({ id }: { id: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <button
      aria-label={saved ? "Retirer des favoris" : "Ajouter aux favoris"}
      onClick={(e) => { e.stopPropagation(); setSaved((v) => !v); }}
      className="flex h-8 w-8 items-center justify-center rounded-full transition-colors"
      style={{ background: "rgba(255,255,255,0.07)" }}
    >
      <svg viewBox="0 0 24 24" fill={saved ? "#F5C200" : "none"} stroke={saved ? "#F5C200" : "rgba(255,255,255,0.5)"} strokeWidth={1.8} className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
      </svg>
    </button>
  );
}

// ─── Modules Preview Modal ───────────────────────────────────────────────────
function ModulesModal({ f, onClose }: { f: FormationCard; onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-end justify-center sm:items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(2,5,22,0.9)", backdropFilter: "blur(16px)" }} />

      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl"
        style={{
          background: "#060E35",
          border: "1px solid rgba(96,165,250,0.18)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
          maxHeight: "88vh",
          overflowY: "auto",
        }}
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: "#060E35", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest">Aperçu des modules</p>
            <h3 className="mt-0.5 text-base font-bold text-white">{f.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white/40 transition-colors hover:text-white/80"
            style={{ background: "rgba(255,255,255,0.06)" }}
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        {/* Modules accordion */}
        <div className="p-4 space-y-2">
          {f.modules.map((mod, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl"
              style={{ border: "1px solid rgba(96,165,250,0.12)" }}
            >
              {/* Module header */}
              <button
                className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors"
                style={{ background: open === i ? "rgba(26,63,216,0.15)" : "rgba(255,255,255,0.03)" }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{
                      background: open === i ? "linear-gradient(135deg, #1A3FD8, #3B82F6)" : "rgba(96,165,250,0.12)",
                      color: open === i ? "#fff" : "#60A5FA",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">{mod.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/30">{mod.lessons.length} leçons</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4 shrink-0 text-white/40 transition-transform"
                    style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Lessons */}
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <ul
                      className="px-4 pb-3 pt-1 space-y-1"
                      style={{ borderTop: "1px solid rgba(96,165,250,0.08)" }}
                    >
                      {mod.lessons.map((lesson, j) => (
                        <li key={j} className="flex items-center gap-2.5 py-1.5 text-sm text-white/60">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4 shrink-0 text-white/25">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                          </svg>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div
          className="sticky bottom-0 px-6 py-4"
          style={{ background: "#060E35", borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Link
            href={f.href}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
          >
            Je me lance ! — {f.price}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
function FormationModal({ f, onClose }: { f: FormationCard; onClose: () => void }) {
  const [showModules, setShowModules] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(4,8,32,0.85)", backdropFilter: "blur(12px)" }} />

      <motion.div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl"
        style={{
          background: "#08123A",
          border: "1px solid rgba(96,165,250,0.18)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div
          className="relative h-40 w-full"
          style={{ background: f.image ? undefined : f.coverGradient }}
        >
          {f.image && <img src={f.image} alt={f.title} className="h-full w-full object-cover" />}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #08123A 0%, transparent 60%)" }} />

          {/* Promo badge */}
          {f.promo && (
            <span
              className="absolute left-4 top-4 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
              style={{ background: "#F5C200", color: "#0D1B5E" }}
            >
              {f.promo}
            </span>
          )}

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(0,0,0,0.4)", color: "rgba(255,255,255,0.7)" }}
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Type + title */}
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
              style={{ background: "rgba(96,165,250,0.10)", color: typeColor[f.type] }}
            >
              {f.type}
            </span>
          </div>
          <h2 className="mt-2 text-xl font-bold text-white">{f.title}</h2>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs text-white/40">Durée</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{f.period}</p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs text-white/40">Validité</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{f.validityPeriod}</p>
            </div>
            <div
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs text-white/40">Membres</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{f.members.toLocaleString("fr")}</p>
            </div>
          </div>

          {/* Promo info */}
          {f.promo && f.originalPrice && (
            <div
              className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: "rgba(245,194,0,0.08)", border: "1px solid rgba(245,194,0,0.2)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#F5C200" strokeWidth={1.8} className="h-5 w-5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <p className="text-sm text-white/80">
                Offre spéciale <span className="font-semibold text-[#F5C200]">{f.promo}</span> — au lieu de{" "}
                <span className="line-through text-white/40">{f.originalPrice}</span>
              </p>
            </div>
          )}

          {/* Aperçu des modules */}
          <button
            onClick={(e) => { e.stopPropagation(); setShowModules(true); }}
            className="mt-5 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            style={{
              background: "rgba(96,165,250,0.07)",
              border: "1px solid rgba(96,165,250,0.15)",
              color: "#93C5FD",
            }}
          >
            <span className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
              </svg>
              Aperçu des modules
              <span className="rounded-full px-1.5 py-0.5 text-xs" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
                {f.modules.length}
              </span>
            </span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>

          {/* Advantages */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/35 mb-3">Ce que tu obtiens</h3>
            <ul className="space-y-2.5">
              {f.advantages.map((a) => (
                <li key={a} className="flex items-start gap-2.5 text-sm text-white/70">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth={2.2} className="mt-0.5 h-4 w-4 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </div>

          {/* Members social proof */}
          <p className="mt-6 text-center text-xs text-white/35">
            {f.members.toLocaleString("fr")} personnes ont déjà accès à ce programme
          </p>

          {/* CTA */}
          <div className="mt-5 flex items-center justify-between gap-3">
            <div>
              {f.originalPrice && (
                <p className="text-xs text-white/35 line-through">{f.originalPrice}</p>
              )}
              <p className="text-2xl font-bold text-white">{f.price}</p>
            </div>
            <Link
              href={f.href}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
            >
              Je me lance !
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Nested modules modal */}
      <AnimatePresence>
        {showModules && <ModulesModal f={f} onClose={() => setShowModules(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function FormationCard({ f, onDetail }: { f: FormationCard; onDetail: () => void }) {
  const isFree = f.price === "Gratuit";

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(0,0,0,0.5)" }}
      transition={{ duration: 0.22 }}
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(96,165,250,0.13)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Cover */}
      <div
        className="relative h-44 w-full shrink-0 overflow-hidden"
        style={{ background: f.image ? undefined : f.coverGradient }}
      >
        {f.image && <img src={f.image} alt={f.title} className="h-full w-full object-cover" />}

        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,11,46,0.7) 0%, transparent 60%)" }} />

        {/* Type badge */}
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide backdrop-blur-sm"
          style={{ background: "rgba(6,11,46,0.6)", color: typeColor[f.type], border: `1px solid ${typeColor[f.type]}30` }}
        >
          {f.type}
        </span>

        {/* Promo badge */}
        {f.promo && (
          <span
            className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-xs font-bold uppercase"
            style={{ background: "#F5C200", color: "#0D1B5E" }}
          >
            {f.promo}
          </span>
        )}

        {/* Period bottom-left */}
        <span className="absolute bottom-2 left-3 flex items-center gap-1 text-xs text-white/70">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          {f.period}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h2 className="text-base font-bold text-white leading-snug">{f.title}</h2>

        {/* Members */}
        <p className="text-xs text-white/35">
          {f.members.toLocaleString("fr")} personnes ont accès
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span
            className="rounded-lg px-2.5 py-1 text-sm font-bold"
            style={{ background: "#0D1B5E", color: isFree ? "#4ADE80" : "#93C5FD" }}
          >
            {f.price}
          </span>
          {f.originalPrice && (
            <span className="text-xs text-white/30 line-through">{f.originalPrice}</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 border-t border-white/08 pt-3">
          <FavoriteButton id={f.id} />
          <button
            onClick={onDetail}
            className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors"
            style={{
              background: "rgba(96,165,250,0.08)",
              color: "#93C5FD",
              border: "1px solid rgba(96,165,250,0.15)",
            }}
          >
            Détails
          </button>
          <Link
            href={f.href}
            className="flex-1 rounded-lg py-2 text-center text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
          >
            Accéder
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Sort helpers ─────────────────────────────────────────────────────────────
type SortKey = "default" | "recent" | "price-asc" | "price-desc";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "recent",     label: "Du plus récent au plus ancien" },
  { key: "price-asc",  label: "Prix croissant" },
  { key: "price-desc", label: "Prix décroissant" },
];

function parsePrice(price: string): number {
  if (price === "Gratuit") return 0;
  return parseInt(price.replace(/[^\d]/g, ""), 10) || 0;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FormationsPage() {
  const [activeFilter, setActiveFilter] = useState<typeof filters[number]>("Tous");
  const [activeSort, setActiveSort] = useState<SortKey>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<FormationCard | null>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = (() => {
    const base = formationCards.filter(
      (f) => activeFilter === "Tous" || f.type === activeFilter
    );
    if (activeSort === "recent") return [...base].reverse();
    if (activeSort === "price-asc") return [...base].sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    if (activeSort === "price-desc") return [...base].sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    return base;
  })();

  return (
    <div className="relative min-h-screen" style={{ background: "#060B2E" }}>
      <WaveGrid />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:px-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-14"
        >
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}
          >
            Formations & Programmes
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Choisis ton programme
          </h1>
          <p className="mt-3 max-w-xl text-white/50">
            Formations, masterclasses et accompagnements pour lancer et scaler ton business digital.
          </p>
        </motion.div>

        {/* Filter bar */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: activeFilter === f ? "#60A5FA" : "rgba(255,255,255,0.50)" }}
              >
                {f}
                {activeFilter === f && (
                  <motion.span
                    layoutId="formation-filter-bar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "#3B82F6" }}
                    transition={{ duration: 0.22 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Sort button */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              style={{
                background: sortOpen || activeSort !== "default" ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${sortOpen || activeSort !== "default" ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.10)"}`,
                color: activeSort !== "default" ? "#60A5FA" : "rgba(255,255,255,0.60)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h18M6 12h12M9 16.5h6" />
              </svg>
              Trier
              {activeSort !== "default" && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#3B82F6" }} />
              )}
            </button>

            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-xl py-1"
                  style={{
                    background: "#0A1240",
                    border: "1px solid rgba(96,165,250,0.18)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => { setActiveSort(opt.key); setSortOpen(false); }}
                      className="flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors"
                      style={{
                        color: activeSort === opt.key ? "#60A5FA" : "rgba(255,255,255,0.65)",
                        background: activeSort === opt.key ? "rgba(96,165,250,0.08)" : "transparent",
                      }}
                    >
                      {opt.label}
                      {activeSort === opt.key && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={2.5} className="h-4 w-4 shrink-0">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                  ))}

                  {activeSort !== "default" && (
                    <>
                      <div className="mx-3 my-1 border-t border-white/08" />
                      <button
                        onClick={() => { setActiveSort("default"); setSortOpen(false); }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Réinitialiser
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Grid */}
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((f, i) => (
              <motion.div
                key={f.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <FormationCard f={f} onDetail={() => setSelected(f)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="mt-20 text-center text-white/35">Aucun programme pour ce filtre.</p>
        )}

        {/* CTA diagnostic */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-20 rounded-2xl p-8 text-center"
          style={{
            background: "rgba(26,63,216,0.10)",
            border: "1px solid rgba(96,165,250,0.13)",
          }}
        >
          <h2 className="text-2xl font-bold text-white">Pas sûr de par où commencer ?</h2>
          <p className="mt-2 text-white/45">
            Fais le diagnostic gratuit et reçois une recommandation personnalisée selon ton profil.
          </p>
          <Link
            href="/diagnostic"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
          >
            Faire le diagnostic gratuit
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <FormationModal f={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
