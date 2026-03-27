"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SmartPlanner from "@/components/member/SmartPlanner";
import { TOOLS_META } from "@/lib/tools-config";

type BadgeId = "mentee" | "growth_mentee" | "mentee_premium";

const COMPONENTS: Record<string, React.ComponentType> = {
  smart_planner: SmartPlanner,
};

const AVAILABLE_TOOLS = TOOLS_META.map((t) => ({ ...t, component: COMPONENTS[t.id] }));

function LockedOverlay() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="rounded-2xl p-10 max-w-md w-full" style={{ background: "rgba(239,68,68,0.04)", border: "1px dashed rgba(239,68,68,0.25)" }}>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl mb-5"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Section verrouillée</h2>
        <p className="text-sm text-white/50 leading-relaxed mb-4">
          La section Outils est réservée aux membres ayant le badge{" "}
          <span className="font-semibold" style={{ color: "#EF4444" }}>Growth Mentee</span>.
        </p>
        <div className="rounded-xl p-3 text-sm text-white/40" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          Progresse dans tes tests pour débloquer ce badge automatiquement.
        </div>
      </div>
    </div>
  );
}

export default function OutilsPage() {
  const [badges, setBadges] = useState<BadgeId[]>([]);
  const [pinnedTools, setPinnedTools] = useState<string[]>([]);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hasAccess = badges.includes("growth_mentee") || badges.includes("mentee_premium");

  useEffect(() => {
    fetch("/api/user/badges")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.badges) setBadges(data.badges);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/api/user/tools")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.pinned) setPinnedTools(data.pinned); })
      .catch(() => {});
  }, []);

  function togglePin(toolId: string) {
    const next = pinnedTools.includes(toolId)
      ? pinnedTools.filter((id) => id !== toolId)
      : [...pinnedTools, toolId];
    setPinnedTools(next);
    fetch("/api/user/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: next }),
    }).catch(() => {});
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="h-6 w-6 rounded-full border-2 animate-spin" style={{ borderColor: "#60A5FA", borderTopColor: "transparent" }} />
    </div>
  );

  if (!hasAccess) return <LockedOverlay />;

  const activeToolDef = AVAILABLE_TOOLS.find((t) => t.id === activeToolId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white">Outils</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Ajoute des outils à ton dashboard pour booster ta productivité.
        </p>
      </div>

      {/* Tools grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {AVAILABLE_TOOLS.map((tool) => {
          const isPinned = pinnedTools.includes(tool.id);
          const isActive = activeToolId === tool.id;
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{
                background: isActive ? tool.colorBg : "rgba(255,255,255,0.03)",
                border: `1px solid ${isActive ? tool.colorBorder : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <div className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: tool.colorBg, color: tool.color, border: `1px solid ${tool.colorBorder}` }}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white">{tool.label}</p>
                  <p className="text-xs text-white/40 truncate">{tool.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => togglePin(tool.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs transition-all"
                    title={isPinned ? "Retirer du dashboard" : "Ajouter au dashboard"}
                    style={{
                      background: isPinned ? "rgba(245,194,0,0.15)" : "rgba(255,255,255,0.05)",
                      border: isPinned ? "1px solid rgba(245,194,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                      color: isPinned ? "#F5C200" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {isPinned ? "📌" : "＋"}
                  </button>
                  <button
                    onClick={() => setActiveToolId(isActive ? null : tool.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      background: isActive ? tool.color : tool.colorBg,
                      color: isActive ? "#000" : tool.color,
                      border: `1px solid ${tool.colorBorder}`,
                    }}
                  >
                    {isActive ? "Fermer" : "Ouvrir"}
                  </button>
                </div>
              </div>

              {/* Expanded tool */}
              <AnimatePresence>
                {isActive && activeToolDef && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t px-1 pb-1" style={{ borderColor: tool.colorBorder }}>
                      <activeToolDef.component />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
