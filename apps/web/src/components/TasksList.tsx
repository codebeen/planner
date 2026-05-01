"use client";
import { CalendarDays, Clock, Check, X, Inbox } from "lucide-react";
import { type CalendarTaskMap, type CalendarTask } from "./Calendar";

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function formatDateKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function isToday(key: string) {
  const today = new Date();
  const [y, m, d] = key.split("-").map(Number);
  return today.getFullYear() === y && today.getMonth() + 1 === m && today.getDate() === d;
}

function isPast(key: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d) < today;
}

interface Props {
  tasks: CalendarTaskMap;
  setTasks: React.Dispatch<React.SetStateAction<CalendarTaskMap>>;
  onNavigate: (tab: string) => void;
}

export default function TasksList({ tasks, setTasks, onNavigate }: Props) {
  const toggle = (dateKey: string, id: number) =>
    setTasks(prev => ({ ...prev, [dateKey]: prev[dateKey].map(t => t.id === id ? { ...t, done: !t.done } : t) }));

  const remove = (dateKey: string, id: number) =>
    setTasks(prev => ({ ...prev, [dateKey]: prev[dateKey].filter(t => t.id !== id) }));

  // Sort date keys chronologically
  const sortedKeys = Object.keys(tasks)
    .filter(k => tasks[k].length > 0)
    .sort((a, b) => {
      const [ay, am, ad] = a.split("-").map(Number);
      const [by, bm, bd] = b.split("-").map(Number);
      return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime();
    });

  const totalTasks = sortedKeys.reduce((s, k) => s + tasks[k].length, 0);
  const doneTasks = sortedKeys.reduce((s, k) => s + tasks[k].filter(t => t.done).length, 0);

  if (sortedKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-pink-300">
        <Inbox size={48} className="mb-3 text-pink-200" />
        <p className="text-base font-medium text-pink-400">No tasks scheduled yet</p>
        <p className="text-sm mt-1">Go to the Calendar tab to add tasks to dates</p>
        <button
          onClick={() => onNavigate("calendar")}
          className="mt-4 px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Open Calendar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Summary bar */}
      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} className="text-pink-400" />
          <span className="text-sm font-semibold text-pink-700">{totalTasks} scheduled tasks</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-pink-400">{doneTasks}/{totalTasks} done</span>
          <div className="w-24 h-1.5 bg-pink-100 rounded-full">
            <div className="h-1.5 bg-pink-400 rounded-full transition-all" style={{ width: `${totalTasks ? (doneTasks / totalTasks) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {sortedKeys.map(dateKey => {
        const dateTasks = tasks[dateKey];
        const today = isToday(dateKey);
        const past = isPast(dateKey);
        const doneCnt = dateTasks.filter(t => t.done).length;

        return (
          <div key={dateKey} className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
            {/* Date header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b border-pink-50
              ${today ? "bg-pink-500" : past ? "bg-pink-50" : "bg-white"}`}>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className={today ? "text-white" : "text-pink-400"} />
                <span className={`text-sm font-semibold ${today ? "text-white" : past ? "text-pink-400" : "text-pink-700"}`}>
                  {today ? "Today — " : ""}{formatDateKey(dateKey)}
                </span>
                {today && <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">Today</span>}
                {past && !today && <span className="text-xs bg-pink-200 text-pink-500 px-2 py-0.5 rounded-full">Past</span>}
              </div>
              <span className={`text-xs ${today ? "text-pink-100" : "text-pink-400"}`}>{doneCnt}/{dateTasks.length}</span>
            </div>

            {/* Tasks */}
            <ul className="divide-y divide-pink-50">
              {dateTasks.map((t: CalendarTask) => (
                <li key={t.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-pink-50/50 transition-colors">
                  <button
                    onClick={() => toggle(dateKey, t.id)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                      ${t.done ? "bg-pink-400 border-pink-400" : "border-pink-300 hover:border-pink-500"}`}
                  >
                    {t.done && <Check size={10} className="text-white" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${t.done ? "line-through text-pink-300" : "text-pink-800"}`}>{t.text}</p>
                    <p className="text-xs text-pink-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {formatTime(t.start)} – {formatTime(t.end)}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(dateKey, t.id)}
                    className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-500 flex-shrink-0"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
