export default function StatCard({
  label,
  value,
  icon,
  color = "#3B82F6",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:scale-[1.03] hover:border-white/15 cursor-default"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: color + "18", color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>{label}</p>
      </div>
    </div>
  );
}
