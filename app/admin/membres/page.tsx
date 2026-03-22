"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

type Member = {
  email: string;
  name: string;
  method: string;
  joinedAt: string;
  online?: boolean;
  revoked?: boolean;
};

const mockMembers: Member[] = [
  { email: "sarah@example.com",    name: "Sarah",    method: "Email",  joinedAt: "2026-03-10", online: true  },
  { email: "yanis@example.com",    name: "Yanis",    method: "Google", joinedAt: "2026-03-14", online: true  },
  { email: "mireille@example.com", name: "Mireille", method: "Email",  joinedAt: "2026-03-18", online: false },
  { email: "kevin@example.com",    name: "Kevin",    method: "Email",  joinedAt: "2026-03-20", online: false },
  { email: "amina@example.com",    name: "Amina",    method: "Google", joinedAt: "2026-03-21", online: true  },
];

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  useEffect(() => {
    try {
      const session = localStorage.getItem("gm_member_session");
      if (session) {
        const s = JSON.parse(session);
        const exists = members.some((m) => m.email === s.email);
        if (!exists && s.email) {
          setMembers((prev) => [...prev, { email: s.email, name: s.name ?? s.email, method: s.method ?? "Email", joinedAt: new Date().toISOString().split("T")[0], online: true }]);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revokeAccess = (email: string) => {
    setMembers((prev) => prev.map((m) => m.email === email ? { ...m, revoked: true, online: false } : m));
    setConfirmRevoke(null);
  };

  const restoreAccess = (email: string) => {
    setMembers((prev) => prev.map((m) => m.email === email ? { ...m, revoked: false } : m));
  };

  const onlineCount = members.filter((m) => m.online && !m.revoked).length;
  const activeCount = members.filter((m) => !m.revoked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <AdminHeader
          title="Membres"
          subtitle={`${activeCount} actif${activeCount > 1 ? "s" : ""} · ${members.filter((m) => m.revoked).length} révoqué${members.filter((m) => m.revoked).length > 1 ? "s" : ""}`}
        />
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#34D399" }} />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#34D399" }} />
          </span>
          <span className="text-sm font-semibold" style={{ color: "#34D399" }}>{onlineCount} connecté{onlineCount > 1 ? "s" : ""}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Membre", "Email", "Méthode", "Inscrit le", "Statut", "Action"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} style={{ borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: m.revoked ? "rgba(239,68,68,0.03)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", opacity: m.revoked ? 0.6 : 1 }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: m.revoked ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
                        {(m.name ?? m.email)[0].toUpperCase()}
                      </div>
                      {m.online && !m.revoked && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2" style={{ background: "#34D399", borderColor: "#03071A" }} />
                      )}
                    </div>
                    <span className="font-medium" style={{ color: m.revoked ? "rgba(255,255,255,0.4)" : "white" }}>{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: "rgba(255,255,255,0.55)" }}>{m.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: m.method === "Google" ? "rgba(234,67,53,0.15)" : "rgba(59,130,246,0.15)", color: m.method === "Google" ? "#F87171" : "#60A5FA" }}>
                    {m.method}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{m.joinedAt}</td>
                <td className="px-5 py-3">
                  {m.revoked ? (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}>Révoqué</span>
                  ) : m.online ? (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "#34D399" }}>En ligne</span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>Hors ligne</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {m.revoked ? (
                    <button onClick={() => restoreAccess(m.email)} className="rounded-lg px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
                      Restaurer
                    </button>
                  ) : (
                    <button onClick={() => setConfirmRevoke(m.email)} className="rounded-lg px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                      Révoquer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm revoke modal */}
      {confirmRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full max-w-sm space-y-4" style={{ background: "#0D1425", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.12)" }}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <div>
              <p className="font-semibold text-white">Révoquer l&apos;accès ?</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span className="text-white">{confirmRevoke}</span> ne pourra plus se connecter à la plateforme.
              </p>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setConfirmRevoke(null)} className="flex-1 rounded-xl py-2.5 text-sm font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>
                Annuler
              </button>
              <button onClick={() => revokeAccess(confirmRevoke)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)" }}>
                Révoquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
