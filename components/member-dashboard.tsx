"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type HistoryItem = { label: string; date: string };
type Profile = { firstName?: string; email?: string };

// ── Constellation Canvas ─────────────────────────────────────────────────────
const PARTICLE_COUNT = 70;
const LINK_DIST = 130;
const BG = "#05092A";

function ConstellationBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId: number;
    let lastTs = 0;
    const FRAME_MS = 1000 / 30;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      lastTs = 0;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // Init particles
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
    }));

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Move & bounce
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      // Draw lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.28;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${alpha.toFixed(2)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw dots
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.55)";
        ctx.fill();
      }
    };

    const loop = (ts: number) => {
      rafId = requestAnimationFrame(loop);
      if (ts - lastTs < FRAME_MS) return;
      lastTs = ts;
      draw();
    };
    rafId = requestAnimationFrame(loop);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastTs = 0;
        rafId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}

// ── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
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
    const existing = localStorage.getItem("gm_profile");
    const parsed = existing ? (JSON.parse(existing) as Profile) : {};
    localStorage.setItem("gm_profile", JSON.stringify({ ...parsed, email }));
    setLoggedIn(true);
    setProfile((prev) => ({ ...prev, email }));
  };

  const loginWithGoogle = () => {
    const mockEmail = "utilisateur@gmail.com";
    const mockName = "Membre Google";
    localStorage.setItem("gm_member_session", JSON.stringify({ email: mockEmail, at: Date.now(), provider: "google" }));
    localStorage.setItem("gm_profile", JSON.stringify({ email: mockEmail, firstName: mockName }));
    setLoggedIn(true);
    setProfile({ email: mockEmail, firstName: mockName });
  };

  const logout = () => {
    localStorage.removeItem("gm_member_session");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return (
      <div className="relative min-h-screen" style={{ background: BG }}>
        <ConstellationBg />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

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
                "Accès à tes formations achetées",
                "Suivi de ton profil et de ta progression",
                "Résultats de ton diagnostic sauvegardés",
                "Accès aux ressources membres exclusives",
              ].map((label) => (
                <li key={label} className="flex items-center gap-3 text-sm text-white/70">
                  <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="#F5C200" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  {label}
                </li>
              ))}
            </ul>

            <div className="mt-10">
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
            <div className="rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>

              {/* Tabs */}
              <div className="flex rounded-xl p-1 mb-7" style={{ background: "rgba(255,255,255,0.06)" }}>
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

              {/* Google button */}
              <button
                onClick={loginWithGoogle}
                className="flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.14)",
                }}
              >
                <GoogleIcon />
                Continuer avec Google
              </button>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                <span className="text-xs text-white/25">ou</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Form */}
              <div className="space-y-4">
                {authTab === "signup" && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-white/50">Prénom</label>
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ton prénom"
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
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
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
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
                    className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none"
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

              <p className="mt-6 text-center text-xs leading-relaxed text-white/25">
                En créant un compte, tu acceptes les conditions d'utilisation de la plateforme GrowthMentor.
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
