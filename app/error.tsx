"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#03071A" }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: "absolute", width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600, left: "-10%", top: "-10%", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(220,38,38,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500, right: "-5%", bottom: "0%", borderRadius: "50%", background: "radial-gradient(circle at 60% 60%, rgba(139,92,246,0.2) 0%, transparent 70%)", filter: "blur(55px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        <Link href="/" className="inline-block text-xl font-black tracking-tight text-white">
          Growth<span style={{ color: "#F5C200" }}>Mentor</span>
        </Link>

        <div className="rounded-3xl p-10 space-y-5"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(248,113,113,0.2)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)" }}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>

          <div>
            <p className="text-5xl font-black text-white mb-2">500</p>
            <h1 className="text-lg font-bold text-white">Une erreur est survenue</h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              Quelque chose s&apos;est mal passé de notre côté. Réessaie ou reviens plus tard.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={reset}
              className="w-full rounded-xl py-3 text-sm font-bold text-white text-center transition-transform hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #DC2626, #F87171)" }}>
              Réessayer
            </button>
            <Link href="/"
              className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
