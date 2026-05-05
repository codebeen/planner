"use client";
import { useState, useEffect, useCallback } from "react";
import { CalendarDays, Clock, Check, X, Inbox, Loader2 } from "lucide-react";
import { type CalendarTask } from "./Calendar";
import { useUser } from "@/src/hooks/useUser";
import { apiFetch } from "@/src/lib/api";


function formatTime(t: string) {
  if (!t) return "";
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
  onNavigate: (tab: string) => void;
}

export default function TasksList({ onNavigate }: Props) {
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/api/tasks?user_id=${user.user_id}`);
      setTasks(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const toggle = async (task: CalendarTask) => {
    try {
      const updated = await apiFetch(`/api/tasks/${task.task_id}`, {
        method: "PUT",
        body: JSON.stringify({ ...task, is_done: !task.is_done }),
      });
      setTasks(prev => prev.map(t => t.task_id === task.task_id ? updated : t));
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (task_id: string) => {
    try {
      await apiFetch(`/api/tasks/${task_id}`, { method: "DELETE" });
      setTasks(prev => prev.filter(t => t.task_id !== task_id));
    } catch (e) {
      console.error(e);
    }
  };

  // Group tasks by date
  const groupedTasks = tasks.reduce((acc, task) => {
    const key = task.task_date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {} as Record<string, CalendarTask[]>);

  // Sort date keys chronologically
  const sortedKeys = Object.keys(groupedTasks).sort((a, b) => {
    const [ay, am, ad] = a.split("-").map(Number);
    const [by, bm, bd] = b.split("-").map(Number);
    return new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime();
  });

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.is_done).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24 text-pink-300">
        <Loader2 size={48} className="animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
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
      {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}
      
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
        const dateTasks = groupedTasks[dateKey];
        const today = isToday(dateKey);
        const past = isPast(dateKey);
        const doneCnt = dateTasks.filter(t => t.is_done).length;

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
                <li key={t.task_id} className="flex items-center gap-3 px-4 py-3 group hover:bg-pink-50/50 transition-colors">
                  <button
                    onClick={() => toggle(t)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors
                      ${t.is_done ? "bg-pink-400 border-pink-400" : "border-pink-300 hover:border-pink-500"}`}
                  >
                    {t.is_done && <Check size={10} className="text-white" strokeWidth={3} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${t.is_done ? "line-through text-pink-300" : "text-pink-800"}`}>{t.name}</p>
                    <p className="text-xs text-pink-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {formatTime(t.start_time)} – {formatTime(t.end_time)}
                    </p>
                  </div>
                  <button
                    onClick={() => remove(t.task_id)}
                    className="text-pink-400 hover:text-pink-600 flex-shrink-0 mt-0.5"
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
