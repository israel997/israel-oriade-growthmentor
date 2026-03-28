"use client";

import { Fragment, useEffect, useState } from "react";

type Creneau = { jour: string; heure: string };
type PeriodeUnit = "jours" | "semaines" | "mois";

type Accompagnement = {
  id: string;
  nom: string;
  programme: string;
  startDate: string;
  periodeValue: number;
  periodeUnit: PeriodeUnit;
  endDate: string;
  planning: Creneau[];
};

type SortMode = "none" | "days_asc" | "days_desc";

function computeEndDate(startDate: string, periodeValue: number, periodeUnit: PeriodeUnit): string {
  const [y, m, day] = startDate.split("-").map(Number);
  const d = new Date(y, m - 1, day); // local time — évite le décalage UTC
  if (periodeUnit === "jours") d.setDate(d.getDate() + periodeValue);
  else if (periodeUnit === "semaines") d.setDate(d.getDate() + periodeValue * 7);
  else if (periodeUnit === "mois") d.setMonth(d.getMonth() + periodeValue);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysLeft(endDate: string): number {
  return Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function StatusBadge({ endDate }: { endDate: string }) {
  const days = daysLeft(endDate);
  if (days < 0)
    return <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(248,113,113,0.12)", color: "#F87171", border: "1px solid rgba(248,113,113,0.2)" }}>Terminé</span>;
  if (days === 0)
    return <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(248,113,113,0.15)", color: "#F87171", border: "1px solid rgba(248,113,113,0.3)" }}>Dernier jour</span>;
  if (days <= 7)
    return <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.12)", color: "#FCD34D", border: "1px solid rgba(245,158,11,0.2)" }}>{days}j restants</span>;
  return <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>{days}j restants</span>;
}

const emptyForm = { nom: "", programme: "", startDate: "", periodeValue: 30, periodeUnit: "jours" as PeriodeUnit };

type FormState = typeof emptyForm;

function FormFields({ form, setForm }: { form: FormState; setForm: (f: FormState) => void }) {
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" };
  const labelStyle = { color: "rgba(255,255,255,0.45)" };
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Nom</label>
        <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
          placeholder="Prénom Nom" className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Programme</label>
        <input type="text" value={form.programme} onChange={(e) => setForm({ ...form, programme: e.target.value })}
          placeholder="Ex: Mentorat Elite" className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Date de début</label>
        <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={{ ...inputStyle, colorScheme: "dark" }} />
      </div>
      <div>
        <label className="block text-xs font-medium mb-1.5" style={labelStyle}>Période</label>
        <div className="flex gap-2">
          <input type="number" min={1} value={form.periodeValue}
            onChange={(e) => setForm({ ...form, periodeValue: Math.max(1, Number(e.target.value) || 1) })}
            className="w-24 rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
          <select value={form.periodeUnit} onChange={(e) => setForm({ ...form, periodeUnit: e.target.value as PeriodeUnit })}
            className="flex-1 rounded-lg px-2 py-2 text-sm outline-none" style={{ ...inputStyle, colorScheme: "dark" }}>
            <option value="jours">Jours</option>
            <option value="semaines">Semaines</option>
            <option value="mois">Mois</option>
          </select>
        </div>
      </div>
      {form.startDate && (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          Date de fin calculée :{" "}
          <span style={{ color: "#60A5FA" }}>
            {new Date(...(computeEndDate(form.startDate, form.periodeValue, form.periodeUnit).split("-").map(Number) as [number, number, number])).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
          </span>
        </p>
      )}
    </div>
  );
}

export default function AccompagnementAdminPage() {
  const [items, setItems] = useState<Accompagnement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("none");
  const [filterProgramme, setFilterProgramme] = useState("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [planningId, setPlanningId] = useState<string | null>(null);
  const [planningList, setPlanningList] = useState<Creneau[]>([]);
  const [newCreneau, setNewCreneau] = useState<Creneau>({ jour: "", heure: "" });
  const [savingPlanning, setSavingPlanning] = useState(false);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/accompagnements")
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const programmes = ["all", ...Array.from(new Set(items.map((a) => a.programme).filter(Boolean)))];

  let filtered = items.filter((a) => {
    const matchSearch = a.nom.toLowerCase().includes(search.toLowerCase()) || a.programme.toLowerCase().includes(search.toLowerCase());
    const matchProgramme = filterProgramme === "all" || a.programme === filterProgramme;
    return matchSearch && matchProgramme;
  });

  if (sortMode === "days_asc") filtered = [...filtered].sort((a, b) => daysLeft(a.endDate) - daysLeft(b.endDate));
  else if (sortMode === "days_desc") filtered = [...filtered].sort((a, b) => daysLeft(b.endDate) - daysLeft(a.endDate));

  const activeCount = items.filter((a) => daysLeft(a.endDate) >= 0).length;

  const buildPayload = (f: typeof form) => {
    const endDate = f.startDate ? computeEndDate(f.startDate, f.periodeValue, f.periodeUnit) : "";
    return { nom: f.nom, programme: f.programme, startDate: f.startDate, periodeValue: f.periodeValue, periodeUnit: f.periodeUnit, endDate };
  };

  const createAccompagnement = async () => {
    if (!form.nom || !form.programme || !form.startDate) return;
    setSaving(true);
    const payload = buildPayload(form);
    const res = await fetch("/api/admin/accompagnements", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (res.ok) {
      const { id } = await res.json();
      setItems((prev) => [{ id, ...payload, planning: [] }, ...prev]);
      setShowAddModal(false); setForm(emptyForm);
    }
    setSaving(false);
  };

  const updateAccompagnement = async (id: string) => {
    if (!form.nom || !form.programme || !form.startDate) return;
    setSaving(true);
    const payload = buildPayload(form);
    const res = await fetch(`/api/admin/accompagnements/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    if (res.ok) { setItems((prev) => prev.map((a) => a.id === id ? { ...a, ...payload } : a)); setEditingId(null); }
    setSaving(false);
  };

  const deleteAccompagnement = async (id: string) => {
    await fetch(`/api/admin/accompagnements/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((a) => a.id !== id)); setConfirmDeleteId(null);
  };

  const openPlanning = (a: Accompagnement) => { setPlanningId(a.id); setPlanningList(a.planning ?? []); };

  const savePlanning = async () => {
    if (!planningId) return;
    setSavingPlanning(true);
    const res = await fetch(`/api/admin/accompagnements/${planningId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planning: planningList }),
    });
    if (res.ok) { setItems((prev) => prev.map((a) => a.id === planningId ? { ...a, planning: planningList } : a)); setPlanningId(null); }
    setSavingPlanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Accompagnements</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Gérer les accompagnements personnalisés</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl px-4 py-2 text-sm font-semibold" style={{ background: "rgba(52,211,153,0.1)", color: "#34D399", border: "1px solid rgba(52,211,153,0.2)" }}>
            {activeCount} actif{activeCount !== 1 ? "s" : ""}
          </div>
          <button onClick={() => { setShowAddModal(true); setForm(emptyForm); }}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110"
            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
            + Ajouter
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} style={{ color: "rgba(255,255,255,0.3)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..."
            className="w-full rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
        </div>
        <select value={filterProgramme} onChange={(e) => setFilterProgramme(e.target.value)}
          className="rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }}>
          {programmes.map((p) => <option key={p} value={p}>{p === "all" ? "Tous les programmes" : p}</option>)}
        </select>
        <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)}
          className="rounded-xl px-3 py-2.5 text-sm outline-none"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }}>
          <option value="none">Trier par jours</option>
          <option value="days_asc">Jours restants ↑</option>
          <option value="days_desc">Jours restants ↓</option>
        </select>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Nom", "Programme", "Début", "Période", "Fin", "Statut", "Planning", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Chargement...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center">
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun accompagnement</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>Cliquez sur + Ajouter pour commencer</p>
              </td></tr>
            ) : filtered.map((a) => (
              <Fragment key={a.id}>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{a.nom}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{a.programme}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{new Date(a.startDate).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)" }}>
                      {a.periodeValue} {a.periodeUnit}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{new Date(a.endDate).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3"><StatusBadge endDate={a.endDate} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openPlanning(a)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:brightness-110"
                      style={{ background: "rgba(167,139,250,0.1)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.2)" }}>
                      {(a.planning?.length ?? 0) > 0 ? `${a.planning.length} créneau${a.planning.length > 1 ? "x" : ""}` : "Planifier"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {confirmDeleteId === a.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "rgba(248,113,113,0.8)" }}>Supprimer ?</span>
                        <button onClick={() => deleteAccompagnement(a.id)} className="rounded-lg px-2 py-1 text-xs font-semibold" style={{ background: "rgba(248,113,113,0.15)", color: "#F87171" }}>Oui</button>
                        <button onClick={() => setConfirmDeleteId(null)} className="rounded-lg px-2 py-1 text-xs" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>Non</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setEditingId(a.id); setForm({ nom: a.nom, programme: a.programme, startDate: a.startDate.slice(0, 10), periodeValue: a.periodeValue, periodeUnit: a.periodeUnit }); }}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium"
                          style={{ background: "rgba(96,165,250,0.1)", color: "#60A5FA", border: "1px solid rgba(96,165,250,0.2)" }}>
                          Modifier
                        </button>
                        <button onClick={() => setConfirmDeleteId(a.id)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium"
                          style={{ background: "rgba(248,113,113,0.08)", color: "#F87171", border: "1px solid rgba(248,113,113,0.15)" }}>
                          Supprimer
                        </button>
                      </div>
                    )}
                  </td>
                </tr>

                {editingId === a.id && (
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td colSpan={8} className="px-4 pb-4">
                      <div className="rounded-xl p-4 space-y-4 mt-1" style={{ background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.15)" }}>
                        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(96,165,250,0.7)" }}>Modifier — {a.nom}</p>
                        <FormFields form={form} setForm={setForm} />
                        <div className="flex gap-2">
                          <button onClick={() => updateAccompagnement(a.id)} disabled={saving || !form.nom || !form.programme || !form.startDate}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                            style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
                            {saving ? "Enregistrement..." : "Enregistrer"}
                          </button>
                          <button onClick={() => setEditingId(null)} className="rounded-lg px-4 py-2 text-sm font-medium"
                            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>Annuler</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,5,22,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setShowAddModal(false)}>
          <div className="relative w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: "#08123A", border: "1px solid rgba(96,165,250,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-white">Nouvel accompagnement</p>
              <button onClick={() => setShowAddModal(false)} className="h-8 w-8 flex items-center justify-center rounded-full" style={{ color: "rgba(255,255,255,0.4)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M6 6l12 12M18 6l-12 12" /></svg>
              </button>
            </div>
            <FormFields form={form} setForm={setForm} />
            <button onClick={createAccompagnement} disabled={saving || !form.nom || !form.programme || !form.startDate}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
              {saving ? "Enregistrement..." : "Créer l'accompagnement"}
            </button>
          </div>
        </div>
      )}

      {/* Modal Planning */}
      {planningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(2,5,22,0.85)", backdropFilter: "blur(12px)" }}
          onClick={() => setPlanningId(null)}>
          <div className="relative w-full max-w-md rounded-2xl p-6 space-y-5"
            style={{ background: "#08123A", border: "1px solid rgba(167,139,250,0.2)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-base font-bold text-white">Planning — {items.find((a) => a.id === planningId)?.nom}</p>
              <button onClick={() => setPlanningId(null)} className="h-8 w-8 flex items-center justify-center rounded-full" style={{ color: "rgba(255,255,255,0.4)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4"><path d="M6 6l12 12M18 6l-12 12" /></svg>
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {planningList.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun créneau ajouté</p>
              ) : planningList.map((c, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-4 py-2.5"
                  style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{c.jour}</span>
                    <span className="text-xs rounded-full px-2 py-0.5" style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA" }}>{c.heure}</span>
                  </div>
                  <button onClick={() => setPlanningList((prev) => prev.filter((_, j) => j !== i))}
                    className="h-6 w-6 flex items-center justify-center rounded-full hover:bg-red-500/20"
                    style={{ color: "rgba(248,113,113,0.6)" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5"><path d="M6 6l12 12M18 6l-12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>Ajouter un créneau</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Date</label>
                  <input type="date" value={newCreneau.jour} onChange={(e) => setNewCreneau({ ...newCreneau, jour: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Heure</label>
                  <input type="time" value={newCreneau.heure} onChange={(e) => setNewCreneau({ ...newCreneau, heure: e.target.value })}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", colorScheme: "dark" }} />
                </div>
              </div>
              <button onClick={() => { if (!newCreneau.jour || !newCreneau.heure) return; setPlanningList((prev) => [...prev, newCreneau]); setNewCreneau({ jour: "", heure: "" }); }}
                disabled={!newCreneau.jour || !newCreneau.heure}
                className="w-full rounded-lg py-2 text-sm font-semibold transition-all disabled:opacity-40"
                style={{ background: "rgba(167,139,250,0.15)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.25)" }}>
                + Ajouter le créneau
              </button>
            </div>
            <button onClick={savePlanning} disabled={savingPlanning}
              className="w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: "linear-gradient(135deg, #1A3FD8, #3B82F6)" }}>
              {savingPlanning ? "Enregistrement..." : "Enregistrer le planning"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
