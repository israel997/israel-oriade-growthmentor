"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type Profile = {
  firstName: string;
  gender: string;
  country: string;
};

const countries = [
  "Bénin", "Burkina Faso", "Cameroun", "Côte d'Ivoire", "France",
  "Gabon", "Guinée", "Madagascar", "Mali", "Maroc", "Mauritanie",
  "Niger", "République du Congo", "RD Congo", "Sénégal", "Togo",
  "Tunisie", "Autre",
];

const genders = [
  { value: "Homme", icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" },
  { value: "Femme", icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" },
  { value: "Autre", icon: "M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" },
];

const steps = ["firstName", "gender", "country"] as const;
type Step = typeof steps[number];

export default function OnboardingModal({ onSaved }: { onSaved: (name: string) => void }) {
  const [open, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("gm_profile");
  });
  const [step, setStep] = useState<Step>("firstName");
  const [direction, setDirection] = useState(1);
  const [profile, setProfile] = useState<Profile>({ firstName: "", gender: "", country: "" });

  const saveProfile = () => {
    localStorage.setItem("gm_profile", JSON.stringify(profile));
    onSaved(profile.firstName.trim());
    setOpen(false);
  };

  const next = (field: keyof Profile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setDirection(1);

    if (field === "firstName") { setStep("gender"); return; }
    if (field === "gender") { setStep("country"); return; }
    if (field === "country") {
      localStorage.setItem("gm_profile", JSON.stringify(updated));
      onSaved(updated.firstName.trim());
      setOpen(false);
    }
  };

  const canProceedName = profile.firstName.trim().length >= 2;

  if (!open) return null;

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 60 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d * -60 }),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl"
        style={{ background: "#0A1240", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* Grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px 200px",
          }}
        />

        {/* Progress dots */}
        <div className="relative flex justify-center gap-2 pt-7 pb-2">
          {steps.map((s, i) => (
            <motion.span
              key={s}
              animate={{
                width: step === s ? 24 : 6,
                background: step === s ? "#F5C200" : steps.indexOf(step) > i ? "#F5C200" : "rgba(255,255,255,0.2)",
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
              style={{ display: "inline-block" }}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="relative px-8 pb-8 pt-4" style={{ minHeight: 260 }}>
          <AnimatePresence mode="wait" custom={direction}>
            {/* ── Étape 1 : Prénom ── */}
            {step === "firstName" && (
              <motion.div
                key="firstName"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#60A5FA" }}>01 / 03</p>
                <h2 className="text-2xl font-bold text-white mt-2">Comment tu t'appelles ?</h2>
                <p className="mt-1 text-sm text-white/40">Pour personnaliser ton expérience.</p>

                <input
                  autoFocus
                  className="mt-6 w-full rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
                  placeholder="Ton prénom"
                  value={profile.firstName}
                  onChange={(e) => setProfile((s) => ({ ...s, firstName: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter" && canProceedName) next("firstName", profile.firstName); }}
                />

                <button
                  onClick={() => canProceedName && next("firstName", profile.firstName)}
                  disabled={!canProceedName}
                  className="mt-4 w-full rounded-xl py-3.5 text-sm font-semibold text-black transition-all"
                  style={{
                    background: canProceedName ? "#F5C200" : "rgba(255,255,255,0.08)",
                    color: canProceedName ? "#000" : "rgba(255,255,255,0.25)",
                  }}
                >
                  Continuer
                </button>
              </motion.div>
            )}

            {/* ── Étape 2 : Genre ── */}
            {step === "gender" && (
              <motion.div
                key="gender"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#60A5FA" }}>02 / 03</p>
                <h2 className="text-2xl font-bold text-white mt-2">Tu es ?</h2>
                <p className="mt-1 text-sm text-white/40">Cela nous aide à mieux t'accompagner.</p>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  {genders.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => next("gender", g.value)}
                      className="flex flex-col items-center gap-2 rounded-2xl py-5 text-sm font-semibold transition-all hover:scale-[1.03]"
                      style={{
                        background: profile.gender === g.value ? "rgba(245,194,0,0.15)" : "rgba(255,255,255,0.05)",
                        border: profile.gender === g.value ? "1.5px solid #F5C200" : "1px solid rgba(255,255,255,0.08)",
                        color: profile.gender === g.value ? "#F5C200" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={g.icon} />
                      </svg>
                      {g.value}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── Étape 3 : Pays ── */}
            {step === "country" && (
              <motion.div
                key="country"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#60A5FA" }}>03 / 03</p>
                <h2 className="text-2xl font-bold text-white mt-2">Tu es d'où ?</h2>
                <p className="mt-1 text-sm text-white/40">Pour des conseils adaptés à ton marché.</p>

                <div className="mt-6 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                  {countries.map((c) => (
                    <button
                      key={c}
                      onClick={() => next("country", c)}
                      className="rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all hover:scale-[1.02]"
                      style={{
                        background: profile.country === c ? "rgba(245,194,0,0.15)" : "rgba(255,255,255,0.05)",
                        border: profile.country === c ? "1.5px solid #F5C200" : "1px solid rgba(255,255,255,0.08)",
                        color: profile.country === c ? "#F5C200" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
