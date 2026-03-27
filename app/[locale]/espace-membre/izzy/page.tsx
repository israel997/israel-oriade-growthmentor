"use client";

const FEATURES = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
    title: "Consultant business IA",
    desc: "Pose n'importe quelle question sur ton activité digitale et obtiens une réponse personnalisée en quelques secondes.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Stratégie de contenu",
    desc: "Génère des idées de posts, de newsletters et de contenus adaptés à ta niche et à ton audience cible.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75" />
      </svg>
    ),
    title: "Optimisation des ventes",
    desc: "Analyse ton tunnel de vente, identifie les blocages et reçois des recommandations concrètes pour convertir plus.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    title: "Positionnement & niche",
    desc: "Affine ton offre, clarifie ton message et démarque-toi de la concurrence avec une identité forte et mémorable.",
  },
];

export default function IzzyPage() {
  return (
    <div className="max-w-2xl space-y-8">

      {/* Header */}
      <div className="flex items-center gap-3 rounded-2xl p-4"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" }}>
        <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0">
          <img src="/images/P2.webp" alt="Izzy" className="h-full w-full object-cover object-top" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-white">Izzy</p>
          <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Consultant business IA · Growth Mentor</p>
        </div>
        <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest"
          style={{ background: "rgba(245,194,0,0.12)", color: "#F5C200", border: "1px solid rgba(245,194,0,0.25)" }}>
          Bientôt disponible
        </span>
      </div>

      {/* Coming soon card */}
      <div className="rounded-2xl p-8 text-center space-y-4"
        style={{ background: "rgba(124,58,237,0.06)", backdropFilter: "blur(16px)", border: "1px solid rgba(124,58,237,0.2)" }}>
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(167,139,250,0.2))" }}>
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#A78BFA" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Izzy arrive bientôt</h2>
          <p className="text-sm mt-2 max-w-md mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
            Ton assistant IA personnel est en cours de développement. Il sera disponible très prochainement pour t&apos;accompagner dans la croissance de ton business.
          </p>
        </div>
      </div>

      {/* Features */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Ce qu&apos;Izzy pourra faire pour toi</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-2xl p-4 space-y-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(96,165,250,0.1)" }}>
              <div className="flex items-center gap-2.5">
                <span style={{ color: "#A78BFA" }}>{f.icon}</span>
                <p className="text-sm font-semibold text-white">{f.title}</p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
