"use client";

import { motion } from "framer-motion";
import Link from "next/link";
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
  const [firstName, setFirstName] = useState("");
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
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

  const displayName = useMemo(() => profile.firstName || "Membre", [profile.firstName]);

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
      <div className="relative min-h-screen" style={{ background: "#05092A" }}>
        {/* Grain */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 opacity-[0.25]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns=’http://www.w3.org/2000/svg’ width=’300’ height=’300’%3E%3Cfilter id=’n’%3E%3CfeTurbulence type=’fractalNoise’ baseFrequency=’0.75’ numOctaves=’4’ stitchTiles=’stitch’/%3E%3C/filter%3E%3Crect width=’300’ height=’300’ filter=’url(%23n)’ opacity=’1’/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "300px 300px",
          }}
        />
        <div aria-hidden className="pointer-events-none fixed inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 30% 50%, rgba(30,80,200,0.2) 0%, transparent 70%)" }} />

        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* ── Colonne gauche : pitch ── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: "rgba(245,194,0,0.12)", color: "#F5C200" }}>
              Espace membre
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Ton espace <span style={{ color: "#F5C200" }}>personnel</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/50">
              Connecte-toi pour accéder à ton tableau de bord, suivre ta progression et retrouver tes formations.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                { icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", label: "Accès à tes formations achetées" },
                { icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", label: "Suivi de ton profil et de ta progression" },
                { icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", label: "Résultats de ton diagnostic sauvegardés" },
                { icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z", label: "Accès aux ressources membres exclusives" },
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-3 text-sm text-white/70">
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#F5C200" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {item.label}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-3">
              <Link
                href="/diagnostic"
                className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold text-white/70 transition-all hover:text-white hover:border-white/30"
                style={{ borderColor: "rgba(255,255,255,0.12)" }}
              >
                Faire mon diagnostic
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* ── Colonne droite : formulaire ── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(16px)" }}>

              {/* Tabs */}
              <div className="flex rounded-xl p-1 mb-8" style={{ background: "rgba(255,255,255,0.06)" }}>
                {(["login", "signup"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setAuthTab(tab)}
                    className="flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all"
                    style={{
                      background: authTab === tab ? "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" : "transparent",
                      color: authTab === tab ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {tab === "login" ? "Se connecter" : "Créer un compte"}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {authTab === "signup" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Prénom</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ton prénom"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all focus:ring-2"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Adresse email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    type="email"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-white/50">Mot de passe</label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>

                <button
                  onClick={login}
                  className="mt-2 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
                >
                  {authTab === "login" ? "Se connecter" : "Créer mon compte"}
                </button>

                <p className="text-center text-xs text-white/30">
                  {authTab === "login" ? (
                    <>Pas encore de compte ?{" "}
                      <button onClick={() => setAuthTab("signup")} className="text-white/60 underline underline-offset-2 hover:text-white">
                        Créer un compte
                      </button>
                    </>
                  ) : (
                    <>Déjà un compte ?{" "}
                      <button onClick={() => setAuthTab("login")} className="text-white/60 underline underline-offset-2 hover:text-white">
                        Se connecter
                      </button>
                    </>
                  )}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-xs text-white/25">ou</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              <p className="mt-5 text-center text-xs leading-relaxed text-white/30">
                En créant un compte, tu acceptes les conditions d’utilisation de la plateforme GrowthMentor.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-slate-900 p-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Espace membre</h1>
          <p className="text-sm text-slate-300">Bienvenue {displayName}</p>
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
