"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const OnboardingModal = dynamic(() => import("@/components/onboarding-modal"), {
  ssr: false
});

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

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
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:border-[#F5C200]"
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
            <Link
              href="/diagnostic"
              className="nav-btn hidden rounded-xl border px-4 py-2 text-sm font-semibold transition-all md:inline-flex"
              style={
                { borderColor: "rgba(255,255,255,0.3)", color: "#fff" }
              }
            >
              Évaluer mon niveau
            </Link>

            <Link
              href="/espace-membre"
              className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] md:inline-flex"
              style={{ background: "#F5C200" }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Mon espace
            </Link>

            {/* Burger mobile */}
            <button
              type="button"
              aria-label="Menu"
              className="inline-flex rounded-lg border p-2 md:hidden"
              style={
                { borderColor: "rgba(255,255,255,0.2)", color: "#fff" }
              }
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-white/10 px-4 pb-4 pt-3 md:hidden" style={{ background: "rgba(6,11,46,0.97)", backdropFilter: "blur(18px)" }}>
            <nav className="space-y-1">
              {navLinks.map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-lg px-3 py-2 text-sm font-medium"
                  style={{
                    color: pathname === href ? "#F5C200" : "rgba(255,255,255,0.85)",
                    background: pathname === href ? "rgba(201,168,76,0.10)" : "transparent",
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 grid gap-2">
              <Link href="/diagnostic" className="rounded-lg border border-black/15 px-3 py-2.5 text-center text-sm font-semibold text-[#111]">
                Évaluer mon niveau
              </Link>
              <Link href="/espace-membre" className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-black" style={{ background: "#F5C200" }}>
                Mon espace
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="w-full">{children}</main>

      <footer className="relative overflow-hidden border-t border-black/10 px-6 py-10" style={{ background: "linear-gradient(135deg, #8C8C8C 0%, #D0D0D0 55%, #B8B8B8 100%)" }}>
        <div className="relative mx-auto max-w-6xl flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold" style={{ color: "#070F3C" }}>Israël Oriadé</p>
          <p className="text-xs text-[#666]">© 2026 GrowthMentor · Plateforme d'accompagnement personnalisée</p>
          <div className="flex gap-4 text-xs text-[#666]">
            <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
            <Link href="/formations" className="hover:text-black transition-colors">Formations</Link>
            <Link href="/discussion" className="hover:text-black transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      <OnboardingModal onSaved={() => {}} />
    </>
  );
}
