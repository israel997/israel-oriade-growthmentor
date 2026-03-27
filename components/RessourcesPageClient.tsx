"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import WaveGridBg from "@/components/wave-grid-bg";

const typeFilters = ["Tous", "Gratuit", "Payant", "Ebook", "Template", "Checklist"];
const topicFilters = ["Business", "Création de Contenu", "Vente", "Marketing", "Social Media", "Développement personnel", "Design", "Tech"];

type Resource = {
  id: string; title: string; desc: string; fullDesc: string;
  category: string; type: string; topic: string; author: string;
  rating: number; downloads: number; downloadHref: string; detailHref: string;
  gradient: string; iconType?: string; price?: string;
};

function getIcon(iconType?: string) {
  const cls = "h-10 w-10 text-white/80";
  switch (iconType) {
    case "check-circle": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
    case "layout": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M12 12.75l3-3-3-3" /></svg>;
    case "bulb": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>;
    case "image": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>;
    case "sparkles": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>;
    case "lightning": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>;
    case "chart": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M12 12.75l3-3-3-3" /></svg>;
    case "brush": return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" /></svg>;
    default: return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>;
  }
}


function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="h-4 w-4" viewBox="0 0 20 20"
          fill={s <= Math.round(rating) ? "#F5C200" : "none"}
          stroke={s <= Math.round(rating) ? "#F5C200" : "rgba(255,255,255,0.2)"}
          strokeWidth={1.5}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-semibold text-white">{rating}</span>
    </div>
  );
}

