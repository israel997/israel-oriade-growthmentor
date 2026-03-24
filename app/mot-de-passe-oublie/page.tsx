"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Entre ton adresse email."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setSent(true);
      setLoading(false);
    } catch {
      setError("Erreur réseau. Réessaie.");
      setLoading(false);
    }
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
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>Réinitialisation du mot de passe</p>
        </div>

        <div className="rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(96,165,250,0.15)" }}>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto" style={{ background: "rgba(74,222,128,0.15)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-white font-semibold">Email envoyé !</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Si cette adresse est associée à un compte, tu recevras un lien de réinitialisation dans quelques instants.
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Ce lien expire dans 1 heure. Vérifie aussi tes spams.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                Entre ton adresse email et nous t&apos;enverrons un lien pour réinitialiser ton mot de passe.
              </p>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT} placeholder="ton@email.com" autoComplete="email" />
              </div>
              {error && <p className="text-sm" style={{ color: "#F87171" }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                {loading ? "Envoi..." : "Envoyer le lien"}
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
