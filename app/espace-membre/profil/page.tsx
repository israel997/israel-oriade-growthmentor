"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Session = { name: string; email: string; photoUrl?: string };

const CARD = { background: "rgba(255,255,255,0.04)", backdropFilter: "blur(16px)", border: "1px solid rgba(96,165,250,0.13)" };
const INPUT = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(96,165,250,0.15)", color: "white" };
const SECTION_LABEL = { color: "rgba(255,255,255,0.35)" };

export default function ProfilPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<Session | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const [nameSaved, setNameSaved] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("gm_member_session");
      if (!s) { router.push("/connexion"); return; }
      const parsed: Session = JSON.parse(s);
      setSession(parsed);
      setName(parsed.name ?? "");
      setEmail(parsed.email ?? "");
      setPhoto(parsed.photoUrl ?? null);
    } catch {}
  }, [router]);

  // Photo upload
  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Resize to max 400x400
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = Math.min(img.width, img.height, 400);
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const ox = (img.width - size) / 2;
        const oy = (img.height - size) / 2;
        ctx.drawImage(img, ox, oy, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        setPhoto(dataUrl);
        saveSession({ photoUrl: dataUrl });
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const saveSession = (patch: Partial<Session>) => {
    try {
      const s: Session = JSON.parse(localStorage.getItem("gm_member_session") ?? "{}");
      const updated = { ...s, ...patch };
      localStorage.setItem("gm_member_session", JSON.stringify(updated));
      setSession(updated);
    } catch {}
  };

  const saveName = () => {
    if (!name.trim()) return;
    saveSession({ name: name.trim(), email: email.trim() });
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2500);
  };

  const savePassword = () => {
    setPwdError("");
    if (!currentPwd) { setPwdError("Saisis ton mot de passe actuel."); return; }
    if (newPwd.length < 8) { setPwdError("Le nouveau mot de passe doit faire au moins 8 caractères."); return; }
    if (newPwd !== confirmPwd) { setPwdError("Les mots de passe ne correspondent pas."); return; }
    // Simulated save
    setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    setPwdSaved(true);
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const deleteAccount = () => {
    localStorage.removeItem("gm_member_session");
    localStorage.removeItem("gm_diag_results");
    localStorage.removeItem("gm_formation_favorites");
    localStorage.removeItem("gm_tool_favorites");
    localStorage.removeItem("gm_content_favorites");
    localStorage.removeItem("gm_notifications");
    localStorage.removeItem("gm_mentee_application");
    router.push("/connexion");
  };

  if (!session) return null;

  const initials = (session.name ?? "M").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Mon Profil</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Gère tes informations personnelles et la sécurité de ton compte.</p>
      </div>

      {/* Avatar */}
      <div className="rounded-2xl p-6 flex items-center gap-6" style={CARD}>
        <div className="relative shrink-0">
          {photo ? (
            <img src={photo} alt="Photo de profil" className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
              {initials}
            </div>
          )}
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full transition-transform hover:scale-110"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)", border: "2px solid #03071A" }}
            aria-label="Changer la photo">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
        </div>
        <div>
          <p className="text-base font-bold text-white">{session.name}</p>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{session.email}</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-3 text-sm font-medium transition-opacity hover:opacity-80"
            style={{ color: "#93C5FD" }}>
            Changer la photo de profil
          </button>
        </div>
      </div>

      {/* Informations */}
      <div className="rounded-2xl p-6 space-y-4" style={CARD}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={SECTION_LABEL}>Informations personnelles</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={SECTION_LABEL}>Nom complet</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={INPUT}
              placeholder="Ton nom"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={SECTION_LABEL}>Adresse email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={INPUT}
              placeholder="ton@email.com"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={saveName}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            Enregistrer
          </button>
          {nameSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#34D399" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              Modifications enregistrées
            </span>
          )}
        </div>
      </div>

      {/* Mot de passe */}
      <div className="rounded-2xl p-6 space-y-4" style={CARD}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={SECTION_LABEL}>Changer le mot de passe</p>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={SECTION_LABEL}>Mot de passe actuel</label>
          <input
            type="password"
            value={currentPwd}
            onChange={(e) => setCurrentPwd(e.target.value)}
            className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
            style={INPUT}
            placeholder="••••••••"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={SECTION_LABEL}>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={INPUT}
              placeholder="8 caractères min."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={SECTION_LABEL}>Confirmer</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
              style={INPUT}
              placeholder="••••••••"
            />
          </div>
        </div>

        {pwdError && <p className="text-sm" style={{ color: "#F87171" }}>{pwdError}</p>}

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={savePassword}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            Mettre à jour
          </button>
          {pwdSaved && (
            <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#34D399" }}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              Mot de passe mis à jour
            </span>
          )}
        </div>
      </div>

      {/* Zone danger */}
      <div className="rounded-2xl p-6 space-y-4"
        style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)", backdropFilter: "blur(16px)" }}>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(248,113,113,0.7)" }}>Zone dangereuse</p>

        {!showDelete ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Supprimer mon compte</p>
              <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Cette action est irréversible. Toutes tes données seront supprimées.</p>
            </div>
            <button
              onClick={() => setShowDelete(true)}
              className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{ background: "rgba(248,113,113,0.1)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>
              Supprimer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold" style={{ color: "#F87171" }}>
              Es-tu sûr(e) de vouloir supprimer ton compte ?
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Toutes tes données (diagnostic, favoris, candidature Mentee) seront perdues définitivement.
            </p>
            <div className="flex gap-3">
              <button
                onClick={deleteAccount}
                className="rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors"
                style={{ background: "#EF4444" }}>
                Oui, supprimer définitivement
              </button>
              <button
                onClick={() => setShowDelete(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
