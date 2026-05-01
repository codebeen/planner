"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Check, X, Clock } from "lucide-react";

export type CalendarTask = { id: number; text: string; start: string; end: string; done: boolean };
export type CalendarTaskMap = Record<string, CalendarTask[]>;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function timeToMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

const EMPTY_FORM = { text: "", start: "08:00", end: "09:00" };

interface Props {
  tasks: CalendarTaskMap;
  setTasks: React.Dispatch<React.SetStateAction<CalendarTaskMap>>;
}

export default function Calendar({ tasks, setTasks }: Props) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  const key = (d: number) => `${year}-${month + 1}-${d}`;

  const addTask = () => {
    if (!form.text.trim() || !selected || timeToMin(form.start) >= timeToMin(form.end)) return;
    setTasks(prev => ({
      ...prev,
      [selected]: [...(prev[selected] || []), { id: Date.now(), text: form.text.trim(), start: form.start, end: form.end, done: false }]
        .sort((a, b) => timeToMin(a.start) - timeToMin(b.start)),
    }));
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const toggleTask = (dateKey: string, id: number) =>
    setTasks(prev => ({ ...prev, [dateKey]: prev[dateKey].map(t => t.id === id ? { ...t, done: !t.done } : t) }));

  const removeTask = (dateKey: string, id: number) =>
    setTasks(prev => ({ ...prev, [dateKey]: prev[dateKey].filter(t => t.id !== id) }));

  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const selectedTasks = selected ? (tasks[selected] || []) : [];
  const barWidth = (t: CalendarTask) => Math.min(100, ((timeToMin(t.end) - timeToMin(t.start)) / 240) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-pink-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center"><ChevronLeft size={16} /></button>
          <h2 className="text-pink-700 font-semibold text-lg">{MONTHS[month]} {year}</h2>
          <button onClick={nextMonth} className="w-8 h-8 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center"><ChevronRight size={16} /></button>
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
            const hasTasks = (tasks[k]?.length ?? 0) > 0;
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
      </div>

      <div className="lg:w-100 bg-white rounded-2xl shadow-sm border border-pink-100 p-4 flex flex-col min-h-64">
        {selected ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-pink-700 font-semibold flex items-center gap-1.5"><CalendarDays size={15} /> {selected}</h3>
              <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-1 text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-xl font-medium">
                <Plus size={13} /> Add
              </button>
            </div>
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
                  <button onClick={addTask} className="text-xs bg-pink-500 hover:bg-pink-600 text-white px-3 py-1.5 rounded-lg font-medium">Save</button>
                </div>
              </div>
            )}
            <ul className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {selectedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center text-pink-300 py-8">
                  <Clock size={28} className="mb-2 text-pink-200" />
                  <p className="text-sm">No events yet</p>
                </div>
              )}
              {selectedTasks.map(t => (
                <li key={t.id} className={`group rounded-xl border p-3 ${t.done ? "border-pink-100 bg-pink-50/50" : "border-pink-100 bg-pink-50"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <button onClick={() => toggleTask(selected, t.id)}
                        className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                          ${t.done ? "bg-pink-400 border-pink-400" : "border-pink-300 hover:border-pink-500"}`}>
                        {t.done && <Check size={8} className="text-white" strokeWidth={3} />}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${t.done ? "line-through text-pink-300" : "text-pink-800"}`}>{t.text}</p>
                        <p className="text-xs text-pink-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {formatTime(t.start)} – {formatTime(t.end)}</p>
                        <div className="mt-1.5 h-1 bg-pink-100 rounded-full w-full">
                          <div className={`h-1 rounded-full transition-all ${t.done ? "bg-pink-200" : "bg-pink-400"}`} style={{ width: `${barWidth(t)}%` }} />
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeTask(selected, t.id)} className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-500 flex-shrink-0 mt-0.5"><X size={13} /></button>
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
