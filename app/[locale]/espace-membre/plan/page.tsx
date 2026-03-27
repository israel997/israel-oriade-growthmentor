"use client";

import Link from "next/link";

type Section = {
  label: string;
  href: string;
  color: string;
  gradient: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  tips: string[];
};

const sections: Section[] = [
  {
    label: "Tableau de bord",
    href: "/espace-membre",
    color: "#60A5FA",
    gradient: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
    tagline: "Ta vue d'ensemble en un coup d'œil",
    description: "Le tableau de bord est ta page d'accueil. Il centralise toutes tes informations clés : score de progression, prochaines étapes, notifications récentes et accès rapides à chaque section.",
    tips: ["Commence toujours ici pour voir où tu en es", "Ton score évolue en temps réel selon tes actions"],
  },
  {
    label: "Mon Profil",
    href: "/espace-membre/profil",
    color: "#A78BFA",
    gradient: "linear-gradient(135deg, #6D28D9 0%, #A855F7 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    tagline: "Tes informations personnelles et préférences",
    description: "Configure ton profil : prénom, photo, domaine d'activité et objectifs. Ces informations permettent de personnaliser ton expérience et d'adapter les recommandations à ton contexte.",
    tips: ["Un profil complet améliore la pertinence des conseils", "Mets à jour ton objectif dès qu'il évolue"],
  },
  {
    label: "Diagnostic Hebdomadaire",
    href: "/espace-membre/diagnostic",
    color: "#34D399",
    gradient: "linear-gradient(135deg, #059669 0%, #34D399 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    tagline: "La pièce maîtresse de ta progression — à faire chaque semaine",
    description: "Le diagnostic hebdomadaire est le cœur de l'expérience GrowthMentor. En 10 questions et 1 minute, il évalue ton niveau business global sur l'offre, le contenu, les ventes, l'audience et le positionnement. Résultat immédiat avec badge personnalisé.",
    tips: ["Fais-le chaque semaine depuis le Tableau de bord — c'est ton repère de progression", "Réponds honnêtement — c'est pour toi, pas pour les autres", "Ton score alimente automatiquement Ma Progression et Mes Badges"],
  },
  {
    label: "Ma Progression",
    href: "/espace-membre/progression",
    color: "#60A5FA",
    gradient: "linear-gradient(135deg, #1A3FD8 0%, #06B6D4 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    tagline: "Suis ton évolution semaine après semaine",
    description: "Visualise ta courbe de progression sur toutes les dimensions. Chaque test passé alimente ton historique et te montre clairement si tu avances, stagne ou recules. La progression est la preuve que ta méthode fonctionne.",
    tips: ["La régularité prime sur la vitesse — 1 test par semaine suffit", "Analyse les dimensions où tu stagnes pour cibler ton effort"],
  },
  {
    label: "Mes Badges",
    href: "/espace-membre/badges",
    color: "#F5C200",
    gradient: "linear-gradient(135deg, #B45309 0%, #F5C200 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
    ),
    tagline: "Récompenses débloquées grâce à tes résultats",
    description: "Les badges récompensent ta progression et ton engagement. Chaque palier franchi (Débutant, Intermédiaire, Confirmé, Expert) débloque un badge. C'est un repère visuel de ton chemin parcouru.",
    tips: ["Les badges se débloquent automatiquement selon ton score", "Partage tes badges pour inspirer ta communauté"],
  },
  {
    label: "Tests Business",
    href: "/espace-membre/autres-tests",
    color: "#F472B6",
    gradient: "linear-gradient(135deg, #BE185D 0%, #F472B6 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
      </svg>
    ),
    tagline: "Des tests thématiques pour affiner ton profil business",
    description: "Va plus loin avec des évaluations thématiques ciblées : stratégies de contenu, vente et compétences digitales. Chaque test approfondit un axe spécifique de ton activité avec son propre système de badges.",
    tips: ["Commence par le test le plus lié à ton frein actuel", "Les résultats s'accumulent dans ta progression globale"],
  },
  {
    label: "Favoris",
    href: "/espace-membre/favoris",
    color: "#FB923C",
    gradient: "linear-gradient(135deg, #C2410C 0%, #FB923C 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    ),
    tagline: "Retrouve rapidement tout ce que tu as sauvegardé",
    description: "Sauvegarde les formations, outils et contenus qui t'intéressent d'un simple clic. Ta bibliothèque personnelle pour accéder rapidement aux ressources que tu as sélectionnées sans tout chercher à chaque fois.",
    tips: ["Clique sur l'icône ♡ sur n'importe quelle formation ou outil", "Organise ta liste de favoris en priorité d'action"],
  },
  {
    label: "Izzy — Assistant IA",
    href: "/espace-membre/izzy",
    color: "#A78BFA",
    gradient: "linear-gradient(135deg, #4C1D95 0%, #8B5CF6 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    tagline: "Ton assistant IA spécialisé en business digital",
    description: "Izzy est ton coach IA disponible 24h/24. Pose-lui n'importe quelle question sur ton positionnement, ton offre, ta stratégie d'acquisition ou tes blocages. Il connaît ta progression et adapte ses réponses à ton niveau.",
    tips: ["Sois précis dans tes questions — plus tu donnes de contexte, mieux il répond", "Utilise-le pour préparer tes prises de décision importantes"],
  },
  {
    label: "Programme Mentee",
    href: "/espace-membre/mentee",
    color: "#34D399",
    gradient: "linear-gradient(135deg, #065F46 0%, #10B981 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    tagline: "L'accompagnement personnalisé avec Israël Oriadé",
    description: "Le Programme Mentee est le niveau d'accompagnement le plus élevé. Sessions live, plan d'action personnalisé, accès direct à Israël et suivi de tes indicateurs semaine par semaine. Pour ceux qui veulent aller vite et bien.",
    tips: ["Les places sont limitées — candidature requise", "Consulte ta progression avant de postuler pour maximiser l'impact"],
  },
  {
    label: "Notifications",
    href: "/espace-membre/notifications",
    color: "#60A5FA",
    gradient: "linear-gradient(135deg, #1D4ED8 0%, #60A5FA 100%)",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
    tagline: "Reste informé de toutes les nouveautés",
    description: "Reçois les alertes sur les nouvelles formations disponibles, les contenus publiés, les nouvelles places ouvertes dans le programme mentee et tes badges débloqués. Rien ne t'échappe.",
    tips: ["Marque les notifications comme lues une fois traitées", "Les badges débloqués apparaissent ici en premier"],
  },
];

