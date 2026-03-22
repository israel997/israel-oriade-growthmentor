"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── SVG Icons ──────────────────────────────────────────────────────────────
function IconTarget() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="3" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21" />
      <line x1="3" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21" y2="12" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8" />
      <path strokeLinecap="round" d="M12 3c-2 2.5-3 5.5-3 9s1 6.5 3 9M12 3c2 2.5 3 5.5 3 9s-1 6.5-3 9" />
    </svg>
  );
}
function IconCoin() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5C14.5 8.12 13.38 7 12 7s-2.5 1.12-2.5 2.5c0 1.93 2.5 3 2.5 4.5 0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5M12 6v1M12 17v1" />
    </svg>
  );
}
function IconFlag() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21V5m0 0h12l-2.5 4.5L17 14H5" />
    </svg>
  );
}
function IconWrench() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );
}
function IconCog() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
    </svg>
  );
}
function IconSprout() {
  return (
    <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 22V12M12 12C12 12 7 11 5 7c3 0 6 1 7 5ZM12 12c0 0 5-1 7-5-3 0-6 1-7 5Z" />
      <path strokeLinecap="round" d="M12 12C12 8 10 5 8 4" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 3L5 14h7l-1 7 8-11h-7l1-7Z" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    </svg>
  );
}
function IconBulb() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 0 1 5.197 11.757A4.494 4.494 0 0 0 16 17H8a4.494 4.494 0 0 0-1.197-3.243A7 7 0 0 1 12 2ZM9 21h6M10 17v1M14 17v1" />
    </svg>
  );
}

const questionIcons: Record<string, React.ReactNode> = {
  passion: <IconTarget />,
  internet: <IconGlobe />,
  money: <IconCoin />,
  objective: <IconFlag />,
  skills: <IconWrench />,
  tools: <IconCog />,
  time: <IconClock />,
};

// ── Questions ──────────────────────────────────────────────────────────────
const questions = [
  {
    id: "passion",
    title: "C'est quoi ta passion principale ?",
    options: [
      { label: "Enseigner / partager", scores: { knowledge: 2, content: 2 } },
      { label: "Vendre / convaincre", scores: { sales: 2, business: 1 } },
      { label: "Créer du contenu", scores: { content: 2, audience: 1 } },
      { label: "Coder / technologie", scores: { tech: 2, business: 1 } },
      { label: "Je ne sais pas encore", scores: {} },
    ],
  },
  {
    id: "internet",
    title: "As-tu déjà utilisé internet pour ton business ?",
    options: [
      { label: "Jamais essayé", scores: { beginner: 2 } },
      { label: "J'ai un profil sur les réseaux", scores: { audience: 1 } },
      { label: "J'ai un site ou une boutique", scores: { business: 1, tech: 1 } },
      { label: "Oui, j'ai déjà des clients en ligne", scores: { sales: 2, business: 2 } },
    ],
  },
  {
    id: "money",
    title: "As-tu déjà gagné de l'argent en ligne ?",
    options: [
      { label: "Pas encore", scores: { beginner: 2 } },
      { label: "Quelques ventes isolées", scores: { sales: 1 } },
      { label: "Oui, régulièrement (< 200k XOF/mois)", scores: { sales: 2, business: 1 } },
      { label: "Oui, > 200k XOF/mois", scores: { sales: 2, business: 2, advanced: 2 } },
    ],
  },
  {
    id: "objective",
    title: "C'est quoi ton objectif principal ?",
    options: [
      { label: "Lancer mon premier produit digital", scores: { beginner: 1 } },
      { label: "Augmenter mes revenus existants", scores: { business: 2 } },
      { label: "Scaler et automatiser", scores: { advanced: 2, business: 1 } },
      { label: "Créer une audience et une marque", scores: { content: 2, audience: 2 } },
    ],
  },
  {
    id: "skills",
    title: "Quelles sont tes compétences de base ?",
    options: [
      { label: "Aucune compétence digitale", scores: { beginner: 2 } },
      { label: "Rédaction / communication", scores: { content: 2, knowledge: 1 } },
      { label: "Marketing / réseaux sociaux", scores: { audience: 2, sales: 1 } },
      { label: "Montage vidéo / création audiovisuelle", scores: { content: 2, audience: 1 } },
      { label: "Design graphique / illustration / art", scores: { content: 1, audience: 1 } },
      { label: "Photographie / mode / lifestyle", scores: { content: 2, audience: 1 } },
      { label: "Gestion / stratégie business", scores: { business: 2, advanced: 1 } },
    ],
  },
  {
    id: "tools",
    title: "Quels outils utilises-tu au quotidien ?",
    options: [
      { label: "WhatsApp / Facebook seulement", scores: { beginner: 1 } },
      { label: "Canva, Notion, Google Docs", scores: { content: 1, knowledge: 1 } },
      { label: "Outils marketing (email, CRM…)", scores: { sales: 2, business: 1 } },
      { label: "Outils d'automatisation / IA", scores: { advanced: 2, tech: 1 } },
    ],
  },
  {
    id: "time",
    title: "Combien de temps peux-tu consacrer à ton business par semaine ?",
    options: [
      { label: "Moins de 5h", scores: { beginner: 1 } },
      { label: "5 à 10h", scores: {} },
      { label: "10 à 20h", scores: { business: 1 } },
      { label: "Plus de 20h", scores: { advanced: 1, business: 1 } },
    ],
  },
];

