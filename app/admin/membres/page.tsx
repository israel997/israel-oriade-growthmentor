"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

type Member = { email: string; name: string; method: string; joinedAt: string };

const mockMembers: Member[] = [
  { email: "sarah@example.com", name: "Sarah", method: "Email", joinedAt: "2026-03-10" },
  { email: "yanis@example.com", name: "Yanis", method: "Google", joinedAt: "2026-03-14" },
  { email: "mireille@example.com", name: "Mireille", method: "Email", joinedAt: "2026-03-18" },
];

export default function AdminMembresPage() {
  const [members, setMembers] = useState<Member[]>(mockMembers);

  useEffect(() => {
    try {
      const session = localStorage.getItem("gm_member_session");
      if (session) {
        const s = JSON.parse(session);
        const exists = members.some((m) => m.email === s.email);
        if (!exists && s.email) {
          setMembers((prev) => [...prev, { email: s.email, name: s.name ?? s.email, method: s.method ?? "Email", joinedAt: new Date().toISOString().split("T")[0] }]);
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <AdminHeader title="Membres" subtitle={`${members.length} compte${members.length > 1 ? "s" : ""} enregistré${members.length > 1 ? "s" : ""}`} />

      <div className="overflow-hidden rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Membre", "Email", "Méthode", "Inscrit le"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={i} style={{ borderBottom: i < members.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}>
                      {(m.name ?? m.email)[0].toUpperCase()}
                    </div>
                    <span className="text-white font-medium">{m.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3" style={{ color: "rgba(255,255,255,0.55)" }}>{m.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: m.method === "Google" ? "rgba(234,67,53,0.15)" : "rgba(59,130,246,0.15)", color: m.method === "Google" ? "#F87171" : "#60A5FA" }}>
                    {m.method}
                  </span>
                </td>
                <td className="px-5 py-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{m.joinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
        Vue lecture seule — les données de session sont lues depuis localStorage.
      </p>
    </div>
  );
}
