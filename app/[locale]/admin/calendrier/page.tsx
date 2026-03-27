"use client";

import { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";

type Priorite = "haute" | "normale" | "basse";

type RDV = {
  id?: string;
  nom: string;
  date: string;   // YYYY-MM-DD
  heure: string;  // HH:MM
  note?: string;
  priorite: Priorite;
};

const P = {
  haute:   { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.35)",   text: "#F87171", dot: "#EF4444",  label: "Haute" },
  normale: { bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.35)",  text: "#60A5FA", dot: "#3B82F6",  label: "Normale" },
  basse:   { bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.35)",  text: "#34D399", dot: "#10B981",  label: "Basse" },
};

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const FIELD = "rounded-lg px-3 py-2.5 text-sm text-white outline-none w-full";
const FS = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };
const LABEL = "block text-xs font-semibold mb-1.5 text-white/60";

const toKey = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const EMPTY: Omit<RDV, "id"> = { nom: "", date: "", heure: "09:00", note: "", priorite: "normale" };

export default function CalendrierPage() {
  const today = new Date();
  const [rdvs, setRdvs]               = useState<RDV[]>([]);
  const [year, setYear]               = useState(today.getFullYear());
  const [month, setMonth]             = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string>(toKey(today));
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState<RDV | null>(null);
  const [form, setForm]               = useState<Omit<RDV, "id">>(EMPTY);
  const [saving, setSaving]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/rdv").then((r) => r.json()).then(setRdvs);
  }, []);

  // ── Calendar grid ────────────────────────────────────────────────────────────
  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  // Monday-first: Sunday=0 → offset 6, Mon=1 → offset 0, …
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

  const cells: Array<{ date: Date; current: boolean }> = [];
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month, 1 - startOffset + i);
    cells.push({ date: d, current: d.getMonth() === month });
  }

  const rdvsByDay: Record<string, RDV[]> = {};
  for (const r of rdvs) {
    if (!rdvsByDay[r.date]) rdvsByDay[r.date] = [];
    rdvsByDay[r.date].push(r);
  }
  for (const key of Object.keys(rdvsByDay)) {
    rdvsByDay[key].sort((a, b) => a.heure.localeCompare(b.heure));
  }

  const selectedRdvs = (rdvsByDay[selectedDay] ?? []).slice().sort((a, b) => a.heure.localeCompare(b.heure));

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  // ── CRUD ─────────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY, date: selectedDay });
    setShowModal(true);
  };

  const openEdit = (r: RDV) => {
    setEditing(r);
    setForm({ nom: r.nom, date: r.date, heure: r.heure, note: r.note ?? "", priorite: r.priorite });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nom || !form.date || !form.heure) return;
    setSaving(true);
    if (editing?.id) {
      await fetch(`/api/rdv/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setRdvs(rdvs.map(r => r.id === editing.id ? { ...form, id: editing.id } : r));
    } else {
      const res = await fetch("/api/rdv", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      setRdvs([...rdvs, { ...form, id: data.id }]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/rdv/${id}`, { method: "DELETE" });
    setRdvs(rdvs.filter(r => r.id !== id));
    setDeleteTarget(null);
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  const selectedDateObj = new Date(selectedDay + "T00:00:00");
  const selectedLabel = `${selectedDateObj.getDate()} ${MONTHS[selectedDateObj.getMonth()]} ${selectedDateObj.getFullYear()}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminHeader title="Calendrier" subtitle="Gérez vos rendez-vous et accompagnements" />
        <button
          onClick={openAdd}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un RDV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Calendrier ─────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Month nav */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="rounded-lg p-2 transition-colors hover:bg-white/5">
              <svg className="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h2 className="text-base font-bold text-white">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="rounded-lg p-2 transition-colors hover:bg-white/5">
              <svg className="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[11px] font-semibold py-1" style={{ color: "rgba(255,255,255,0.35)" }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map(({ date, current }, i) => {
              const key = toKey(date);
              const isToday = key === toKey(today);
              const isSelected = key === selectedDay;
              const dayRdvs = rdvsByDay[key] ?? [];
              const hasRdv = dayRdvs.length > 0;

              // Priority dots (up to 3)
              const topPriority = dayRdvs.find(r => r.priorite === "haute") ? "haute"
                : dayRdvs.find(r => r.priorite === "normale") ? "normale"
                : dayRdvs.length > 0 ? "basse" : null;

              return (
                <button
                  key={i}
                  onClick={() => { setSelectedDay(key); }}
                  className="relative flex flex-col items-center justify-start rounded-xl py-2 px-1 transition-all min-h-[52px]"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(26,63,216,0.4) 0%, rgba(59,130,246,0.3) 100%)"
                      : isToday
                      ? "rgba(59,130,246,0.1)"
                      : "transparent",
                    border: isSelected
                      ? "1px solid rgba(59,130,246,0.5)"
                      : isToday
                      ? "1px solid rgba(59,130,246,0.2)"
                      : "1px solid transparent",
                    opacity: current ? 1 : 0.3,
                  }}
                >
                  <span
                    className="text-xs font-semibold leading-none"
                    style={{ color: isSelected ? "#fff" : isToday ? "#60A5FA" : "rgba(255,255,255,0.7)" }}
                  >
                    {date.getDate()}
                  </span>
                  {hasRdv && (
                    <div className="flex gap-0.5 mt-1.5 flex-wrap justify-center">
                      {dayRdvs.slice(0, 3).map((r, idx) => (
                        <span key={idx} className="block h-1.5 w-1.5 rounded-full" style={{ background: P[r.priorite].dot }} />
                      ))}
                    </div>
                  )}
                  {hasRdv && (
                    <span className="mt-1 text-[9px] font-medium" style={{ color: topPriority ? P[topPriority].text : "transparent" }}>
                      {dayRdvs.length} rdv
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {(["haute","normale","basse"] as Priorite[]).map(p => (
              <div key={p} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: P[p].dot }} />
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{P[p].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Day detail panel ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{selectedLabel}</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {selectedRdvs.length === 0 ? "Aucun rendez-vous" : `${selectedRdvs.length} rendez-vous`}
              </p>
            </div>
            <button
              onClick={openAdd}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-80"
              style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#60A5FA" }}
            >
              + Ajouter
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto max-h-[420px] pr-1">
            {selectedRdvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <svg className="h-8 w-8" style={{ color: "rgba(255,255,255,0.15)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Aucun RDV ce jour</p>
              </div>
            ) : (
              selectedRdvs.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl p-3 space-y-1.5"
                  style={{ background: P[r.priorite].bg, border: `1px solid ${P[r.priorite].border}` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ background: P[r.priorite].dot + "30", color: P[r.priorite].text }}>
                        {P[r.priorite].label}
                      </span>
                      <p className="text-sm font-semibold text-white truncate">{r.nom}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => openEdit(r)} className="rounded p-1 hover:bg-white/10 transition-colors">
                        <svg className="h-3.5 w-3.5" style={{ color: "#60A5FA" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" />
                        </svg>
                      </button>
                      <button onClick={() => r.id && setDeleteTarget(r.id)} className="rounded p-1 hover:bg-white/10 transition-colors">
                        <svg className="h-3.5 w-3.5" style={{ color: "#F87171" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3 w-3 shrink-0" style={{ color: P[r.priorite].text }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className="text-xs font-semibold" style={{ color: P[r.priorite].text }}>{r.heure}</span>
                  </div>
                  {r.note && (
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{r.note}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Upcoming RDVs ─────────────────────────────────────────────────────── */}
      {(() => {
        const todayKey = toKey(today);
        const upcoming = rdvs
          .filter(r => r.date >= todayKey)
          .sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure))
          .slice(0, 5);
        if (upcoming.length === 0) return null;
        return (
          <div className="rounded-2xl p-5 space-y-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-sm font-bold text-white">Prochains rendez-vous</p>
            <div className="space-y-2">
              {upcoming.map(r => {
                const d = new Date(r.date + "T00:00:00");
                const dayLabel = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
                return (
                  <button
                    key={r.id}
                    onClick={() => { setSelectedDay(r.date); setMonth(d.getMonth()); setYear(d.getFullYear()); }}
                    className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-white/5"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] font-bold" style={{ background: P[r.priorite].bg, border: `1px solid ${P[r.priorite].border}`, color: P[r.priorite].text }}>
                      <span className="text-xs">{d.getDate()}</span>
                      <span style={{ fontSize: 8 }}>{MONTHS[d.getMonth()].slice(0,3).toUpperCase()}</span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{r.nom}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{dayLabel} · {r.heure}</p>
                    </div>
                    <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: P[r.priorite].bg, color: P[r.priorite].text }}>
                      {P[r.priorite].label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Add/Edit Modal ────────────────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ background: "#0A0F2E", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{editing ? "Modifier le RDV" : "Nouveau rendez-vous"}</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1.5 hover:bg-white/10 transition-colors">
                <svg className="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className={LABEL}>Nom *</label>
                <input className={FIELD} style={FS} placeholder="Ex: Coaching avec Marie" value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Date *</label>
                  <input type="date" className={FIELD} style={FS} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <label className={LABEL}>Heure *</label>
                  <input type="time" className={FIELD} style={FS} value={form.heure} onChange={e => setForm(f => ({ ...f, heure: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className={LABEL}>Priorité</label>
                <div className="flex gap-2">
                  {(["haute","normale","basse"] as Priorite[]).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, priorite: p }))}
                      className="flex-1 rounded-lg py-2 text-xs font-semibold transition-all"
                      style={{
                        background: form.priorite === p ? P[p].bg : "rgba(255,255,255,0.04)",
                        border: `1px solid ${form.priorite === p ? P[p].border : "rgba(255,255,255,0.08)"}`,
                        color: form.priorite === p ? P[p].text : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {P[p].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={LABEL}>Note (optionnel)</label>
                <textarea className={FIELD} style={FS} rows={3} placeholder="Sujet, objectifs, lien Zoom…" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving || !form.nom || !form.date || !form.heure}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)" }}
              >
                {saving ? "Sauvegarde…" : editing ? "Modifier" : "Ajouter"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ───────────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ background: "#0A0F2E", border: "1px solid rgba(239,68,68,0.3)" }}>
            <p className="text-sm font-bold text-white">Supprimer ce rendez-vous ?</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Cette action est irréversible.</p>
            <div className="flex gap-2">
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #DC2626, #EF4444)" }}>Supprimer</button>
              <button onClick={() => setDeleteTarget(null)} className="rounded-xl px-4 py-2.5 text-sm font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
