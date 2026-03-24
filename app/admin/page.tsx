"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";

const quickActions = [
  { label: "+ Formation",  href: "/admin/formations/nouvelle", color: "#14B8A6" },
  { label: "+ Ressource",  href: "/admin/ressources/nouvelle", color: "#6366F1" },
  { label: "+ Contenu",    href: "/admin/contenus/nouveau",    color: "#1877F2" },
  { label: "+ Outil",      href: "/admin/outils/nouvel",       color: "#34D399" },
  { label: "+ Article",    href: "/admin/blog/nouvel",         color: "#F5C200" },
];

type Stats = { members: number; formations: number; outils: number; ressources: number; blog: number; temoignages: number; contenus: number };
type Formation = { id: string; title: string; coverGradient: string; members?: number; price: string };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    fetch("/api/formations").then((r) => r.json()).then((d) => setFormations(Array.isArray(d) ? d.slice(0, 4) : []));
  }, []);

  return (
    <div className="space-y-8">
      <AdminHeader title="Dashboard" subtitle="Vue d'ensemble de ta plateforme" />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Membres actifs"
          value={stats ? stats.members : "…"}
          color="#60A5FA"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
        />
        <StatCard
          label="Formations"
          value={stats ? stats.formations : "…"}
          color="#14B8A6"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84 51.39 51.39 0 0 0-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>}
        />
        <StatCard
          label="Outils testés"
          value={stats ? stats.outils : "…"}
          color="#34D399"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>}
        />
        <StatCard
          label="Articles blog"
          value={stats ? stats.blog : "…"}
          color="#F5C200"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>}
        />
      </div>

      {/* Row 2: actions rapides + ressources/témoignages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick actions */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-bold text-white mb-4">Actions rapides</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href}
                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-opacity hover:opacity-80"
                style={{ background: a.color + "15", border: `1px solid ${a.color}30`, color: a.color }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mini stats contenus */}
        <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-bold text-white">Contenus</p>
          {[
            { label: "Ressources",    value: stats?.ressources,   color: "#6366F1" },
            { label: "Témoignages",   value: stats?.temoignages,  color: "#A855F7" },
            { label: "Posts & profils", value: stats?.contenus,   color: "#1877F2" },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</span>
              <span className="text-sm font-bold" style={{ color }}>{value ?? "…"}</span>
            </div>
          ))}
        </div>

        {/* Liens rapides */}
        <div className="rounded-2xl p-5 space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-bold text-white mb-3">Sections</p>
          {[
            { label: "Membres",      href: "/admin/membres",      color: "#60A5FA" },
            { label: "Formations",   href: "/admin/formations",   color: "#14B8A6" },
            { label: "Blog",         href: "/admin/blog",         color: "#F5C200" },
            { label: "Témoignages",  href: "/admin/temoignages",  color: "#A855F7" },
            { label: "Calendrier",   href: "/admin/calendrier",   color: "#34D399" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: l.color + "10", color: l.color }}>
              {l.label}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Formations récentes */}
      <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">Formations récentes</p>
          <Link href="/admin/formations" className="text-xs" style={{ color: "#60A5FA" }}>Voir tout →</Link>
        </div>
        {formations.length === 0 ? (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune formation pour l&apos;instant.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {formations.map((f) => (
              <div key={f.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-9 w-9 rounded-lg shrink-0" style={{ background: f.coverGradient }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{f.title}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{f.price}</p>
                </div>
                <Link href={`/admin/formations/${f.id}`} className="rounded-md px-2 py-1 text-[10px] font-medium shrink-0" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA" }}>Éditer</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