// ── Scoring ────────────────────────────────────────────────────────────────
type ScoreMap = Record<string, number>;

function computeScores(answers: Record<string, number>): ScoreMap {
  const scores: ScoreMap = {};
  questions.forEach((q) => {
    const idx = answers[q.id];
    if (idx !== undefined) {
      Object.entries(q.options[idx].scores || {}).forEach(([k, v]) => {
        scores[k] = (scores[k] || 0) + (v as number);
      });
    }
  });
  return scores;
}

function computeLevel(scores: ScoreMap) {
  const advanced = (scores.advanced || 0) + (scores.business || 0) + (scores.sales || 0);
  const mid = (scores.content || 0) + (scores.audience || 0) + (scores.knowledge || 0);
  if (advanced >= 6) return "Expert";
  if (advanced >= 3 || mid >= 4) return "Intermédiaire";
  return "Débutant";
}

function computeProfile(scores: ScoreMap, answers: Record<string, number>) {
  const level = computeLevel(scores);

  const profiles = {
    Débutant: {
      color: "#22C55E",
      badgeIcon: <IconSprout />,
      tagline: "Tu es au bon endroit pour commencer fort.",
      strengths: [
        "Tu as la motivation pour te lancer",
        "Tu n'as pas de mauvaises habitudes à désapprendre",
        "Tu peux aller vite si tu suis la bonne méthode",
      ],
      weaknesses: [
        "Manque de visibilité sur les outils à utiliser",
        "Pas encore de revenus en ligne",
        "Risque de dispersion sans structure claire",
      ],
      skills: [
        "Trouver ton positionnement rentable",
        "Créer ta première offre simple",
        "Construire un tunnel de vente basique",
        "Développer tes premiers clients",
      ],
      advice: "Commence par une seule offre simple. Ne cherche pas à tout faire en même temps. La clarté avant la vitesse.",
      formation: "Lancement Digital 30J",
      formationHref: "/formations/lancement-digital-30j",
      price: "79€",
    },
    Intermédiaire: {
      color: "#818CF8",
      badgeIcon: <IconBolt />,
      tagline: "Tu as les bases. Il est temps de structurer et scaler.",
      strengths: [
        "Tu as déjà une expérience du digital",
        "Tu connais les réseaux et la création de contenu",
        "Tu as déjà généré des revenus ou une audience",
      ],
      weaknesses: [
        "Manque de système reproductible",
        "Revenus irréguliers ou dépendants du temps",
        "Besoin de mieux convertir ton audience",
      ],
      skills: [
        "Automatiser ton acquisition client",
        "Créer un tunnel de conversion optimisé",
        "Mettre en place un système d'email marketing",
        "Analyser et optimiser tes KPIs",
      ],
      advice: "Tu dois passer du mode freelance au mode système. Crée des actifs qui travaillent pour toi même quand tu dors.",
      formation: "Croissance Système",
      formationHref: "/formations/croissance-systeme",
      price: "149€",
    },
    Expert: {
      color: "#F5C200",
      badgeIcon: <IconStar />,
      tagline: "Tu as le niveau. On va scaler ensemble.",
      strengths: [
        "Tu génères déjà des revenus significatifs",
        "Tu as une stratégie et des process en place",
        "Tu comprends les mécaniques de conversion",
      ],
      weaknesses: [
        "Besoin d'optimiser pour atteindre un palier supérieur",
        "Parfois seul face aux grandes décisions",
        "Manque d'un regard extérieur stratégique",
      ],
      skills: [
        "Scaler ton offre avec un système délégable",
        "Optimiser ta marge et ta rentabilité",
        "Construire une roadmap business 90 jours",
        "Décisions data-driven et automatisation avancée",
      ],
      advice: "Le prochain niveau ne se fait pas en travaillant plus, mais en travaillant différemment. Il te faut un mentor, pas juste des ressources.",
      formation: "Mentorat Elite",
      formationHref: "/formations/mentorat-elite",
      price: "390€",
    },
  };

  return { level, ...profiles[level as keyof typeof profiles] };
}

