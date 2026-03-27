"use client";

import Link from "next/link";
import { MatchedScenario, getUniqueFormations, getUniqueResources } from "@/lib/match-scenarios";
import { Formation } from "@/lib/formations-catalog";
import { Resource } from "@/lib/resources-catalog";

const NIVEAU_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  apprenti:     { color: "#94A3B8", bg: "rgba(148,163,184,0.12)", label: "Débutant" },
  intermediaire:{ color: "#60A5FA", bg: "rgba(96,165,250,0.12)",  label: "Intermédiaire" },
  avance:       { color: "#A78BFA", bg: "rgba(167,139,250,0.12)", label: "Avancé" },
};

const PRIORITY_ICONS = ["🎯", "⚡", "🔑"];

function FormationCard({ formation }: { formation: Formation }) {
  const niveau = NIVEAU_COLORS[formation.niveau] ?? NIVEAU_COLORS.apprenti;
  const isGratuit = formation.prix === "Gratuit";

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-bold text-white leading-snug flex-1">{formation.label}</p>
          <span className="shrink-0 text-xs font-bold rounded-full px-2 py-0.5"
            style={{
              background: isGratuit ? "rgba(52,211,153,0.15)" : "rgba(245,194,0,0.12)",
              color: isGratuit ? "#34D399" : "#F5C200",
              border: isGratuit ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(245,194,0,0.2)",
            }}>
            {formation.prix}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
          {formation.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 uppercase tracking-wide"
            style={{ background: niveau.bg, color: niveau.color }}>
            {niveau.label}
          </span>
          <Link href={formation.lien}
            className="text-xs font-semibold rounded-xl px-3 py-1.5 transition-all hover:scale-[1.02]"
            style={{
              background: isGratuit
                ? "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.08))"
                : "linear-gradient(135deg, #1A3FD8, #3B82F6)",
              color: isGratuit ? "#34D399" : "#fff",
              border: isGratuit ? "1px solid rgba(52,211,153,0.25)" : "none",
            }}>
            {isGratuit ? "Accéder gratuitement →" : "Voir la formation →"}
          </Link>
        </div>
      </div>
    </div>
  );
}

function FormationPlaceholder({ category }: { category: string }) {
  return (
    <div className="rounded-2xl p-4 flex items-center gap-3"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)" }}>
      <div className="shrink-0 h-9 w-9 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
          Formation {category} — disponible prochainement
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Reviens dans quelques jours pour découvrir cette formation.
        </p>
      </div>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link href={resource.lien}
      className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:scale-[1.01]"
      style={{ background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.15)" }}>
      <div className="shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
        style={{ background: "rgba(96,165,250,0.1)" }}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{resource.label}</p>
        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{resource.description}</p>
      </div>
      <svg className="shrink-0 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
      </svg>
    </Link>
  );
}

type Props = {
  matched: MatchedScenario[];
};

export default function DiagnosticRecommendations({ matched }: Props) {
  if (matched.length === 0) return null;

  const formations = getUniqueFormations(matched);
  const resources = getUniqueResources(matched);

  return (
    <div className="space-y-6 mt-2">

      {/* Priorités — actions concrètes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          {matched.length === 1 ? "Ta priorité immédiate" : `Tes ${matched.length} priorités immédiates`}
        </p>
        <div className="space-y-3">
          {matched.map((scenario, i) => (
            <div key={scenario.id} className="rounded-2xl p-4 flex gap-3"
              style={{
                background: i === 0
                  ? "rgba(26,63,216,0.1)"
                  : "rgba(255,255,255,0.03)",
                border: i === 0
                  ? "1px solid rgba(96,165,250,0.25)"
                  : "1px solid rgba(255,255,255,0.07)",
              }}>
              <span className="text-xl shrink-0 mt-0.5">{PRIORITY_ICONS[i]}</span>
              <div className="space-y-1.5">
                <p className="text-sm font-bold text-white">{scenario.lacune}</p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {scenario.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formations recommandées */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          Formations recommandées
        </p>
        {formations.length > 0 ? (
          <div className="space-y-3">
            {formations.slice(0, 4).map((f) => (
              <FormationCard key={f.id} formation={f} />
            ))}
          </div>
        ) : (
          <FormationPlaceholder category={matched[0]?.formationIds[0] ?? "recommandée"} />
        )}
      </div>

      {/* Ressources gratuites */}
      {resources.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "rgba(255,255,255,0.35)" }}>
            Ressources gratuites pour commencer maintenant
          </p>
          <div className="space-y-2">
            {resources.slice(0, 4).map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
