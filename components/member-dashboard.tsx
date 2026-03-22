"use client";

import { useEffect, useMemo, useState } from "react";

type HistoryItem = { label: string; date: string };

type Profile = {
  firstName?: string;
  email?: string;
};

export default function MemberDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [profile, setProfile] = useState<Profile>({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLoggedIn(Boolean(localStorage.getItem("gm_member_session")));
      setProfile(JSON.parse(localStorage.getItem("gm_profile") || "{}"));
      setFavorites(JSON.parse(localStorage.getItem("gm_favorites") || "[]"));
      setHistory(JSON.parse(localStorage.getItem("gm_history") || "[]"));
      setNotifications(JSON.parse(localStorage.getItem("gm_notifications") || "[]"));
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const firstName = useMemo(() => profile.firstName || "Membre", [profile.firstName]);

  const login = () => {
    if (!email || !password) return;
    localStorage.setItem("gm_member_session", JSON.stringify({ email, at: Date.now() }));
    setLoggedIn(true);
    const existing = localStorage.getItem("gm_profile");
    const parsed = existing ? (JSON.parse(existing) as Profile) : {};
    localStorage.setItem("gm_profile", JSON.stringify({ ...parsed, email }));
    setProfile((prev) => ({ ...prev, email }));
  };

  const logout = () => {
    localStorage.removeItem("gm_member_session");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <section className="mx-auto max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
        <h1 className="text-xl font-semibold text-white">Connexion / inscription</h1>
        <p className="mt-2 text-sm text-slate-300">MVP local: session enregistrée dans le navigateur.</p>
        <div className="mt-4 space-y-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Mot de passe"
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
          />
          <button onClick={login} className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950">
            Se connecter / s’inscrire
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-slate-900 p-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Espace membre</h1>
          <p className="text-sm text-slate-300">Bienvenue {firstName}</p>
        </div>
        <button onClick={logout} className="rounded-full border border-white/30 px-3 py-1 text-xs text-white">
          Déconnexion
        </button>
      </div>

      <article className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="font-semibold text-white">Favoris ({favorites.length})</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
          {favorites.length ? favorites.map((f) => <li key={f}>{f}</li>) : <li>Aucun favori pour le moment.</li>}
        </ul>
      </article>

      <article className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="font-semibold text-white">Historique ({history.length})</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
          {history.length ? history.map((h, i) => <li key={`${h.label}-${i}`}>{h.label}</li>) : <li>Aucune visite enregistrée.</li>}
        </ul>
      </article>

      <article className="rounded-xl border border-slate-700 bg-slate-900 p-4">
        <h2 className="font-semibold text-white">Notifications ({notifications.length})</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">
          {notifications.length
            ? notifications.map((n) => <li key={n}>{n}</li>)
            : <li>Pas encore de notifications.</li>}
        </ul>
      </article>
    </section>
  );
}
