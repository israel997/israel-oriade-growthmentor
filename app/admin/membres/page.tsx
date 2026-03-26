"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

type Member = {
  id: string;
  email: string;
  name: string;
  method: string;
  joinedAt: string;
  revoked: boolean;
  role: string;
};

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmRevoke, setConfirmRevoke] = useState<Member | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/members")
      .then((r) => r.json())
      .then((data) => setMembers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const revokeAccess = async (m: Member) => {
    await fetch(`/api/admin/members/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoked: true }),
    });
    setMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, revoked: true } : x));
    setConfirmRevoke(null);
  };

  const restoreAccess = async (m: Member) => {
    await fetch(`/api/admin/members/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ revoked: false }),
    });
    setMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, revoked: false } : x));
  };

  const changeRole = async (m: Member, role: string) => {
    await fetch(`/api/admin/members/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, role } : x));
  };

  const activeCount = members.filter((m) => !m.revoked).length;
  const revokedCount = members.filter((m) => m.revoked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <AdminHeader
          title="Membres"
          subtitle={`${activeCount} actif${activeCount > 1 ? "s" : ""} · ${revokedCount} révoqué${revokedCount > 1 ? "s" : ""}`}
        />
        <div className="flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)" }}>
          <span className="text-sm font-semibold" style={{ color: "#93C5FD" }}>{members.length} inscrits</span>
        </div>
      </div>

      <div className="overflow-x-auto overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Membre", "Email", "Méthode", "Inscrit le", "Rôle", "Statut", "Action"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Chargement…
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Aucun membre inscrit.
                </td>
              </tr>
            ) : members.map((m, i) => (
              <tr key={m.id} style={{ borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: m.revoked ? "rgba(239,68,68,0.03)" : i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent", opacity: m.revoked ? 0.6 : 1 }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: m.revoked ? "rgba(255,255,255,0.1)" : "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
                      {(m.name || m.email)[0].toUpperCase()}
                    </div>
                    <span className="font-medium" style={{ color: m.revoked ? "rgba(255,255,255,0.4)" : "white" }}>{m.name || "—"}</span>
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
                  <select
                    value={m.role}
                    onChange={(e) => changeRole(m, e.target.value)}
                    className="rounded-lg px-2 py-1 text-xs font-medium outline-none cursor-pointer"
                    style={{
                      background: m.role === "admin" ? "rgba(245,194,0,0.12)" : m.role === "assist" ? "rgba(167,139,250,0.12)" : "rgba(96,165,250,0.08)",
                      color: m.role === "admin" ? "#F5C200" : m.role === "assist" ? "#A78BFA" : "#93C5FD",
                      border: m.role === "admin" ? "1px solid rgba(245,194,0,0.25)" : m.role === "assist" ? "1px solid rgba(167,139,250,0.25)" : "1px solid rgba(96,165,250,0.2)",
                    }}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="assist">assist</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  {m.revoked ? (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(239,68,68,0.15)", color: "#F87171" }}>Révoqué</span>
                  ) : (
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: "rgba(52,211,153,0.12)", color: "#34D399" }}>Actif</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {m.revoked ? (
                    <button onClick={() => restoreAccess(m)} className="rounded-lg px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
                      Restaurer
                    </button>
                  ) : (
                    <button onClick={() => setConfirmRevoke(m)} className="rounded-lg px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80" style={{ background: "rgba(239,68,68,0.1)", color: "#F87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                      Révoquer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <div className="rounded-2xl p-6 w-full max-w-sm space-y-4" style={{ background: "#0D1425", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(239,68,68,0.12)" }}>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#F87171" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" /></svg>
            </div>
            <div>
              <p className="font-semibold text-white">Révoquer l&apos;accès ?</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                <span className="text-white">{confirmRevoke.email}</span> ne pourra plus se connecter à la plateforme.
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
