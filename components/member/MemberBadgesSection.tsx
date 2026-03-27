"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type BadgeId = "mentee" | "growth_mentee" | "mentee_premium";

const BADGE_DEFS = {
  mentee: {
    id: "mentee" as BadgeId,
    label: "Mentee",
    tier: "Argent",
    color: "#94A3B8",
    colorMuted: "rgba(148,163,184,0.55)",
    colorBg: "rgba(148,163,184,0.38)",
    colorBorder: "rgba(148,163,184,0.65)",
    gradientUnlocked: "linear-gradient(135deg, #94A3B8, #CBD5E1)",
    gradientLocked: "rgba(148,163,184,0.08)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
    description: "Badge de bienvenue accordé automatiquement à l'inscription sur la plateforme.",
    perks: [
      "Accès à tous les tests (Contenu, Vente, Digital...)",
      "Téléchargement illimité des ressources",
      "Détails complets des outils testés",
      "Diagnostic hebdomadaire",
      "Chat avec Izzy (10 requêtes/jour)",
    ],
  },
  growth_mentee: {
    id: "growth_mentee" as BadgeId,
    label: "Growth Mentee",
    tier: "Progression",
    color: "#EF4444",
    colorMuted: "rgba(239,68,68,0.6)",
    colorBg: "rgba(239,68,68,0.12)",
    colorBorder: "rgba(239,68,68,0.3)",
    gradientUnlocked: "linear-gradient(135deg, #EF4444, #F87171)",
    gradientLocked: "rgba(239,68,68,0.06)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    description: "Accordé automatiquement quand tu progresses régulièrement dans tes résultats (tests, certifications, scores).",
    perks: [
      "Accès aux événements & conférences exclusifs",
      "Chat avec Izzy (30 requêtes/jour)",
      "Section Outils débloquée (Smart Planner...)",
      "Ajout d'outils personnalisés au dashboard",
      "Badge progression visible sur ton profil",
    ],
    howToUnlock: "Améliore tes scores sur au moins 3 tests différents et collecte une certification.",
  },
  mentee_premium: {
    id: "mentee_premium" as BadgeId,
    label: "Mentee Premium",
    tier: "Or",
    color: "#F5C200",
    colorMuted: "rgba(245,194,0,0.6)",
    colorBg: "rgba(245,194,0,0.12)",
    colorBorder: "rgba(245,194,0,0.3)",
    gradientUnlocked: "linear-gradient(135deg, #F5C200, #F97316)",
    gradientLocked: "rgba(245,194,0,0.06)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    description: "Badge réservé aux membres acceptés dans le programme d'accompagnement personnalisé privé.",
    perks: [
      "Accompagnement 1-1 personnalisé avec Israël",
      "Accès illimité à Izzy",
      "Révisions de stratégie mensuelles",
      "Accès prioritaire à tous les événements",
      "Support direct via messagerie privée",
    ],
    howToUnlock: "Candidater au programme Mentee Premium depuis ton espace membre.",
  },
};

const ALL_BADGES: BadgeId[] = ["mentee", "growth_mentee", "mentee_premium"];

