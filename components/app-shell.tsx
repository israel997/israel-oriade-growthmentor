"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    try {
      const s = localStorage.getItem("gm_member_session");
      if (s) setMemberName(JSON.parse(s).name?.split(" ")[0] ?? null);
    } catch {}
  }, [pathname]);

  const handleDiagnosticClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const hasProfile = typeof window !== "undefined" && !!localStorage.getItem("gm_profile");
    if (!hasProfile) {
      setShowOnboarding(true);
    } else {
      router.push("/diagnostic");
    }
  };

  if (pathname.startsWith("/admin")) return <>{children}</>;
  if (pathname.startsWith("/espace-membre")) return <>{children}</>;

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
              className="hidden items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02] md:inline-flex"
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
              <button onClick={handleDiagnosticClick} className="rounded-lg border border-white/20 px-3 py-2.5 text-center text-sm font-semibold text-white">
                Évaluer mon niveau
              </button>
              <Link href="/espace-membre" className="rounded-lg px-3 py-2.5 text-center text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
                {memberName ?? "Mon espace"}
              </Link>
            </div>
          </div>
        )}
      </header>

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

      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSaved={() => { setShowOnboarding(false); router.push("/diagnostic"); }}
      />
    </>
  );
}
