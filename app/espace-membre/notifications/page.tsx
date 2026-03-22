"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Notif = { id: string; type: "contenu" | "diagnostic" | "badge" | "mentee" | "actu"; title: string; body: string; href?: string; date: string; read: boolean };

const DEFAULT_NOTIFS: Notif[] = [
  { id: "n1", type: "actu",       title: "Nouveau : Formation Tunnel de Vente",    body: "La formation Tunnel de Vente de A à Z vient d'être mise à jour avec 3 nouveaux modules.", href: "/formations", date: "2026-03-22", read: false },
  { id: "n2", type: "diagnostic", title: "Ton test hebdo est disponible",           body: "Une nouvelle semaine commence. Passe ton test de progression pour suivre ton évolution.", href: "/espace-membre/diagnostic", date: "2026-03-22", read: false },
  { id: "n3", type: "contenu",    title: "Nouveau contenu publié",                  body: "Israël a publié un nouveau post LinkedIn : '5 erreurs qui tuent ton personal branding'.", href: "/contenus", date: "2026-03-21", read: false },
  { id: "n4", type: "mentee",     title: "Programme Mentee — Nouvelles places",     body: "De nouvelles places se sont ouvertes pour le programme Mentee. Candidature ouverte jusqu'au 31 mars.", href: "/espace-membre/mentee", date: "2026-03-20", read: true },
  { id: "n5", type: "badge",      title: "Badge débloqué : Confirmé",              body: "Ton score de 64/100 t'a permis de débloquer le badge Confirmé. Continue sur ta lancée !", href: "/espace-membre/progression", date: "2026-03-18", read: true },
  { id: "n6", type: "actu",       title: "Ressource gratuite : Guide Personal Branding", body: "Un nouveau guide PDF est disponible en téléchargement gratuit dans la section Ressources.", href: "/ressources", date: "2026-03-16", read: true },
];

const TYPE_CONFIG: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
  contenu:    { color: "#3B82F6", label: "Contenu",    icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> },
  diagnostic: { color: "#34D399", label: "Diagnostic", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> },
  badge:      { color: "#F5C200", label: "Badge",      icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" /></svg> },
  mentee:     { color: "#A78BFA", label: "Mentee",     icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg> },
  actu:       { color: "#93C5FD", label: "Actu",       icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg> },
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gm_notifications");
      setNotifs(saved ? JSON.parse(saved) : DEFAULT_NOTIFS);
    } catch {
      setNotifs(DEFAULT_NOTIFS);
    }
  }, []);

  const save = (updated: Notif[]) => {
    setNotifs(updated);
    localStorage.setItem("gm_notifications", JSON.stringify(updated));
  };

  const markRead = (id: string) => save(notifs.map((n) => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => save(notifs.map((n) => ({ ...n, read: true })));

  const unread = notifs.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Notifications</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            {unread > 0 ? `${unread} non lue${unread > 1 ? "s" : ""}` : "Tout est lu"}
          </p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:scale-[1.01]"
            style={{ background: "rgba(96,165,250,0.08)", color: "#93C5FD", border: "1px solid rgba(96,165,250,0.15)" }}>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {[{ id: "all", label: `Toutes (${notifs.length})` }, { id: "unread", label: `Non lues (${unread})` }].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id as "all" | "unread")}
            className="rounded-xl px-3 py-1.5 text-sm font-semibold transition-all"
            style={{
              background: filter === f.id ? "rgba(26,63,216,0.18)" : "rgba(255,255,255,0.04)",
              color: filter === f.id ? "#93C5FD" : "rgba(255,255,255,0.4)",
              border: filter === f.id ? "1px solid rgba(96,165,250,0.25)" : "1px solid rgba(255,255,255,0.06)",
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {displayed.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(96,165,250,0.15)" }}>
            <p className="text-sm text-white">Aucune notification non lue</p>
          </div>
        ) : displayed.map((n, i) => {
          const tc = TYPE_CONFIG[n.type] ?? { color: "#60A5FA", label: "Info", icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" /></svg> };
          return (
            <div key={n.id ?? i}
              className="flex items-start gap-4 rounded-2xl px-5 py-4 transition-all"
              style={{
                background: n.read ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                backdropFilter: "blur(16px)",
                border: `1px solid ${n.read ? "rgba(96,165,250,0.08)" : tc.color + "25"}`,
                opacity: n.read ? 0.7 : 1,
              }}>
              <div className="h-9 w-9 shrink-0 rounded-full flex items-center justify-center"
                style={{ background: "rgba(245,194,0,0.12)", color: "#F5C200" }}>
                {tc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: tc.color }} />}
                  <p className="text-sm font-semibold text-white">{n.title}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{n.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {new Date(n.date).toLocaleDateString("fr-FR")}
                  </span>
                  {n.href && (
                    <Link href={n.href} onClick={() => markRead(n.id)}
                      className="text-xs font-semibold transition-opacity hover:opacity-80"
                      style={{ color: tc.color }}>
                      Voir →
                    </Link>
                  )}
                  {!n.read && (
                    <button onClick={() => markRead(n.id)} className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Marquer lu
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
