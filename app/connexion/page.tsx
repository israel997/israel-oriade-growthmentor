"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Tab = "login" | "register";

export default function ConnexionPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [googleLoading, setGoogleLoading] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");
  const [loginError, setLoginError] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPwd, setRegPwd] = useState("");
  const [regPwdConfirm, setRegPwdConfirm] = useState("");
  const [regError, setRegError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/espace-membre" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim() || !loginPwd) { setLoginError("Remplis tous les champs."); return; }
    setLoading(true);
    const res = await signIn("credentials", {
      email: loginEmail.trim(),
      password: loginPwd,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setLoginError("Email ou mot de passe incorrect.");
    } else {
      router.push("/espace-membre");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regName.trim() || !regEmail.trim() || !regPwd) { setRegError("Remplis tous les champs."); return; }
    if (regPwd.length < 8) { setRegError("Le mot de passe doit faire au moins 8 caractères."); return; }
    if (regPwd !== regPwdConfirm) { setRegError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regName.trim(), email: regEmail.trim(), password: regPwd }),
    });
    const data = await res.json();
    if (!res.ok) { setLoading(false); setRegError(data.error); return; }
    // Auto-login after register
    const login = await signIn("credentials", {
      email: regEmail.trim(),
      password: regPwd,
      redirect: false,
    });
    setLoading(false);
    if (login?.error) { setRegError("Compte créé mais connexion échouée. Connecte-toi manuellement."); setTab("login"); }
    else router.push("/espace-membre");
  };

  const INPUT = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(96,165,250,0.2)",
    color: "white",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#03071A" }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: "absolute", width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600, left: "-10%", top: "-10%", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(26,63,216,0.4) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500, right: "-5%", bottom: "0%", borderRadius: "50%", background: "radial-gradient(circle at 60% 60%, rgba(139,92,246,0.3) 0%, transparent 70%)", filter: "blur(55px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-xl font-black tracking-tight text-white">
            Growth<span style={{ color: "#F5C200" }}>Mentor</span>
          </Link>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Espace Membre</p>
        </div>

        <div className="rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(96,165,250,0.15)" }}>

          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 text-sm font-semibold transition-all hover:scale-[1.01] disabled:opacity-60 mb-6"
            style={{ background: "rgba(255,255,255,0.07)", color: "white", border: "1px solid rgba(255,255,255,0.12)" }}>
            {googleLoading
              ? <div className="h-4 w-4 rounded-full border-2 animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
              : <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            }
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>ou</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: "rgba(255,255,255,0.04)" }}>
            {(["login", "register"] as Tab[]).map((t) => (
              <button key={t} onClick={() => { setTab(t); setLoginError(""); setRegError(""); }}
                className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all"
                style={{
                  background: tab === t ? "rgba(26,63,216,0.5)" : "transparent",
                  color: tab === t ? "#fff" : "rgba(255,255,255,0.4)",
                  border: tab === t ? "1px solid rgba(96,165,250,0.3)" : "1px solid transparent",
                }}>
                {t === "login" ? "Se connecter" : "Créer un compte"}
              </button>
            ))}
          </div>

          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Email</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="ton@email.com" autoComplete="email" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Mot de passe</label>
                <input type="password" value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="••••••••" autoComplete="current-password" />
              </div>
              {loginError && <p className="text-sm" style={{ color: "#F87171" }}>{loginError}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Nom complet</label>
                <input type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="Ton prénom et nom" autoComplete="name" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Email</label>
                <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="ton@email.com" autoComplete="email" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Mot de passe</label>
                <input type="password" value={regPwd} onChange={(e) => setRegPwd(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="8 caractères minimum" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Confirmer</label>
                <input type="password" value={regPwdConfirm} onChange={(e) => setRegPwdConfirm(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="••••••••" autoComplete="new-password" />
              </div>
              {regError && <p className="text-sm" style={{ color: "#F87171" }}>{regError}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          <Link href="/" className="hover:text-white transition-colors">← Retour au site</Link>
        </p>
      </div>
    </div>
  );
}