const STEP_ORDER = [
  "Diagnostic Hebdomadaire",
  "Ma Progression",
  "Mes Badges",
  "Tests Business",
  "Favoris",
  "Izzy — Assistant IA",
  "Programme Mentee",
];

export default function PlanPage() {
  return (
    <div className="space-y-10 max-w-4xl">
      {/* Hero */}
      <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: "rgba(26,63,216,0.12)", border: "1px solid rgba(96,165,250,0.2)" }}>
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(96,165,250,0.08) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.25)" }}>
              Guide de démarrage
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Bienvenue dans ton Espace Membre</h1>
          <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
            Cet espace est conçu pour t'accompagner pas à pas dans le développement de ton business digital.
            Voici le rôle de chaque section — lis ce guide une fois pour comprendre comment en tirer le maximum.
          </p>
        </div>
      </div>

      {/* Parcours recommandé */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Parcours recommandé pour démarrer</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {STEP_ORDER.map((label, i) => {
            const sec = sections.find(s => s.label === label || s.label.startsWith(label.split(" —")[0]));
            return (
              <div key={label} className="flex items-center gap-2">
                <Link
                  href={sec?.href ?? "#"}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
                  style={{ background: sec ? sec.color + "18" : "rgba(255,255,255,0.05)", border: `1px solid ${sec ? sec.color + "35" : "rgba(255,255,255,0.1)"}`, color: sec?.color ?? "rgba(255,255,255,0.5)" }}
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-black" style={{ background: sec?.color ?? "#fff", color: "#000" }}>{i + 1}</span>
                  {label.split(" —")[0]}
                </Link>
                {i < STEP_ORDER.length - 1 && (
                  <svg className="h-3 w-3 shrink-0" style={{ color: "rgba(255,255,255,0.2)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section cards */}
      <div>
        <h2 className="text-sm font-bold text-white mb-4">Détail de chaque section</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((s) => (
            <div
              key={s.href}
              className="rounded-2xl p-5 space-y-3 flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: s.gradient }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{s.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: s.color }}>{s.tagline}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                {s.description}
              </p>

              {/* Tips */}
              <div className="space-y-1.5">
                {s.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: s.color }} />
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={s.href}
                className="mt-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80 self-start"
                style={{ background: s.color + "18", border: `1px solid ${s.color}30`, color: s.color }}
              >
                Accéder
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl p-6 flex items-center justify-between gap-4" style={{ background: "rgba(245,194,0,0.06)", border: "1px solid rgba(245,194,0,0.2)" }}>
        <div>
          <p className="text-sm font-bold text-white">Prêt à commencer ?</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Lance ton diagnostic hebdomadaire depuis le tableau de bord — il ne prend que 1 minute.</p>
        </div>
        <Link
          href="/espace-membre"
          className="shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
        >
          Tableau de bord →
        </Link>
      </div>
    </div>
  );
}
