import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { formationCards, blogPosts, testimonials } from "@/lib/site-data";
import { tools } from "@/lib/tools-data";

const quickActions = [
  { label: "Nouvelle formation", href: "/admin/formations/nouvelle", color: "#14B8A6" },
  { label: "Nouvelle ressource", href: "/admin/ressources/nouvelle", color: "#6366F1" },
  { label: "Nouveau contenu", href: "/admin/contenus/nouveau", color: "#1877F2" },
  { label: "Nouvel outil", href: "/admin/outils/nouvel", color: "#34D399" },
  { label: "Nouvel article", href: "/admin/blog/nouvel", color: "#F5C200" },
];

export default function AdminDashboard() {
  return (
    <div>
      <AdminHeader title="Dashboard" subtitle="Vue d'ensemble de ta plateforme" />

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Formations"
          value={formationCards.length}
          color="#14B8A6"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84 51.39 51.39 0 0 0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          }
        />
        <StatCard
          label="Outils testés"
          value={tools.length}
          color="#34D399"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          }
        />
        <StatCard
          label="Articles blog"
          value={blogPosts.length}
          color="#F5C200"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          }
        />
        <StatCard
          label="Témoignages"
          value={testimonials.length}
          color="#A855F7"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>ACTIONS RAPIDES</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: a.color + "22", border: `1px solid ${a.color}40`, color: a.color }}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent formations */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>FORMATIONS RÉCENTES</h2>
        <div className="space-y-2">
          {formationCards.slice(0, 4).map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg shrink-0" style={{ background: f.coverGradient }} />
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{f.type} · {f.price}</p>
                </div>
              </div>
              <Link
                href={`/admin/formations/${f.id}`}
                className="rounded-lg px-3 py-1 text-xs font-medium"
                style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA" }}
              >
                Éditer
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
