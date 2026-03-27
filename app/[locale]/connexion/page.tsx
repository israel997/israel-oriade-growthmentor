"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

type Tab = "login" | "register";

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

const flagEmoji = (code: string) =>
  [...code.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join("");

const COUNTRIES = [
  { code: "FR", name: "France" }, { code: "BE", name: "Belgique" }, { code: "CH", name: "Suisse" },
  { code: "CA", name: "Canada" }, { code: "CI", name: "Côte d'Ivoire" }, { code: "SN", name: "Sénégal" },
  { code: "MA", name: "Maroc" }, { code: "TN", name: "Tunisie" }, { code: "DZ", name: "Algérie" },
  { code: "CM", name: "Cameroun" }, { code: "ML", name: "Mali" }, { code: "CD", name: "RD Congo" },
  { code: "CG", name: "Congo" }, { code: "GA", name: "Gabon" }, { code: "BJ", name: "Bénin" },
  { code: "TG", name: "Togo" }, { code: "BF", name: "Burkina Faso" }, { code: "NE", name: "Niger" },
  { code: "GN", name: "Guinée" }, { code: "RW", name: "Rwanda" }, { code: "MG", name: "Madagascar" },
  { code: "MU", name: "Maurice" }, { code: "RE", name: "La Réunion" }, { code: "US", name: "États-Unis" },
  { code: "GB", name: "Royaume-Uni" }, { code: "DE", name: "Allemagne" }, { code: "ES", name: "Espagne" },
  { code: "IT", name: "Italie" }, { code: "PT", name: "Portugal" }, { code: "NL", name: "Pays-Bas" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SPECIAL_RE = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
const NAME_RE = /^[a-zA-ZÀ-ÿ\s\-']+$/; // only letters, spaces, hyphens, apostrophes

function validateFullName(name: string): string {
  if (!name.trim()) return "";
  if (!NAME_RE.test(name)) return "Le nom ne peut pas contenir de chiffres ou caractères spéciaux.";
  const parts = name.trim().split(/\s+/);
  const tooLong = parts.find(p => p.length > 20);
  if (tooLong) return `"${tooLong}" dépasse 20 caractères.`;
  return "";
}

export default function ConnexionPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [popup, setPopup] = useState<{ title: string; description?: string } | null>(null);

  const [googleLoading, setGoogleLoading] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginEmailTouched, setLoginEmailTouched] = useState(false);
  const [loginPwd, setLoginPwd] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register
  const [regName, setRegName] = useState("");
  const [regNameTouched, setRegNameTouched] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [regEmailTouched, setRegEmailTouched] = useState(false);
  const [regPwd, setRegPwd] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [regPwdConfirm, setRegPwdConfirm] = useState("");
  const [showRegPwdConfirm, setShowRegPwdConfirm] = useState(false);
  const [regError, setRegError] = useState("");
  const [regPays, setRegPays] = useState("");
  const [regWhatsapp, setRegWhatsapp] = useState("");

  const [loading, setLoading] = useState(false);

  // Computed validations
  const nameError = validateFullName(regName);
  const loginEmailValid = EMAIL_RE.test(loginEmail.trim());
  const regEmailValid = EMAIL_RE.test(regEmail.trim());
  const hasLength = regPwd.length >= 8;
  const hasSpecial = SPECIAL_RE.test(regPwd);
  const pwdMatch = regPwd.length > 0 && regPwdConfirm.length > 0 && regPwd === regPwdConfirm;
  const pwdMismatch = regPwdConfirm.length > 0 && regPwd !== regPwdConfirm;

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signIn("google", { redirectTo: "/auth/redirect" });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim() || !loginPwd) { setLoginError("Remplis tous les champs."); return; }
    if (!loginEmailValid) { setLoginError("L'adresse email n'est pas valide."); return; }
    setLoading(true);
    try {
      const res = await signIn("credentials", { email: loginEmail.trim(), password: loginPwd, redirect: false });
      setLoading(false);
      if (res?.error) {
        setLoginError("Email ou mot de passe incorrect. Vérifie tes identifiants.");
      } else {
        fetch("/api/user/profile")
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            const flag = data?.pays ? ` ${flagEmoji(data.pays)}` : "";
            setPopup({ title: `Welcome Back Mentee !${flag}` });
          })
          .catch(() => setPopup({ title: "Welcome Back Mentee !" }));
      }
    } catch {
      setLoading(false);
      setLoginError("Erreur de connexion. Réessaie dans quelques instants.");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    if (!regName.trim() || !regEmail.trim() || !regPwd || !regPays) { setRegError("Remplis tous les champs."); return; }
    if (nameError) { setRegError(nameError); return; }
    if (!regEmailValid) { setRegError("L'adresse email n'est pas valide."); return; }
    if (!hasLength) { setRegError("Le mot de passe doit faire au moins 8 caractères."); return; }
    if (!hasSpecial) { setRegError("Le mot de passe doit contenir au moins un caractère spécial (!@#$%...)."); return; }
    if (pwdMismatch || !pwdMatch) { setRegError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: regName.trim(), email: regEmail.trim(), password: regPwd, pays: regPays, whatsapp: regWhatsapp.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { setLoading(false); setRegError(data.error); return; }
      const login = await signIn("credentials", { email: regEmail.trim(), password: regPwd, redirect: false });
      setLoading(false);
      if (login?.error) { setRegError("Compte créé mais connexion échouée. Connecte-toi manuellement."); setTab("login"); }
      else {
        setPopup({
          title: "Félicitations ! Tu as débloqué ton badge Mentee !",
          description: "Bienvenue dans la communauté GrowthMentor.",
        });
      }
    } catch {
      setLoading(false);
      setRegError("Erreur réseau. Vérifie ta connexion et réessaie.");
    }
  };

  const INPUT = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(96,165,250,0.2)",
    color: "white",
  };

  const INPUT_ERROR = {
    ...INPUT,
    border: "1px solid rgba(248,113,113,0.5)",
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#03071A" }}>
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

          {/* LOGIN */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Email</label>
                <input
                  type="email" value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onBlur={() => setLoginEmailTouched(true)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={loginEmailTouched && loginEmail.length > 0 && !loginEmailValid ? INPUT_ERROR : INPUT}
                  placeholder="ton@email.com" autoComplete="email"
                />
                {loginEmailTouched && loginEmail.length > 0 && !loginEmailValid && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#F87171" }}>
                    <X /> Format d&apos;email invalide (ex: nom@domaine.com)
                  </p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Mot de passe</label>
                  <Link href="/mot-de-passe-oublie" className="text-xs hover:underline" style={{ color: "rgba(96,165,250,0.7)" }}>
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <input type={showLoginPwd ? "text" : "password"} value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none placeholder:text-white/20"
                    style={INPUT} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" onClick={() => setShowLoginPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showLoginPwd ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>
              {loginError && <p className="text-sm flex items-start gap-1.5" style={{ color: "#F87171" }}><X />{loginError}</p>}
              <button type="submit" disabled={loading}
                className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          )}

          {/* REGISTER */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Nom complet</label>
                <input type="text" value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  onBlur={() => setRegNameTouched(true)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={regNameTouched && nameError ? INPUT_ERROR : INPUT}
                  placeholder="Ton prénom et nom" autoComplete="name" />
                {regNameTouched && nameError && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#F87171" }}>
                    <X /> {nameError}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Email</label>
                <input
                  type="email" value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  onBlur={() => setRegEmailTouched(true)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={regEmailTouched && regEmail.length > 0 && !regEmailValid ? INPUT_ERROR : INPUT}
                  placeholder="ton@email.com" autoComplete="email"
                />
                {regEmailTouched && regEmail.length > 0 && !regEmailValid && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#F87171" }}>
                    <X /> Format d&apos;email invalide (ex: nom@domaine.com)
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Mot de passe</label>
                <div className="relative">
                  <input type={showRegPwd ? "text" : "password"} value={regPwd} onChange={(e) => setRegPwd(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none placeholder:text-white/20"
                    style={regPwd.length > 0 && (!hasLength || !hasSpecial) ? INPUT_ERROR : INPUT}
                    placeholder="8 caractères minimum" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowRegPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showRegPwd ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {regPwd.length > 0 && (
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
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Confirmer le mot de passe</label>
                <div className="relative">
                  <input type={showRegPwdConfirm ? "text" : "password"} value={regPwdConfirm} onChange={(e) => setRegPwdConfirm(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none placeholder:text-white/20"
                    style={pwdMismatch ? INPUT_ERROR : pwdMatch ? { ...INPUT, border: "1px solid rgba(74,222,128,0.4)" } : INPUT}
                    placeholder="••••••••" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowRegPwdConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                    {showRegPwdConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {pwdMismatch && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#F87171" }}>
                    <X /> Les mots de passe ne correspondent pas
                  </p>
                )}
                {pwdMatch && (
                  <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#4ADE80" }}>
                    <Check /> Les mots de passe correspondent
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>Pays *</label>
                <select
                  value={regPays}
                  onChange={(e) => setRegPays(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={!regPays ? INPUT_ERROR : INPUT}>
                  <option value="">Sélectionne ton pays</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{flagEmoji(c.code)} {c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>WhatsApp <span style={{ color: "rgba(255,255,255,0.2)" }}>(optionnel)</span></label>
                <input
                  type="tel"
                  value={regWhatsapp}
                  onChange={(e) => setRegWhatsapp(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none placeholder:text-white/20"
                  style={INPUT}
                  placeholder="+33 6 00 00 00 00"
                  autoComplete="tel"
                />
              </div>
              {regError && <p className="text-sm flex items-start gap-1.5" style={{ color: "#F87171" }}><X />{regError}</p>}
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

      {/* Popup modal */}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <div className="relative w-full max-w-sm rounded-3xl p-8 text-center"
            style={{ background: "rgba(6,11,46,0.97)", border: "1px solid rgba(245,194,0,0.3)", boxShadow: "0 0 60px rgba(245,194,0,0.15)" }}>
            <div className="flex justify-center mb-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full"
                style={{ background: "rgba(245,194,0,0.12)", border: "1px solid rgba(245,194,0,0.3)" }}>
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#F5C200" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                  <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
                </svg>
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mb-2">{popup.title}</h2>
            {popup.description && (
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>{popup.description}</p>
            )}
            <button
              onClick={() => { setPopup(null); window.location.href = "/auth/redirect"; }}
              className="w-full rounded-xl py-3 text-sm font-bold text-white transition-transform hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
              Accéder à mon espace →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
