export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-7 w-7 rounded-full border-2 animate-spin"
          style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3B82F6" }}
        />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
          Chargement…
        </p>
      </div>
    </div>
  );
}
