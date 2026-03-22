"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { levelRecommendations, resolveLevel } from "@/lib/recommendations";

const questions = [
  {
    id: "site",
    title: "Tu sais créer un site web ?",
    options: [
      { label: "Non", score: 0 },
      { label: "Oui, basique", score: 1 },
      { label: "Oui, je maîtrise", score: 2 }
    ]
  },
  {
    id: "money",
    title: "Tu gagnes déjà de l'argent en ligne ?",
    options: [
      { label: "Pas encore", score: 0 },
      { label: "Occasionnellement", score: 1 },
      { label: "Oui, régulièrement", score: 2 }
    ]
  },
  {
    id: "skills",
    title: "Tu maîtrises quoi le mieux ?",
    options: [
      { label: "Je débute", score: 0 },
      { label: "Contenu / audience", score: 1 },
      { label: "Acquisition / vente", score: 2 }
    ]
  }
] as const;

export default function QuizPage() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const score = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);
  const level = resolveLevel(score);
  const reco = levelRecommendations(level);

  const submit = () => {
    const isComplete = questions.every((q) => answers[q.id] !== undefined);
    if (!isComplete) return;
    localStorage.setItem("gm_quiz_result", JSON.stringify({ score, level, reco }));
    setDone(true);
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Évaluer mon niveau</h1>
      <p className="text-sm text-slate-300">Mini quiz intelligent pour recommander la meilleure offre.</p>

      {questions.map((q) => (
        <article key={q.id} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="font-semibold text-white">{q.title}</h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {q.options.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setAnswers((s) => ({ ...s, [q.id]: opt.score }))}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  answers[q.id] === opt.score
                    ? "border-emerald-300 bg-emerald-400/20 text-emerald-200"
                    : "border-slate-700 bg-slate-950 text-slate-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </article>
      ))}

      <button onClick={submit} className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-slate-950">
        Voir mon résultat
      </button>

      {done && (
        <article className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <h3 className="text-lg font-semibold text-white">Niveau détecté: {level}</h3>
          <ul className="mt-3 space-y-1 text-sm text-slate-200">
            <li>Formation: {reco.formation}</li>
            <li>Ebook: {reco.ebook}</li>
            <li>Accompagnement: {reco.accompagnement}</li>
          </ul>
          <div className="mt-4 flex gap-3">
            <Link href="/formations" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
              Aller aux formations
            </Link>
            <Link href="/ressources" className="rounded-full border border-white/30 px-4 py-2 text-sm text-white">
              Voir les ressources
            </Link>
          </div>
        </article>
      )}
    </section>
  );
}