function BadgeDetailPopup({
  badgeId,
  unlocked,
  onClose,
}: {
  badgeId: BadgeId;
  unlocked: boolean;
  onClose: () => void;
}) {
  const def = BADGE_DEFS[badgeId];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(2,5,22,0.88)", backdropFilter: "blur(14px)" }} />
      <motion.div
        className="relative w-full max-w-sm overflow-hidden rounded-2xl"
        style={{
          background: "#08123A",
          border: `1px solid ${def.colorBorder}`,
          boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 40px ${def.colorBg}`,
        }}
        initial={{ opacity: 0, y: 28, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.26, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-center py-8" style={{ background: `linear-gradient(135deg, ${def.colorBg}, rgba(0,0,0,0))` }}>
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{
                background: unlocked ? def.gradientUnlocked : "rgba(255,255,255,0.05)",
                border: unlocked ? "none" : `1px solid ${def.colorBorder}`,
                filter: unlocked ? "none" : "grayscale(0.7) opacity(0.5)",
              }}
            >
              {unlocked ? def.icon : (
                <svg className="h-6 w-6" style={{ color: def.color, opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white">{def.label}</p>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold mt-1"
                style={{ background: def.colorBg, color: def.color, border: `1px solid ${def.colorBorder}` }}>
                {unlocked ? (
                  <>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {def.tier}
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Verrouillé
                  </>
                )}
              </span>
            </div>
          </div>
          <button onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/30 hover:text-white/60 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-sm text-white/60 leading-relaxed">{def.description}</p>

          {/* Perks */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: def.color }}>
              Ce badge donne accès à
            </p>
            <ul className="space-y-2">
              {def.perks.map((perk, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/70">
                  <span className="shrink-0 mt-0.5 h-4 w-4 flex items-center justify-center rounded-full"
                    style={{ background: def.colorBg }}>
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke={def.color} strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* How to unlock (if locked) */}
          {"howToUnlock" in def && !unlocked && (
            <div className="rounded-xl p-3" style={{ background: def.colorBg, border: `1px solid ${def.colorBorder}` }}>
              <p className="text-xs font-semibold mb-1" style={{ color: def.color }}>Comment débloquer</p>
              <p className="text-xs text-white/60">{(def as { howToUnlock: string }).howToUnlock}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MemberBadgesSection() {
  const [unlockedBadges, setUnlockedBadges] = useState<BadgeId[]>(["mentee"]);
  const [selectedBadge, setSelectedBadge] = useState<BadgeId | null>(null);

  useEffect(() => {
    fetch("/api/user/badges")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.badges && Array.isArray(data.badges)) {
          setUnlockedBadges(data.badges as BadgeId[]);
        }
      })
      .catch(() => {});

    // Also check mentee_premium from localStorage
    try {
      const app = JSON.parse(localStorage.getItem("gm_mentee_application") ?? "null");
      if (app?.status === "accepted") {
        setUnlockedBadges((prev) => prev.includes("mentee_premium") ? prev : [...prev, "mentee_premium"]);
      }
    } catch {}
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {ALL_BADGES.map((badgeId) => {
          const def = BADGE_DEFS[badgeId];
          const unlocked = unlockedBadges.includes(badgeId);
          return (
            <button
              key={badgeId}
              onClick={() => setSelectedBadge(badgeId)}
              className="group relative flex items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${def.colorBg.replace("0.12", "0.22")}, rgba(255,255,255,0.03))`,
                border: unlocked
                  ? `1px solid ${def.colorBorder.replace("0.3", "0.55")}`
                  : `1px dashed ${def.colorBorder.replace("0.3", "0.35")}`,
                opacity: unlocked ? 1 : 0.88,
              }}
            >
              {/* Badge icon — colored gradient if unlocked, muted tint if locked */}
              <div className="h-10 w-10 shrink-0 rounded-xl flex items-center justify-center"
                style={{
                  background: unlocked
                    ? def.gradientUnlocked
                    : def.colorBg.replace("0.12", "0.18"),
                }}>
                {def.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold leading-tight truncate"
                  style={{ color: unlocked ? def.color : def.colorMuted }}>
                  {def.label}
                </p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {unlocked ? def.tier : "Verrouillé"}
                </p>
              </div>

              {/* Right indicator — ✓ if unlocked, 🔒 if locked */}
              {unlocked ? (
                <span className="shrink-0 rounded-full w-6 h-6 flex items-center justify-center"
                  style={{ background: def.colorBg, border: `1px solid ${def.colorBorder}` }}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke={def.color} strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
              ) : (
                <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                  style={{ background: def.colorBg.replace("0.12", "0.08"), border: `1px solid ${def.colorBorder.replace("0.3", "0.2")}` }}>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2}
                    stroke={def.color}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </span>
              )}

            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <BadgeDetailPopup
            badgeId={selectedBadge}
            unlocked={unlockedBadges.includes(selectedBadge)}
            onClose={() => setSelectedBadge(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
