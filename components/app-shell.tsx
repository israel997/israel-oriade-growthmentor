"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useHandedness } from "@/hooks/useHandedness";

const navLinks = [
  ["Accueil", "/"],
  ["Mentor", "/mentor"],
  ["Formations", "/formations"],
  ["Ressources", "/ressources"],
  ["Outils Testés", "/testes"],
  ["Contenus", "/contenus"],
  ["Communauté", "/communaute"],
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: authSession } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);


  const memberName = authSession?.user?.name?.split(" ")[0] ?? null;
  const isAdmin = (authSession?.user as { role?: string })?.role === "admin";
  const { handedness } = useHandedness();
  const burgerRight = handedness === "right";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleDiagnosticClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/diagnostic");
  };

  const bare = pathname.replace(/^\/[a-z]{2}(?=\/)/, "");
  if (bare.startsWith("/admin")) return <>{children}</>;
  if (bare.startsWith("/espace-membre")) return <>{children}</>;

  return (
    <>
      <header
        className="sticky top-0 z-30 transition-all duration-300"
        style={{
          background: "rgba(6,11,46,0.95)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
        }}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* Burger mobile — gaucher : à gauche */}
          {!burgerRight && (
            <button
              type="button"
              aria-label="Menu"
              className="inline-flex rounded-lg border p-2 md:hidden"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold tracking-tight sm:text-xl"
            style={{ color: "#ffffff" }}
          >
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "#070F3C", color: "#fff" }}
            >
              I
            </span>
            Israël Oriadé
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center md:flex">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="px-1.5 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#F5C200]"
                style={{
                  color: pathname === href ? "#F5C200" : "rgba(255,255,255,0.85)",
                  background: "transparent",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleDiagnosticClick}
              className="nav-btn hidden rounded-xl border px-4 py-2 text-sm font-semibold transition-all md:inline-flex"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff" }}
            >
              Évaluer mon niveau
            </button>

            <Link
              href="/espace-membre"
              className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-[1.02] hover:brightness-75 hover:text-yellow-400 md:inline-flex"
              style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
            >
              {memberName ? (
                <>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                    style={{ background: "rgba(255,255,255,0.2)" }}>
                    {memberName[0].toUpperCase()}
                  </span>
                  {memberName}
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Mon espace
                </>
              )}
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02] md:inline-flex"
                style={{ background: "rgba(245,194,0,0.12)", border: "1px solid rgba(245,194,0,0.25)", color: "#F5C200" }}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
                Backoffice
              </Link>
            )}

            {/* Burger mobile — droitier : à droite (par défaut) */}
            {burgerRight && (
              <button
                type="button"
                aria-label="Menu"
                className="inline-flex rounded-lg border p-2 md:hidden"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                onClick={() => setMobileOpen((v) => !v)}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            )}
          </div>
        </div>

      </header>

      {/* Mobile menu — panneau latéral */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden flex"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", justifyContent: burgerRight ? "flex-end" : "flex-start" }}
        >
          {/* Overlay clic pour fermer */}
          <div className="absolute inset-0" onClick={() => setMobileOpen(false)} />

          {/* Panneau — gauche ou droite selon préférence */}
          <div
            className="relative z-10 flex flex-col h-full w-72 max-w-[85vw]"
            style={{
              background: "rgba(6,11,46,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderLeft: burgerRight ? "1px solid rgba(255,255,255,0.08)" : "none",
              borderRight: !burgerRight ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            {/* Top bar avec logo + close */}
            <div className={`flex items-center justify-between px-4 py-3 border-b`} style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <Link href="/" className="flex items-center gap-2 text-base font-bold text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ background: "#070F3C" }}>I</span>
                Israël Oriadé
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                aria-label="Fermer le menu"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center rounded-xl px-4 py-3 text-base font-medium transition-all"
                  style={{
                    color: pathname === href ? "#F5C200" : "rgba(255,255,255,0.85)",
                    background: pathname === href ? "rgba(245,194,0,0.08)" : "transparent",
                    borderLeft: pathname === href ? "3px solid #F5C200" : "3px solid transparent",
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* CTA buttons */}
            <div className="px-4 pb-8 pt-2 space-y-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <div className="flex flex-col gap-2">
                <button
                  onClick={(e) => { setMobileOpen(false); handleDiagnosticClick(e); }}
                  className="w-full rounded-xl border px-3 py-3 text-center text-sm font-semibold text-white"
                  style={{ borderColor: "rgba(255,255,255,0.25)" }}
                >
                  Évaluer mon niveau
                </button>
                <Link
                  href="/espace-membre"
                  className="w-full rounded-xl px-3 py-3 text-center text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
                >
                  {memberName ?? "Mon espace"}
                </Link>
              </div>
              {isAdmin && (
                <Link href="/admin" className="block rounded-xl px-3 py-3 text-center text-sm font-semibold" style={{ background: "rgba(245,194,0,0.1)", border: "1px solid rgba(245,194,0,0.2)", color: "#F5C200" }}>
                  ← Backoffice
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="w-full">{children}</main>

      <footer className="relative overflow-hidden border-t border-white/10 px-6 py-10" style={{ background: "#060B2E" }}>
        <div className="relative mx-auto max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold text-white">Israël Oriadé</p>
          <p className="text-xs text-white/40">© 2026 GrowthMentor · Plateforme d'accompagnement personnalisée</p>
          <div className="flex gap-4 text-xs text-white/40">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/formations" className="hover:text-white transition-colors">Formations</Link>
            <Link href="/discussion" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </>
  );
}
