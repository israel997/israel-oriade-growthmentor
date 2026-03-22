"use client";

export default function GradientPicker({
  label = "Gradient CSS",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>{label}</label>
      <div className="flex gap-3 items-stretch">
        <div
          className="h-10 w-16 shrink-0 rounded-lg border"
          style={{ background: value || "#1A1A2E", borderColor: "rgba(255,255,255,0.1)" }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)"
          className="flex-1 rounded-lg px-3 py-2 text-sm text-white outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>
    </div>
  );
}
