"use client";

import { useState, useEffect } from "react";

type Priorite = "haute" | "normale" | "basse";

type RDV = {
  id?: string;
  nom: string;
  date: string;
  heure: string;
  note?: string;
  priorite: Priorite;
};

const P = {
  haute:   { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.35)",  text: "#F87171", dot: "#EF4444", label: "Haute" },
  normale: { bg: "rgba(96,165,250,0.15)", border: "rgba(96,165,250,0.35)", text: "#60A5FA", dot: "#3B82F6", label: "Normale" },
  basse:   { bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.35)", text: "#34D399", dot: "#10B981", label: "Basse" },
};

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS   = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const toKey = (d: Date) => d.toISOString().split("T")[0];

export default function MembreCalendrierPage() {
  const today = new Date();
  const [rdvs, setRdvs]               = useState<RDV[]>([]);
  const [loading, setLoading]         = useState(true);
  const [year, setYear]               = useState(today.getFullYear());
  const [month, setMonth]             = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string>(toKey(today));

  useEffect(() => {
    fetch("/api/rdv")
      .then((r) => r.json())
      .then((data) => { setRdvs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Calendar grid
  const firstDay   = new Date(year, month, 1);
  const lastDay    = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalCells  = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7;

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

  const selectedRdvs = (rdvsByDay[selectedDay] ?? []).slice().sort((a, b) => a.heure.localeCompare(b.heure));

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const selectedDateObj = new Date(selectedDay + "T00:00:00");
  const selectedLabel = `${selectedDateObj.getDate()} ${MONTHS[selectedDateObj.getMonth()]} ${selectedDateObj.getFullYear()}`;

  const todayKey = toKey(today);
  const upcoming = rdvs
    .filter(r => r.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure))
    .slice(0, 5);

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Mon Calendrier</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          Retrouve ici tes rendez-vous et séances d'accompagnement planifiés.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-6 w-6 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Calendar */}
            <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
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

              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d => (
                  <div key={d} className="text-center text-[11px] font-semibold py-1" style={{ color: "rgba(255,255,255,0.35)" }}>{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map(({ date, current }, i) => {
                  const key = toKey(date);
                  const isToday    = key === todayKey;
                  const isSelected = key === selectedDay;
                  const dayRdvs    = rdvsByDay[key] ?? [];
                  const hasRdv     = dayRdvs.length > 0;
                  const topPriority = dayRdvs.find(r => r.priorite === "haute") ? "haute"
                    : dayRdvs.find(r => r.priorite === "normale") ? "normale"
                    : dayRdvs.length > 0 ? "basse" : null;

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(key)}
                      className="relative flex flex-col items-center justify-start rounded-xl py-2 px-1 transition-all min-h-[52px]"
                      style={{
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(26,63,216,0.4) 0%, rgba(59,130,246,0.3) 100%)"
                          : isToday ? "rgba(59,130,246,0.1)" : "transparent",
                        border: isSelected
                          ? "1px solid rgba(59,130,246,0.5)"
                          : isToday ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                        opacity: current ? 1 : 0.3,
                      }}
                    >
                      <span className="text-xs font-semibold leading-none"
                        style={{ color: isSelected ? "#fff" : isToday ? "#60A5FA" : "rgba(255,255,255,0.7)" }}>
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
                        <span className="mt-1 text-[9px] font-medium"
                          style={{ color: topPriority ? P[topPriority].text : "transparent" }}>
                          {dayRdvs.length} rdv
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {(["haute","normale","basse"] as Priorite[]).map(p => (
                  <div key={p} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: P[p].dot }} />
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{P[p].label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Day detail — read-only */}
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <p className="text-sm font-bold text-white">{selectedLabel}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {selectedRdvs.length === 0 ? "Aucun rendez-vous" : `${selectedRdvs.length} rendez-vous`}
                </p>
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
                    <div key={r.id} className="rounded-xl p-3 space-y-1.5"
                      style={{ background: P[r.priorite].bg, border: `1px solid ${P[r.priorite].border}` }}>
                      <div className="flex items-center gap-2">
                        <span className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                          style={{ background: P[r.priorite].dot + "30", color: P[r.priorite].text }}>
                          {P[r.priorite].label}
                        </span>
                        <p className="text-sm font-semibold text-white truncate">{r.nom}</p>
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

          {/* Upcoming RDVs */}
          {upcoming.length > 0 && (
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
                      <span className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg text-[10px] font-bold"
                        style={{ background: P[r.priorite].bg, border: `1px solid ${P[r.priorite].border}`, color: P[r.priorite].text }}>
                        <span className="text-xs">{d.getDate()}</span>
                        <span style={{ fontSize: 8 }}>{MONTHS[d.getMonth()].slice(0, 3).toUpperCase()}</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{r.nom}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{dayLabel} · {r.heure}</p>
                      </div>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                        style={{ background: P[r.priorite].bg, color: P[r.priorite].text }}>
                        {P[r.priorite].label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {rdvs.length === 0 && (
            <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-4"
              style={{ background: "rgba(96,165,250,0.04)", border: "1px dashed rgba(96,165,250,0.2)" }}>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "rgba(96,165,250,0.1)" }}>
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="#60A5FA" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-base font-bold text-white mb-1">Aucun rendez-vous planifié</p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Tes prochains rendez-vous apparaîtront ici dès qu'ils seront planifiés par ton mentor.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
