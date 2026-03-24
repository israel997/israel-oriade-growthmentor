import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!session?.user?.email || session.user.email !== adminEmail) {
    redirect("/connexion");
  }

  return (
    <div className="relative flex h-screen overflow-hidden" style={{ background: "#060B2E" }}>
      {/* Grain texture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.18]" style={{ backgroundImage: GRAIN_SVG, backgroundRepeat: "repeat", backgroundSize: "300px 300px", zIndex: 0 }} />
      {/* Gold grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.08) 1px, transparent 1px)", backgroundSize: "140px 140px", zIndex: 0 }} />
      {/* Vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 100% at 50% 0%, transparent 40%, rgba(4,8,22,0.75) 100%)", zIndex: 0 }} />

      <AdminSidebar />
      <main className="relative z-10 flex-1 overflow-y-auto px-8 py-8">
        {children}
      </main>
    </div>
  );
}