function ResourceModal({ r, onClose, onDownload }: { r: Resource; onClose: () => void; onDownload: (href: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(3,7,26,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl"
        style={{ background: "#0A1240", border: "1px solid rgba(96,165,250,0.15)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div className="relative flex items-center justify-center" style={{ background: r.gradient, height: "140px" }}>
          {getIcon(r.iconType)}
          <span className="absolute top-4 left-4 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white/90"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
            {r.category}
          </span>
          <button onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-white/20"
            style={{ background: "rgba(0,0,0,0.35)" }}>
            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-7 space-y-5">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#60A5FA" }}>{r.topic}</p>
            <h2 className="text-xl font-bold text-white leading-snug">{r.title}</h2>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-2">Description</p>
            <p className="text-sm text-white/60 leading-relaxed">{r.fullDesc}</p>
          </div>

          {/* Auteur */}
          <div className="flex items-center gap-3 rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)", color: "#fff" }}>
              {r.author.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-white/30">Auteur</p>
              <p className="text-sm font-semibold text-white">{r.author}</p>
            </div>
          </div>

          {/* Rating + Downloads */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs text-white/30 mb-2">Recommandation</p>
              <Stars rating={r.rating} />
            </div>
            <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p className="text-xs text-white/30 mb-2">Téléchargements</p>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span className="text-lg font-bold text-white">{r.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => { onDownload(r.downloadHref); onClose(); }}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01]"
            style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
          >
            {"price" in r && r.price ? `Acheter — ${r.price}` : "Télécharger gratuitement"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function HeartButton({ id }: { id: string }) {
  const [liked, setLiked] = useState(false);
  return (
    <button
      onClick={() => setLiked((v) => !v)}
      aria-label="Ajouter aux favoris"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all"
      style={{
        background: liked ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)",
        border: liked ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <svg className="h-4 w-4 transition-all" fill={liked ? "#EF4444" : "none"} viewBox="0 0 24 24" stroke={liked ? "#EF4444" : "rgba(255,255,255,0.5)"} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
      </svg>
    </button>
  );
}

function ResourceCard({ r, i, onDetail, onDownload }: { r: Resource; i: number; onDetail: () => void; onDownload: (href: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.07, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.22 }}
        onClick={onDetail}
        className="flex flex-col rounded-2xl overflow-hidden h-full cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Cover */}
        <div className="relative flex items-center justify-center" style={{ background: r.gradient, height: "160px" }}>
          {getIcon(r.iconType)}
          <span className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white/90"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)" }}>
            {r.category}
          </span>
          <span className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-bold"
            style={{
              background: "#0D1B5E",
              color: "#93C5FD",
              border: "1px solid rgba(96,165,250,0.2)",
            }}>
            {"price" in r && r.price ? r.price : r.type}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <span className="text-xs font-medium mb-2" style={{ color: "#60A5FA" }}>{r.topic}</span>
          <h3 className="font-bold text-white leading-snug">{r.title}</h3>
          <p className="mt-2 text-sm text-white/50 leading-relaxed flex-1">{r.desc}</p>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={onDetail}
              className="flex-1 rounded-xl py-2.5 text-center text-xs font-semibold text-white/80 transition-all hover:text-white"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Voir les détails
            </button>
            <button
              onClick={() => onDownload(r.downloadHref)}
              className="flex-1 rounded-xl py-2.5 text-center text-xs font-semibold text-white transition-transform hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
            >
              {"price" in r && r.price ? "Acheter" : "Télécharger"}
            </button>
            <HeartButton id={r.id} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}


function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 py-2 text-sm font-medium transition-colors"
      style={{ color: active ? "#60A5FA" : "rgba(255,255,255,0.50)" }}
    >
      {label}
      {active && (
        <motion.span
          layoutId="ressources-filter-bar"
          className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
          style={{ background: "#3B82F6" }}
          transition={{ duration: 0.22 }}
        />
      )}
    </button>
  );
}

// ── Login Required Modal ─────────────────────────────────────────────────────
const FREE_DOWNLOAD_KEY = "gm_free_downloads";
const FREE_DOWNLOAD_LIMIT = 2;

function getFreeDownloadCount(): number {
  try { return parseInt(localStorage.getItem(FREE_DOWNLOAD_KEY) ?? "0", 10) || 0; }
  catch { return 0; }
}
function incrementFreeDownloadCount(): number {
  const next = getFreeDownloadCount() + 1;
  try { localStorage.setItem(FREE_DOWNLOAD_KEY, String(next)); } catch {}
  return next;
}

function AuthGateModal({ exhausted, onClose }: { exhausted: boolean; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(2,5,22,0.85)", backdropFilter: "blur(12px)" }} />
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl p-7 text-center"
        style={{
          background: "#08123A",
          border: exhausted ? "1px solid rgba(245,194,0,0.25)" : "1px solid rgba(96,165,250,0.18)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        }}
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/30 transition-colors hover:text-white/70"
          aria-label="Fermer"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M6 6l12 12M18 6l-12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{
            background: exhausted ? "rgba(245,194,0,0.1)" : "rgba(96,165,250,0.1)",
            border: exhausted ? "1px solid rgba(245,194,0,0.25)" : "1px solid rgba(96,165,250,0.2)",
          }}>
          {exhausted ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#F5C200" strokeWidth={1.8} className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth={1.8} className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 0 1 21.75 8.25Z" />
            </svg>
          )}
        </div>

        {exhausted ? (
          <>
            <h2 className="mt-4 text-lg font-bold text-white">Limite atteinte</h2>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Tu as utilisé tes <span className="text-yellow-400 font-semibold">2 téléchargements gratuits</span>. Crée ton compte pour accéder à toutes les ressources sans limite.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-lg font-bold text-white">Connexion requise</h2>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">
              Connecte-toi pour télécharger ou acheter des ressources.
            </p>
          </>
        )}

        <Link
          href="/connexion"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{ background: exhausted ? "linear-gradient(135deg, #B45309 0%, #F5C200 100%)" : "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
        >
          {exhausted ? "Créer mon compte gratuit" : "Se connecter"}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>

        <button onClick={onClose} className="mt-3 text-xs text-white/30 hover:text-white/50 transition-colors">
          Continuer sans connexion
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function RessourcesPage() {
  const { data: authSession } = useSession();
  const [activeType, setActiveType] = useState("Tous");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalExhausted, setAuthModalExhausted] = useState(false);
  const [ressourcesData, setRessourcesData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [freeCount, setFreeCount] = useState(0);

  useEffect(() => {
    setFreeCount(getFreeDownloadCount());
    fetch("/api/ressources")
      .then((r) => r.json())
      .then((data) => setRessourcesData(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const isLoggedIn = !!authSession?.user;

  const handleDownload = (href: string) => {
    if (isLoggedIn) {
      window.open(href, "_blank");
      return;
    }
    const count = getFreeDownloadCount();
    if (count < FREE_DOWNLOAD_LIMIT) {
      const next = incrementFreeDownloadCount();
      setFreeCount(next);
      window.open(href, "_blank");
    } else {
      setAuthModalExhausted(true);
      setShowAuthModal(true);
    }
  };

  const filtered = ressourcesData.filter((r) => {
    const typeMatch = activeType === "Tous" || r.category === activeType || r.type === activeType;
    const topicMatch = !activeTopic || r.topic === activeTopic;
    return typeMatch && topicMatch;
  });

  return (
    <div className="min-h-screen" style={{ background: "#03071A" }}>
      <AnimatePresence>
        {selectedResource && (
          <ResourceModal r={selectedResource} onClose={() => setSelectedResource(null)} onDownload={handleDownload} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAuthModal && (
          <AuthGateModal
            exhausted={authModalExhausted}
            onClose={() => { setShowAuthModal(false); setAuthModalExhausted(false); }}
          />
        )}
      </AnimatePresence>
      <WaveGridBg />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="text-center">
          <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
            style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
            Ressources gratuites
          </span>
          <h1 className="mt-5 text-4xl font-bold text-white sm:text-5xl">
            Des outils pour <span style={{ background: "linear-gradient(90deg, #60A5FA 0%, #A78BFA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>passer à l'action</span>
          </h1>
          <p className="mt-4 mx-auto max-w-xl text-white/50">
            Ebooks, checklists et templates conçus pour avancer sans se perdre. Télécharge, applique, avance.
          </p>
          {!isLoggedIn && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
              style={{
                background: freeCount >= FREE_DOWNLOAD_LIMIT ? "rgba(245,194,0,0.1)" : "rgba(52,211,153,0.1)",
                border: freeCount >= FREE_DOWNLOAD_LIMIT ? "1px solid rgba(245,194,0,0.3)" : "1px solid rgba(52,211,153,0.3)",
                color: freeCount >= FREE_DOWNLOAD_LIMIT ? "#F5C200" : "#34D399",
              }}>
              {freeCount >= FREE_DOWNLOAD_LIMIT
                ? "Limite atteinte — Crée ton compte pour continuer"
                : `${FREE_DOWNLOAD_LIMIT - freeCount} téléchargement${FREE_DOWNLOAD_LIMIT - freeCount > 1 ? "s" : ""} gratuit${FREE_DOWNLOAD_LIMIT - freeCount > 1 ? "s" : ""} restant${FREE_DOWNLOAD_LIMIT - freeCount > 1 ? "s" : ""}`}
            </div>
          )}
        </motion.div>

        {/* Filter bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {["Tous", "Gratuit", "Payant"].map((f) => (
              <FilterBtn key={f} label={f} active={activeType === f} onClick={() => setActiveType(f)} />
            ))}
          </div>

          {/* Filter icon */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-all"
            style={{
              background: showFilters || activeTopic ? "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" : "rgba(255,255,255,0.05)",
              border: showFilters || activeTopic ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg className="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
            </svg>
            {activeTopic && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold"
                style={{ background: "#F5C200", color: "#000" }}>1</span>
            )}
          </button>
        </motion.div>

        {/* Topic panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap justify-center gap-2 rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {topicFilters.map((t) => (
                  <button key={t} onClick={() => setActiveTopic(activeTopic === t ? null : t)}
                    className="rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
                    style={{
                      background: activeTopic === t ? "rgba(96,165,250,0.18)" : "rgba(255,255,255,0.04)",
                      color: activeTopic === t ? "#60A5FA" : "rgba(255,255,255,0.4)",
                      border: activeTopic === t ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
          </div>
        )}

        {/* Grid */}
        {!loading && <AnimatePresence mode="wait">
          <motion.div
            key={activeType + String(activeTopic)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((r, i) => (
              <ResourceCard key={r.id} r={r} i={i} onDetail={() => setSelectedResource(r)} onDownload={handleDownload} />
            ))}
          </motion.div>
        </AnimatePresence>}

        {!loading && filtered.length === 0 && (
          <div className="mt-20 text-center text-white/30">
            <p className="text-lg">Aucune ressource dans cette catégorie pour l'instant.</p>
          </div>
        )}

        {/* CTA bas */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-20 rounded-3xl p-10 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#60A5FA" }}>Tu ne sais pas par où commencer ?</p>
          <h2 className="mt-3 text-2xl font-bold text-white">Fais ton diagnostic gratuit</h2>
          <p className="mt-2 text-white/50">En 1 minute, identifie ton profil et reçois les ressources adaptées à ton niveau.</p>
          <Link
            href="/diagnostic"
            className="mt-6 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
          >
            Faire le diagnostic
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
