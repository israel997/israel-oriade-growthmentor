export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-32">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-8 w-8 rounded-full border-2 animate-spin"
          style={{ borderColor: "rgba(96,165,250,0.25)", borderTopColor: "#60A5FA" }}
        />
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>
          Chargement…
        </p>
      </div>
    </div>
  );
}
