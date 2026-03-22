"use client";

import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { formationCards, blogPosts, testimonials } from "@/lib/site-data";
import { tools } from "@/lib/tools-data";

// ── Données simulées ──────────────────────────────────────────────────────────
const totalMembers = 180;
const levels = [
  { label: "Débutant",      count: 94,  color: "#34D399", pct: 52 },
  { label: "Intermédiaire", count: 61,  color: "#60A5FA", pct: 34 },
  { label: "Expert",        count: 25,  color: "#A78BFA", pct: 14 },
];

const monthlyMembers = [
  { month: "Sep", val: 8 },
  { month: "Oct", val: 14 },
  { month: "Nov", val: 22 },
  { month: "Déc", val: 18 },
  { month: "Jan", val: 31 },
  { month: "Fév", val: 27 },
  { month: "Mar", val: 42 },
  { month: "Avr", val: 18 },
];

const totalMen = 103;
const totalWomen = 77;
const onlineNow = 12;
const conversionRate = 87; // % résultats < 8 semaines
const avgRating = 4.7;
const totalDownloads = 2851;
const totalRevenue = "12 480€";

const quickActions = [
  { label: "+ Formation",  href: "/admin/formations/nouvelle", color: "#14B8A6" },
  { label: "+ Ressource",  href: "/admin/ressources/nouvelle", color: "#6366F1" },
  { label: "+ Contenu",    href: "/admin/contenus/nouveau",    color: "#1877F2" },
  { label: "+ Outil",      href: "/admin/outils/nouvel",       color: "#34D399" },
  { label: "+ Article",    href: "/admin/blog/nouvel",         color: "#F5C200" },
];

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function BarChart({ data, color = "#60A5FA" }: { data: { month: string; val: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.val));
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d) => (
        <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-sm transition-all"
            style={{ height: `${(d.val / max) * 100}%`, background: color + "90", minHeight: 4 }}
            title={`${d.month}: ${d.val}`}
          />
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ── Donut chart (SVG) ──────────────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { pct: number; color: string; label: string; count: number }[] }) {
  const r = 38;
  const cx = 50;
  const cy = 50;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  const gap = 2; // degrees between segments

  return (
    <div className="flex items-center gap-6">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * circumference - gap;
          const el = (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${Math.max(dash, 0)} ${circumference}`}
              strokeDashoffset={-offset * (circumference / 360) * (360 / 100) * -1}
              style={{ strokeDashoffset: -(offset / 100) * circumference, transition: "stroke-dasharray 0.6s ease" }}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += seg.pct;
          return el;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" className="text-xs" fill="white" fontSize="14" fontWeight="bold">{totalMembers}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8">membres</text>
      </svg>
      <div className="space-y-2">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-xs text-white">{s.label}</span>
            <span className="text-xs font-bold" style={{ color: s.color }}>{s.count}</span>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gender chart ───────────────────────────────────────────────────────────────
function GenderChart() {
  const total = totalMen + totalWomen;
  const menPct = Math.round((totalMen / total) * 100);
  const womenPct = 100 - menPct;
  return (
    <div>
      <p className="text-sm font-bold text-white mb-1">Répartition par genre</p>
      <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Sur {total} membres</p>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-white">♂ Hommes</span>
            <span className="text-xs font-bold" style={{ color: "#60A5FA" }}>{totalMen} · {menPct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full" style={{ width: `${menPct}%`, background: "linear-gradient(90deg, #1A3FD8, #60A5FA)" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-white">♀ Femmes</span>
            <span className="text-xs font-bold" style={{ color: "#F472B6" }}>{totalWomen} · {womenPct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
            <div className="h-full rounded-full" style={{ width: `${womenPct}%`, background: "linear-gradient(90deg, #BE185D, #F472B6)" }} />
          </div>
        </div>
        <div className="h-5 rounded-full overflow-hidden flex mt-1">
          <div style={{ width: `${menPct}%`, background: "linear-gradient(90deg, #1A3FD8, #60A5FA)" }} />
          <div style={{ width: `${womenPct}%`, background: "linear-gradient(90deg, #BE185D, #F472B6)" }} />
        </div>
        <div className="flex justify-between text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>Hommes {menPct}%</span>
          <span>Femmes {womenPct}%</span>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminHeader title="Dashboard" subtitle="Vue d'ensemble de ta plateforme" />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Membres total" value={totalMembers} color="#60A5FA"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>}
        />
        <StatCard label="Connectés maintenant" value={onlineNow} color="#34D399"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" /></svg>}
        />
        <StatCard label="Téléchargements" value={totalDownloads.toLocaleString("fr-FR")} color="#F5C200"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>}
        />
        <StatCard label="Revenus estimés" value={totalRevenue} color="#A855F7"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>}
        />
      </div>

      {/* Charts row: inscriptions + niveaux + genre */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar chart inscriptions */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-white">Nouvelles inscriptions</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>8 derniers mois</p>
            </div>
            <span className="text-xl font-black text-white">+42 <span className="text-xs font-normal" style={{ color: "#34D399" }}>ce mois</span></span>
          </div>
          <BarChart data={monthlyMembers} color="#60A5FA" />
        </div>

        {/* Donut niveaux */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-sm font-bold text-white mb-1">Répartition par niveau</p>
          <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>Basé sur le diagnostic initial</p>
          <DonutChart segments={levels} />
        </div>

        {/* Gender chart */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <GenderChart />
        </div>
      </div>

      {/* Row 4: actions rapides + formations récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

        {/* Formations récentes */}
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-white">Formations</p>
            <Link href="/admin/formations" className="text-xs" style={{ color: "#60A5FA" }}>Voir tout →</Link>
          </div>
          <div className="space-y-2.5">
            {formationCards.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg shrink-0" style={{ background: f.coverGradient }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{f.title}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{f.members} membres · {f.price}</p>
                </div>
                <Link href={`/admin/formations/${f.id}`} className="rounded-md px-2.5 py-1 text-[10px] font-medium shrink-0" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA" }}>Éditer</Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 5: mini stats contenus */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Outils testés" value={tools.length} color="#34D399"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" /></svg>}
        />
        <StatCard label="Articles blog" value={blogPosts.length} color="#F5C200"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" /></svg>}
        />
        <StatCard label="Témoignages" value={testimonials.length} color="#A855F7"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>}
        />
        <StatCard label="Taux succès" value="87%" color="#34D399"
          icon={<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
      </div>
    </div>
  );
}
