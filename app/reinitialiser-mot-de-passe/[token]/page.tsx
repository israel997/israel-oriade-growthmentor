"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const EyeOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
);
const Check = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);
const X = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const SPECIAL_RE = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const hasLength = password.length >= 8;
  const hasSpecial = SPECIAL_RE.test(password);
  const pwdMatch = password.length > 0 && confirm.length > 0 && password === confirm;
  const pwdMismatch = confirm.length > 0 && password !== confirm;

  const INPUT = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(96,165,250,0.2)",
    color: "white",
  };
  const INPUT_ERROR = { ...INPUT, border: "1px solid rgba(248,113,113,0.5)" };
  const INPUT_OK = { ...INPUT, border: "1px solid rgba(74,222,128,0.4)" };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!hasLength || !hasSpecial) { setError("Le mot de passe ne respecte pas les critères."); return; }
    if (!pwdMatch) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setSuccess(true);
      setTimeout(() => router.push("/connexion"), 2500);
    } catch {
      setError("Erreur réseau. Réessaie.");
      setLoading(false);
    }
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
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Nouveau mot de passe</p>
        </div>

        <div className="rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(96,165,250,0.15)" }}>

          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(74,222,128,0.15)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-white font-semibold">Mot de passe mis à jour !</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>Redirection vers la connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Nouveau mot de passe</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none placeholder:text-white/20"
                    style={password.length > 0 && (!hasLength || !hasSpecial) ? INPUT_ERROR : password.length > 0 && hasLength && hasSpecial ? INPUT_OK : INPUT}
                    placeholder="8 caractères minimum" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showPwd ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs flex items-center gap-1.5" style={{ color: hasLength ? "#4ADE80" : "#F87171" }}>
                      {hasLength ? <Check /> : <X />} 8 caractères minimum
                    </p>
                    <p className="text-xs flex items-center gap-1.5" style={{ color: hasSpecial ? "#4ADE80" : "#F87171" }}>
                      {hasSpecial ? <Check /> : <X />} Au moins un caractère spécial (!@#$%&*...)
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Confirmer</label>
                <div className="relative">
                  <input type={showConfirm ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none placeholder:text-white/20"
                    style={pwdMismatch ? INPUT_ERROR : pwdMatch ? INPUT_OK : INPUT}
                    placeholder="••••••••" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {pwdMismatch && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#F87171" }}><X /> Les mots de passe ne correspondent pas</p>
                )}
                {pwdMatch && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#4ADE80" }}><Check /> Les mots de passe correspondent</p>
                )}
              </div>
              {error && <p className="text-sm flex items-start gap-1.5" style={{ color: "#F87171" }}><X />{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                {loading ? "Mise à jour..." : "Mettre à jour mon mot de passe"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "rgba(255,255,255,0.2)" }}>
          <Link href="/connexion" className="hover:text-white transition-colors">← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}
