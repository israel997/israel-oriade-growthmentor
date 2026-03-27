"use client";

import { useEffect, useState } from "react";

type DayTask = {
  id: string;
  text: string;
  done: boolean;
  priority: "high" | "medium" | "low";
};

type WeekPlan = {
  [day: string]: DayTask[];
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAY_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const PRIORITY_COLORS = {
  high: { bg: "rgba(239,68,68,0.15)", color: "#EF4444", label: "Haute" },
  medium: { bg: "rgba(245,194,0,0.15)", color: "#F5C200", label: "Moyenne" },
  low: { bg: "rgba(52,211,153,0.15)", color: "#34D399", label: "Basse" },
};
const STORAGE_KEY = "gm_smart_planner";

function getThisMonday(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDate(monday: Date, dayIndex: number): string {
  const d = new Date(monday);
  d.setDate(d.getDate() + dayIndex);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function SmartPlanner() {
  const [weekPlan, setWeekPlan] = useState<WeekPlan>({});
  const [selectedDay, setSelectedDay] = useState(0);
  const [newTaskText, setNewTaskText] = useState("");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");
  const monday = getThisMonday();
  const todayIndex = (new Date().getDay() + 6) % 7; // 0=Mon..6=Sun

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setWeekPlan(JSON.parse(stored));
    } catch {}
  }, []);

  function save(plan: WeekPlan) {
    setWeekPlan(plan);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(plan)); } catch {}
  }

  function addTask() {
    if (!newTaskText.trim()) return;
    const dayKey = DAYS[selectedDay];
    const task: DayTask = { id: uid(), text: newTaskText.trim(), done: false, priority: newPriority };
    const updated = { ...weekPlan, [dayKey]: [...(weekPlan[dayKey] ?? []), task] };
    save(updated);
    setNewTaskText("");
  }

  function toggleTask(dayKey: string, taskId: string) {
    const tasks = (weekPlan[dayKey] ?? []).map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    save({ ...weekPlan, [dayKey]: tasks });
  }

  function removeTask(dayKey: string, taskId: string) {
    const tasks = (weekPlan[dayKey] ?? []).filter((t) => t.id !== taskId);
    save({ ...weekPlan, [dayKey]: tasks });
  }

  const dayKey = DAYS[selectedDay];
  const tasks = weekPlan[dayKey] ?? [];
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div className="p-4 space-y-4">
      {/* Week header */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {DAYS.map((d, i) => {
          const dayTasks = weekPlan[d] ?? [];
          const allDone = dayTasks.length > 0 && dayTasks.every((t) => t.done);
          const isToday = i === todayIndex;
          return (
            <button
              key={d}
              onClick={() => setSelectedDay(i)}
              className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 transition-all min-w-[52px]"
              style={{
                background: selectedDay === i
                  ? "rgba(59,130,246,0.2)"
                  : isToday ? "rgba(245,194,0,0.08)" : "rgba(255,255,255,0.03)",
                border: selectedDay === i
                  ? "1px solid rgba(59,130,246,0.4)"
                  : isToday ? "1px solid rgba(245,194,0,0.2)" : "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span className="text-[10px] font-medium"
                style={{ color: selectedDay === i ? "#60A5FA" : isToday ? "#F5C200" : "rgba(255,255,255,0.5)" }}>
                {d}
              </span>
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {formatDate(monday, i)}
              </span>
              {dayTasks.length > 0 && (
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: allDone ? "#34D399" : "#60A5FA" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">{DAY_FULL[selectedDay]}</h3>
          {tasks.length > 0 && (
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
              {doneCount}/{tasks.length} fait{doneCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Tasks */}
        <div className="space-y-2 mb-3">
          {tasks.length === 0 && (
            <p className="text-xs text-center py-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              Aucune tâche — ajoutes-en une ci-dessous
            </p>
          )}
          {tasks.map((task) => {
            const pc = PRIORITY_COLORS[task.priority];
            return (
              <div key={task.id}
                className="flex items-center gap-2.5 rounded-xl p-2.5"
                style={{
                  background: task.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  opacity: task.done ? 0.5 : 1,
                }}>
                <button
                  onClick={() => toggleTask(dayKey, task.id)}
                  className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full border transition-all"
                  style={{
                    borderColor: task.done ? "#34D399" : "rgba(255,255,255,0.2)",
                    background: task.done ? "rgba(52,211,153,0.15)" : "transparent",
                    color: "#34D399",
                  }}
                >
                  {task.done && (
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
                <span className="flex-1 text-sm text-white/80" style={{ textDecoration: task.done ? "line-through" : "none" }}>
                  {task.text}
                </span>
                <span className="text-[10px] rounded-full px-1.5 py-0.5 shrink-0"
                  style={{ background: pc.bg, color: pc.color }}>
                  {pc.label}
                </span>
                <button onClick={() => removeTask(dayKey, task.id)}
                  className="shrink-0 h-5 w-5 flex items-center justify-center rounded text-white/20 hover:text-white/50 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                    <path d="M6 6l12 12M18 6l-12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Add task */}
        <div className="flex gap-2">
          <input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Nouvelle tâche..."
            className="flex-1 rounded-xl px-3 py-2 text-sm text-white placeholder-white/20 outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as "high" | "medium" | "low")}
            className="rounded-xl px-2 py-2 text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
          >
            <option value="high">🔴 Haute</option>
            <option value="medium">🟡 Moyenne</option>
            <option value="low">🟢 Basse</option>
          </select>
          <button
            onClick={addTask}
            className="rounded-xl px-3 py-2 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: "linear-gradient(135deg, #1A3FD8 0%, #3B82F6 100%)", color: "#fff" }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