// ── How it works modal ─────────────────────────────────────────────────────
function HowItWorks({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl p-8"
        style={{ background: "#0A1240", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-white/40 hover:text-white transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-bold text-white">Comment ça fonctionne ?</h3>
        <div className="mt-6 space-y-4">
          {[
            { num: "01", title: "7 questions rapides", desc: "Tu réponds à 7 questions sur ton profil, tes compétences et tes objectifs." },
            { num: "02", title: "Analyse automatique", desc: "Notre algorithme analyse tes réponses et calcule ton niveau réel." },
            { num: "03", title: "Ta fiche d'identité", desc: "Tu reçois un profil complet avec tes forces, faiblesses et recommandations." },
          ].map((step) => (
            <div key={step.num} className="flex gap-4">
              <span className="text-2xl font-bold shrink-0" style={{ color: "#F5C200" }}>{step.num}</span>
              <div>
                <p className="font-semibold text-white">{step.title}</p>
                <p className="mt-0.5 text-sm text-white/50">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl py-3 text-sm font-semibold text-black"
          style={{ background: "#F5C200" }}
        >
          J'ai compris, je commence
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Quiz ──────────────────────────────────────────────────────────────
export default function QuizPage() {
  const [phase, setPhase] = useState<"intro" | "quiz" | "result">("intro");
  const [showHow, setShowHow] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [direction, setDirection] = useState(1);

  const question = questions[currentQ];
  const progress = ((currentQ) / questions.length) * 100;
  const hasAnswered = answers[question.id] !== undefined;

  const selectOption = (optionIndex: number) => {
    setAnswers((a) => ({ ...a, [question.id]: optionIndex }));
  };

  const handleNext = () => {
    if (!hasAnswered) return;
    if (currentQ < questions.length - 1) {
      setDirection(1);
      setCurrentQ((q) => q + 1);
    } else {
      setPhase("result");
    }
  };

  useEffect(() => {
    if (phase !== "quiz") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, hasAnswered, currentQ]);

  const handleBack = () => {
    if (currentQ === 0) {
      setPhase("intro");
    } else {
      setDirection(-1);
      setCurrentQ((q) => q - 1);
    }
  };

  const finalScores = computeScores(answers);
  const profile = computeProfile(finalScores, answers);

  return (
    <div className="min-h-screen" style={{ background: "#05092A" }}>
      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.3]"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "300px 300px",
        }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(30,80,200,0.25) 0%, transparent 70%)" }} />

      <AnimatePresence mode="wait">
        {showHow && <HowItWorks key="how" onClose={() => setShowHow(false)} />}
      </AnimatePresence>

      <div className="relative mx-auto max-w-2xl px-4 py-16">

        {/* ── INTRO ── */}
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA" }}>
                Évaluation gratuite
              </span>
              <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
                Quel est ton <span style={{ color: "#F5C200" }}>niveau réel</span> ?
              </h1>
              <p className="mt-4 text-lg text-white/50">
                7 questions pour identifier ton profil et te recommander le parcours exact adapté à tes objectifs.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4">
                <button
                  onClick={() => setPhase("quiz")}
                  className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-black transition-transform hover:scale-[1.02]"
                  style={{ background: "#F5C200" }}
                >
                  Commencer l'évaluation
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <button
                  onClick={() => setShowHow(true)}
                  className="text-sm text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
                >
                  Comment fonctionne l'évaluation ?
                </button>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-3 gap-5">
                {[
                  {
                    val: "+180",
                    label: "profils analysés",
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                      </svg>
                    ),
                    delay: 0,
                  },
                  {
                    val: "7",
                    label: "questions seulement",
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                    ),
                    delay: 0.15,
                  },
                  {
                    val: "2 min",
                    label: "pour ton résultat",
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    ),
                    delay: 0.3,
                  },
                ].map((s) => (
                  <motion.div
                    key={s.label}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: s.delay }}
                    className="flex flex-col items-center gap-3 rounded-2xl px-4 py-7"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(12px)" }}
                  >
                    <span style={{ color: "#F5C200" }}>{s.icon}</span>
                    <p className="text-3xl font-bold text-white">{s.val}</p>
                    <p className="text-xs text-white/40 leading-snug">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── QUIZ ── */}
          {phase === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40">Question {currentQ + 1} sur {questions.length}</span>
                  <span className="text-xs font-semibold" style={{ color: "#F5C200" }}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: "#F5C200" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentQ}
                  custom={direction}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <span style={{ color: "#F5C200" }}>{questionIcons[question.id]}</span>
                    <h2 className="mt-4 text-2xl font-bold text-white">{question.title}</h2>

                    <div className="mt-6 space-y-3">
                      {question.options.map((opt, i) => (
                        <motion.button
                          key={opt.label}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => selectOption(i)}
                          className="w-full rounded-xl px-5 py-4 text-left text-sm font-medium transition-all"
                          style={{
                            background: answers[question.id] === i ? "rgba(245,194,0,0.12)" : "rgba(255,255,255,0.04)",
                            border: answers[question.id] === i ? "1.5px solid #F5C200" : "1px solid rgba(255,255,255,0.08)",
                            color: answers[question.id] === i ? "#F5C200" : "rgba(255,255,255,0.8)",
                          }}
                        >
                          <span className="mr-3 text-white/30">{String.fromCharCode(65 + i)}.</span>
                          {opt.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold text-white/60 transition-all hover:text-white hover:border-white/30"
                      style={{ borderColor: "rgba(255,255,255,0.12)" }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                      </svg>
                      Retour
                    </button>

                    <motion.button
                      onClick={handleNext}
                      disabled={!hasAnswered}
                      whileTap={hasAnswered ? { scale: 0.97 } : {}}
                      className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all"
                      style={{
                        background: hasAnswered ? "#F5C200" : "rgba(255,255,255,0.06)",
                        color: hasAnswered ? "#000" : "rgba(255,255,255,0.25)",
                        cursor: hasAnswered ? "pointer" : "not-allowed",
                      }}
                    >
                      {currentQ === questions.length - 1 ? "Voir mon résultat" : "Question suivante"}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge niveau */}
              <div className="text-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex h-20 w-20 items-center justify-center rounded-full mb-4"
                  style={{ background: `${profile.color}20`, border: `2px solid ${profile.color}`, color: profile.color }}
                >
                  {profile.badgeIcon}
                </motion.div>
                <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: profile.color }}>Niveau détecté</p>
                <h2 className="mt-2 text-4xl font-bold text-white">{profile.level}</h2>
                <p className="mt-2 text-white/50">{profile.tagline}</p>
              </div>

              <div className="space-y-5">
                {/* Forces */}
                <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    Tes forces
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {profile.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-white/70">
                        <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Faiblesses */}
                <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                    Points à renforcer
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {profile.weaknesses.map((w) => (
                      <li key={w} className="flex items-start gap-2 text-sm text-white/70">
                        <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compétences */}
                <div className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>
                    Compétences à développer
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {profile.skills.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-white/70">
                        <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Conseil */}
                <div className="rounded-2xl p-6" style={{ background: `${profile.color}10`, border: `1.5px solid ${profile.color}40` }}>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span style={{ color: profile.color }}><IconBulb /></span>
                    Le conseil de ton mentor
                  </h3>
                  <p className="mt-3 text-sm text-white/70 leading-relaxed italic">"{profile.advice}"</p>
                </div>

                {/* Formation recommandée */}
                <div className="rounded-2xl p-6" style={{ background: "rgba(245,194,0,0.06)", border: "1.5px solid rgba(245,194,0,0.3)" }}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Formation recommandée</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white">{profile.formation}</h3>
                      <p className="text-2xl font-bold mt-1" style={{ color: "#F5C200" }}>{profile.price}</p>
                    </div>
                    <Link
                      href={profile.formationHref}
                      className="rounded-xl px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                      style={{ background: "#F5C200" }}
                    >
                      Voir la formation
                    </Link>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/espace-membre"
                      className="inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
                      style={{ background: "#F5C200" }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Sauvegarder
                    </Link>
                    <button
                      onClick={() => { setPhase("intro"); setCurrentQ(0); setAnswers({}); }}
                      className="rounded-xl border py-3.5 text-sm font-semibold text-white/60 transition-all hover:text-[#F5C200] hover:border-[#F5C200]/40"
                      style={{ borderColor: "rgba(255,255,255,0.12)" }}
                    >
                      Recommencer
                    </button>
                  </div>
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                  <Link
                    href="/ressources"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition-all hover:border-[#60A5FA]/50 hover:text-[#60A5FA]"
                    style={{ border: "1px solid rgba(96,165,250,0.2)", color: "#60A5FA" }}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    Trouver des ressources gratuites
                  </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
