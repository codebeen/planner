"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Check, X, Clock, Loader2 } from "lucide-react";

import { useUser } from "@/src/hooks/useUser";
import { apiFetch } from "@/src/lib/api";

export type CalendarTask = { 
  task_id: string; 
  name: string; 
  task_date: string; 
  start_time: string; 
  end_time: string; 
  is_done: boolean;
  user_id: string;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function timeToMin(t: string) {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const EMPTY_FORM = { text: "", start: "08:00", end: "09:00" };

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // ── Fetch tasks for the month ────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/tasks?user_id=${user.user_id}&year=${year}&month=${month + 1}`);
      setTasks(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user, year, month]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  
  const key = (d: number) => {
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = d.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // ── Add task ─────────────────────────────────────────────────────────────
  const addTask = async () => {
    if (!user || !form.text.trim() || !selected || timeToMin(form.start) >= timeToMin(form.end)) return;
    setSaving(true);
    setError(null);
    try {
      const created = await apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          name: form.text.trim(),
          task_date: selected,
          start_time: form.start,
          end_time: form.end,
          is_done: false,
          user_id: user.user_id,
        }),
      });
      setTasks(prev => [...prev, created].sort((a, b) => timeToMin(a.start_time) - timeToMin(b.start_time)));
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle task ──────────────────────────────────────────────────────────
  const toggleTask = async (task: CalendarTask) => {
    setError(null);
    try {
      const updated = await apiFetch(`/api/tasks/${task.task_id}`, {
        method: "PUT",
        body: JSON.stringify({ ...task, is_done: !task.is_done }),
      });
      setTasks(prev => prev.map(t => t.task_id === task.task_id ? updated : t));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  // ── Remove task ──────────────────────────────────────────────────────────
  const removeTask = async (task_id: string) => {
    setError(null);
    try {
      await apiFetch(`/api/tasks/${task_id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.task_id !== task_id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const selectedTasks = selected ? tasks.filter(t => t.task_date === selected) : [];
  const barWidth = (t: CalendarTask) => Math.min(100, ((timeToMin(t.end_time) - timeToMin(t.start_time)) / 240) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center transition-colors"><ChevronLeft size={16} /></button>
          <h2 className="text-pink-700 font-semibold text-lg">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center transition-colors"><ChevronRight size={16} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-pink-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />;
            const k = key(day);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = selected === k;
            const hasTasks = tasks.some(t => t.task_date === k);
            return (
              <button key={k} onClick={() => { setSelected(isSelected ? null : k); setShowForm(false); }}
                className={`relative aspect-square rounded-xl text-sm font-medium transition-all
                  ${isSelected ? "bg-pink-500 text-white shadow-md" : isToday ? "bg-pink-200 text-pink-800 font-bold" : "hover:bg-pink-50 text-pink-900"}`}>
                {day}
                {hasTasks && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-pink-400"}`} />}
              </button>
            );
          })}
        </div>
        {loading && <div className="mt-4 flex justify-center"><Loader2 size={20} className="animate-spin text-pink-300" /></div>}
      </div>

      <div className="lg:w-100 bg-white rounded-2xl shadow-sm border border-pink-100 p-4 flex flex-col min-h-64">
        {selected ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-pink-700 font-semibold flex items-center gap-1.5"><CalendarDays size={15} /> {selected}</h3>
              <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1 text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-xl font-medium transition-colors">
                <Plus size={13} /> Add
              </button>
            </div>
            
            {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

            {showForm && (
              <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-3 space-y-2">
                <input value={form.text} onChange={e => setForm(f => ({ ...f, text: e.target.value }))} onKeyDown={e => e.key === "Enter" && addTask()}
                  placeholder="Task / event name..." className="w-full text-sm border border-pink-200 rounded-lg px-3 py-2 outline-none focus:border-pink-400 bg-white placeholder-pink-300" />
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-xs text-pink-400 mb-1 block">Start</label>
                    <input type="time" value={form.start} onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                      className="w-full text-sm border border-pink-200 rounded-lg px-2 py-1.5 outline-none focus:border-pink-400 bg-white text-pink-700" />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-pink-400 mb-1 block">End</label>
                    <input type="time" value={form.end} onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                      className="w-full text-sm border border-pink-200 rounded-lg px-2 py-1.5 outline-none focus:border-pink-400 bg-white text-pink-700" />
                  </div>
                </div>
                {timeToMin(form.start) >= timeToMin(form.end) && <p className="text-xs text-rose-400">End time must be after start time</p>}
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setShowForm(false)} className="text-xs text-pink-400 hover:text-pink-600 px-2 py-1">Cancel</button>
                  <button onClick={addTask} disabled={saving} className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-lg font-medium disabled:opacity-50">
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            )}
            <ul className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {selectedTasks.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center text-pink-300 py-8">
                  <Clock size={28} className="mb-2 text-pink-200" />
                  <p className="text-sm">No events yet</p>
                </div>
              )}
              {selectedTasks.map(t => (
                <li key={t.task_id} className={`group rounded-xl border p-3 transition-colors ${t.is_done ? "border-pink-100 bg-pink-50/50" : "border-pink-100 bg-pink-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <button onClick={() => toggleTask(t)}
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                          ${t.is_done ? "bg-pink-400 border-pink-400" : "border-pink-300 hover:border-pink-500"}`}>
                        {t.is_done && <Check size={8} className="text-white" strokeWidth={3} />}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${t.is_done ? "line-through text-pink-300" : "text-pink-800"}`}>{t.name}</p>
                        <p className="text-xs text-pink-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {formatTime(t.start_time)} – {formatTime(t.end_time)}</p>
                        {t.end_time && (
                          <div className="mt-1.5 h-1 bg-pink-100 rounded-full w-full">
                            <div className={`h-1 rounded-full transition-all ${t.is_done ? "bg-pink-200" : "bg-pink-400"}`} style={{ width: `${barWidth(t)}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeTask(t.task_id)} className="text-pink-400 hover:text-pink-600 flex-shrink-0 mt-0.5"><X size={13} /></button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-pink-300">
            <CalendarDays size={40} className="mb-2 text-pink-200" />
            <p className="text-sm">Click a date to schedule</p>
          </div>
        )}
      </div>
    </div>
  );
}
