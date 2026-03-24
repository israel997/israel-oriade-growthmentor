import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#03071A" }}>
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div style={{ position: "absolute", width: "60vw", height: "60vw", maxWidth: 600, maxHeight: 600, left: "-10%", top: "-10%", borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, rgba(26,63,216,0.35) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: "50vw", height: "50vw", maxWidth: 500, maxHeight: 500, right: "-5%", bottom: "0%", borderRadius: "50%", background: "radial-gradient(circle at 60% 60%, rgba(139,92,246,0.25) 0%, transparent 70%)", filter: "blur(55px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-md text-center space-y-6">
        <Link href="/" className="inline-block text-xl font-black tracking-tight text-white">
          Growth<span style={{ color: "#F5C200" }}>Mentor</span>
        </Link>

        <div className="rounded-3xl p-10 space-y-5"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(96,165,250,0.15)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)" }}>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="12"/><line x1="11" y1="16" x2="11.01" y2="16"/>
            </svg>
          </div>

          <div>
            <p className="text-5xl font-black text-white mb-2">404</p>
            <h1 className="text-lg font-bold text-white">Page introuvable</h1>
            <p className="text-sm mt-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              La page que tu cherches n&apos;existe pas ou a été déplacée.
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link href="/"
              className="w-full rounded-xl py-3 text-sm font-bold text-white text-center transition-transform hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
              Retour à l&apos;accueil
            </Link>
            <Link href="/espace-membre"
              className="w-full rounded-xl py-3 text-sm font-semibold text-center transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
              Mon espace membre
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
