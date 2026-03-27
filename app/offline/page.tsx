export default function OfflinePage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center text-center px-6"
      style={{ background: "#060B2E" }}
    >
      <div
        className="rounded-full p-4 mb-6"
        style={{ background: "rgba(245,194,0,0.1)", border: "1px solid rgba(245,194,0,0.3)" }}
      >
        <svg
          className="h-10 w-10"
          style={{ color: "#F5C200" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l1.664 1.664M6.457 6.457l3.83 3.83M16.547 16.547l3.83 3.83M3 3l18 18M9.879 9.879A3 3 0 0112 9c.768 0 1.47.29 2 .764M12 3c4.97 0 9 4.03 9 9a8.96 8.96 0 01-1.969 5.617M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">Tu es hors ligne</h1>
      <p className="text-sm text-white/50 max-w-sm mb-8">
        Vérifie ta connexion internet et réessaie. Les pages déjà visitées sont disponibles hors ligne.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="rounded-xl px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        style={{ background: "#F5C200" }}
      >
        Réessayer
      </button>
    </div>
  );
}
