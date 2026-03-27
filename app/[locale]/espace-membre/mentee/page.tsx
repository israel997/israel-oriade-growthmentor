"use client";

import { useEffect, useState } from "react";
import { saveUserData } from "@/lib/sync-user-data";

type Status = "none" | "pending" | "accepted" | "rejected";
type Application = { status: Status; submittedAt?: string; goal?: string; level?: string; hours?: string; motivation?: string };

const PERKS = [
  "Accès direct à Israël pour des sessions 1-on-1",
  "Feedback personnalisé sur ton offre et ton contenu",
  "Accès aux ressources exclusives Mentee",
  "Suivi hebdomadaire de tes objectifs",
  "Réseau privé des Mentees Growth Mentor",
  "Priorité sur les nouvelles formations",
  "Smart Calendar — planification intelligente de tes sessions",
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string; border: string; desc: string }> = {
  none:     { label: "Non candidaté",  color: "#94A3B8", bg: "rgba(148,163,184,0.06)", border: "rgba(148,163,184,0.15)", desc: "" },
  pending:  { label: "En attente",     color: "#F5C200", bg: "rgba(245,194,0,0.06)",   border: "rgba(245,194,0,0.2)",   desc: "Ta candidature est en cours d'examen. Tu recevras une réponse sous 5 à 7 jours." },
  accepted: { label: "Accepté(e)",      color: "#34D399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.2)",  desc: "Félicitations ! Tu fais partie du programme Mentee. Israël te contactera prochainement." },
  rejected: { label: "Non retenu(e)",  color: "#F87171", bg: "rgba(248,113,113,0.06)", border: "rgba(248,113,113,0.2)", desc: "Ta candidature n'a pas été retenue pour cette session. Tu pourras recandidater dans 3 mois." },
};

const INPUT_STYLE = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(96,165,250,0.15)",
  color: "white",
};

const POLICY = [
  {
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
      </svg>
    ),
    title: "Sessions hebdomadaires",
    desc: "2 appels de 30 min ou 1 appel de 1h par semaine, selon tes préférences.",
  },
  {
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    title: "Questions illimitées",
    desc: "Tu peux poser toutes tes questions par messagerie sans limite.",
  },
  {
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
      </svg>
    ),
    title: "Remboursement conditionnel",
    desc: "Remboursement uniquement après 50% du temps écoulé et si tu n'es pas satisfait(e).",
  },
  {
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
    ),
    title: "Disponibilité",
    desc: "Préviens au minimum 24h à l'avance si tu dois annuler ou reporter un appel.",
  },
];

export default function MenteePage() {
  const [app, setApp] = useState<Application>({ status: "none" });
  const [form, setForm] = useState({ goal: "", level: "Débutant", hours: "", motivation: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gm_mentee_application");
      if (saved) setApp(JSON.parse(saved));
    } catch {}
  }, []);

  const submit = () => {
    if (!form.goal || !form.hours || !form.motivation) return;
    setSubmitting(true);
    setTimeout(() => {
      const application: Application = { status: "pending", submittedAt: new Date().toISOString(), ...form };
      saveUserData("gm_mentee_application", application);
      setApp(application);
      setSubmitting(false);
      setShowForm(false);
    }, 1200);
  };

  const st = STATUS_CONFIG[app.status];

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Mentee Premium</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Un accompagnement direct et personnalisé avec Israël.</p>
      </div>

      {/* Statut candidature */}
      {app.status !== "none" && (
        <div className="rounded-2xl p-5" style={{ background: st.bg, border: `1px solid ${st.border}`, backdropFilter: "blur(16px)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full" style={{ background: st.color }} />
            <span className="text-sm font-bold" style={{ color: st.color }}>Statut : {st.label}</span>
          </div>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{st.desc}</p>
          {app.submittedAt && (
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Envoyée le {new Date(app.submittedAt).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      )}

      {/* Présentation */}
      <div className="rounded-2xl p-6 space-y-4"
        style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(245,194,0,0.18)" }}>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #F5C200, #F97316)" }}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
          </div>
          <div>
            <p className="font-bold text-white">Devenir Mentee</p>
            <p className="text-xs uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Places limitées · Sélection sur dossier</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {PERKS.map((p) => (
            <div key={p} className="flex items-start gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth={2.2} className="h-4 w-4 mt-0.5 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Politique de coaching privé */}
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Politique du coaching privé</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {POLICY.map((p) => (
            <div key={p.title} className="rounded-xl p-3.5 space-y-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>{p.icon}</span>
                <p className="text-sm font-semibold text-white">{p.title}</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {app.status === "none" && !showForm && (
        <button onClick={() => setShowForm(true)}
          className="w-full rounded-2xl py-4 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #F5C200, #F97316)" }}>
          Candidater au programme Mentee Premium →
        </button>
      )}

      {/* Formulaire */}
      {showForm && app.status === "none" && (
        <div className="rounded-2xl p-6 space-y-4"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.18)" }}>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Ma candidature</p>

          {[
            { key: "goal",  label: "Quel est ton objectif principal ?",                   placeholder: "Ex: Lancer mon coaching en ligne et atteindre 3k€/mois" },
            { key: "hours", label: "Combien d'heures par semaine peux-tu investir ?",      placeholder: "Ex: 10-15h/semaine" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</label>
              <input
                value={form[key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none transition-colors focus:border-blue-400/40"
                style={INPUT_STYLE}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Niveau actuel</label>
            <select
              value={form.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={INPUT_STYLE}>
              <option>Débutant</option>
              <option>Intermédiaire</option>
              <option>Avancé</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Pourquoi veux-tu intégrer le programme ?</label>
            <textarea
              value={form.motivation}
              onChange={(e) => setForm({ ...form, motivation: e.target.value })}
              rows={4}
              placeholder="Explique ta situation, tes blocages et ce que tu attends du programme..."
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-none transition-colors focus:border-blue-400/40"
              style={INPUT_STYLE}
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={submit}
              disabled={!form.goal || !form.hours || !form.motivation || submitting}
              className="flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #F5C200, #F97316)" }}>
              {submitting ? "Envoi en cours..." : "Envoyer ma candidature"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
