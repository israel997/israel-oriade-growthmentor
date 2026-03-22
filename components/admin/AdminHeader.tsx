export default function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {subtitle && <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{subtitle}</p>}
    </div>
  );
}
