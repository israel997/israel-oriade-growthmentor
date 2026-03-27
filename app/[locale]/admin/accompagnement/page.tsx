"use client";

import { Fragment, useEffect, useState } from "react";

type Accompaniment = {
  startDate: string | null;
  endDate: string | null;
  label: string | null;
};

type Member = {
  id: string;
  name: string;
  email: string;
  accompaniment: Accompaniment | null;
};

function daysLeft(endDate: string | null): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function StatusBadge({ acc }: { acc: Accompaniment | null }) {
  if (!acc?.startDate || !acc?.endDate) {
    return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}>Aucun</span>;
  }
  const days = daysLeft(acc.endDate);
  if (days === null) return null;
  if (days < 0) {
    return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>Terminé</span>;
  }
  if (days <= 7) {
    return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#FCD34D" }}>{days}j restants</span>;
  }
  return <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399" }}>{days}j restants</span>;
}

export default function AccompagnementAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<{ startDate: string; endDate: string; label: string }>({ startDate: "", endDate: "", label: "Accompagnement" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/accompaniment")
      .then((r) => r.json())
      .then((data) => { setMembers(data); setLoading(false); });
  }, []);

  const openEdit = (m: Member) => {
    setEditing(m.id);
    setForm({
      startDate: m.accompaniment?.startDate?.slice(0, 10) ?? "",
      endDate: m.accompaniment?.endDate?.slice(0, 10) ?? "",
      label: m.accompaniment?.label ?? "Accompagnement",
    });
  };

  const save = async (memberId: string) => {
    setSaving(true);
    const payload = form.startDate && form.endDate
      ? { startDate: form.startDate, endDate: form.endDate, label: form.label || "Accompagnement" }
      : { startDate: null, endDate: null };

    const res = await fetch(`/api/admin/accompaniment/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? { ...m, accompaniment: payload.startDate ? { startDate: payload.startDate, endDate: payload.endDate, label: payload.label ?? "Accompagnement" } : null }
            : m
        )
      );
      setEditing(null);
    }
    setSaving(false);
  };

  const removeAccompaniment = async (memberId: string) => {
    await fetch(`/api/admin/accompaniment/${memberId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: null, endDate: null }),
    });
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, accompaniment: null } : m))
    );
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = members.filter((m) => {
    if (!m.accompaniment?.endDate) return false;
    return daysLeft(m.accompaniment.endDate) !== null && (daysLeft(m.accompaniment.endDate) ?? -1) >= 0;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Accompagnements</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            Gérer les dates de début et de fin pour chaque membre
          </p>
        </div>
        <div className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
          {activeCount} actif{activeCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "rgba(255,255,255,0.3)" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un membre..."
          className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Membre", "Programme", "Début", "Fin", "Statut", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Chargement...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun membre trouvé</td>
              </tr>
            ) : (
              filtered.map((m) => (
                <Fragment key={m.id}>
                  <tr
                    style={{ borderBottom: editing === m.id ? "none" : "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{m.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{m.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {m.accompaniment?.label ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {m.accompaniment?.startDate ? new Date(m.accompaniment.startDate).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {m.accompaniment?.endDate ? new Date(m.accompaniment.endDate).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge acc={m.accompaniment} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => editing === m.id ? setEditing(null) : openEdit(m)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                          style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)" }}
                        >
                          {editing === m.id ? "Annuler" : "Modifier"}
                        </button>
                        {m.accompaniment && (
                          <button
                            onClick={() => removeAccompaniment(m.id)}
                            className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                            style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.15)" }}
                          >
                            Retirer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {editing === m.id && (
                    <tr key={`${m.id}-edit`} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td colSpan={6} className="px-4 pb-4">
                        <div className="rounded-xl p-4 space-y-4" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)" }}>
                          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(96,165,250,0.7)" }}>
                            Définir l'accompagnement — {m.name}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Nom du programme</label>
                              <input
                                type="text"
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                                placeholder="Ex: Mentorat Elite"
                                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Date de début</label>
                              <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>Date de fin</label>
                              <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => save(m.id)}
                              disabled={saving || !form.startDate || !form.endDate}
                              className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all disabled:opacity-40"
                              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}
                            >
                              {saving ? "Enregistrement..." : "Enregistrer"}
                            </button>
                            <button
                              onClick={() => setEditing(null)}
                              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                              style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
