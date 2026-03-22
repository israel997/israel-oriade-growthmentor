"use client";

import { useState } from "react";

type Profile = {
  firstName: string;
  gender: string;
  goal: string;
};

export default function OnboardingModal({ onSaved }: { onSaved: (name: string) => void }) {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("gm_profile");
  });
  const [profile, setProfile] = useState<Profile>({ firstName: "", gender: "", goal: "" });

  const saveProfile = () => {
    if (!profile.firstName.trim()) return;
    localStorage.setItem("gm_profile", JSON.stringify(profile));
    onSaved(profile.firstName.trim());
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-emerald-400/20 bg-slate-900 p-5">
        <h2 className="mb-2 text-lg font-semibold text-white">Personnalisons ton expérience</h2>
        <p className="mb-4 text-sm text-slate-300">Dis-nous qui tu es pour te guider automatiquement.</p>

        <div className="space-y-3">
          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            placeholder="Prénom"
            value={profile.firstName}
            onChange={(e) => setProfile((s) => ({ ...s, firstName: e.target.value }))}
          />

          <select
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            value={profile.gender}
            onChange={(e) => setProfile((s) => ({ ...s, gender: e.target.value }))}
          >
            <option value="">Sexe</option>
            <option value="Homme">Homme</option>
            <option value="Femme">Femme</option>
            <option value="Autre">Autre</option>
          </select>

          <input
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
            placeholder="Objectif (optionnel)"
            value={profile.goal}
            onChange={(e) => setProfile((s) => ({ ...s, goal: e.target.value }))}
          />
        </div>

        <button
          onClick={saveProfile}
          className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
        >
          Démarrer
        </button>
      </div>
    </div>
  );
}
