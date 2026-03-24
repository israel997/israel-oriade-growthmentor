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
        <h1 className="text-xl font-bold text-white">Programme Mentee</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Un accompagnement direct et personnalisé avec Israël.</p>
      </div>

      {/* Statut */}
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

      {/* CTA */}
      {app.status === "none" && !showForm && (
        <button onClick={() => setShowForm(true)}
          className="w-full rounded-2xl py-4 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #F5C200, #F97316)" }}>
          Candidater au programme Mentee →
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
