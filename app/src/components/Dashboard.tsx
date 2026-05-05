"use client";
import { useState, useEffect } from "react";
import { CalendarDays, CheckSquare, NotebookPen, UtensilsCrossed, Clock, Check, Flame, TrendingUp } from "lucide-react";
import { createClient } from "@/src/utils/supabase/client";
import { useUser } from "@/src/hooks/useUser";
import { apiFetch } from "@/src/lib/api";

type CalendarTask = { task_id: string; name: string; task_date: string; start_time: string; end_time: string; is_done: boolean };
type CategoryMap = Record<string, { id: number; label: string; done: boolean }[]>;
type Note = { note_id: string; title: string; content: string; color?: string };
type FoodLogEntry = { food_log_id: string; food: string; category: MealType; calories: number; date_time: string };
type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";


interface DashboardProps {
  onNavigate: (tab: string) => void;
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [foodEntries, setFoodEntries] = useState<FoodLogEntry[]>([]);
  const [todayTasks, setTodayTasks] = useState<CalendarTask[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Fetch Notes
      apiFetch(`/api/notes?user_id=${user.user_id}`)
        .then((data: Note[]) => setNotes(Array.isArray(data) ? data : []))
        .catch(() => setNotes([]));

      // Fetch Today's Food
      const d = new Date();
      const todayStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      const localDate = new Date(todayStr + "T00:00:00");
      const start = new Date(localDate.getTime());
      const end = new Date(localDate.getTime());
      end.setHours(23, 59, 59, 999);

      apiFetch(`/api/food-logs?user_id=${user.user_id}&start=${start.toISOString()}&end=${end.toISOString()}`)
        .then((data: FoodLogEntry[]) => setFoodEntries(Array.isArray(data) ? data : []))
        .catch(() => setFoodEntries([]));

      // Fetch Today's Tasks
      apiFetch(`/api/tasks?user_id=${user.user_id}&date=${todayStr}`)
        .then((data: CalendarTask[]) => setTodayTasks(Array.isArray(data) ? data : []))
        .catch(() => setTodayTasks([]));
    }
  }, [user]);

  const todayDate = new Date();
  const todayEvents = [...todayTasks].sort((a, b) => a.start_time.localeCompare(b.start_time));

  const totalCals = foodEntries.reduce((s, m) => s + (m.calories || 0), 0);
  const mealsLogged = foodEntries.length;

  // Group food by category for the UI
  const groupedFood = foodEntries.reduce((acc, entry) => {
    if (!acc[entry.category]) acc[entry.category] = [];
    acc[entry.category].push(entry);
    return acc;
  }, {} as Record<MealType, FoodLogEntry[]>);

  const upcomingEvent = todayEvents.find(e => !e.is_done);

  const PRESETS = ["Morning Routine", "Self Care", "Study / Work", "Household"];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl p-5 text-white">
        <p className="text-sm opacity-80">
          {todayDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="text-2xl font-bold mt-0.5">Good {todayDate.getHours() < 12 ? "morning" : todayDate.getHours() < 17 ? "afternoon" : "evening"}, {user?.display_name || "Guest"} ✨</h2>
        {upcomingEvent && (
          <p className="text-sm mt-2 opacity-90 flex items-center gap-1.5">
            <Clock size={13} /> Next: <span className="font-medium">{upcomingEvent.name}</span> at {formatTime(upcomingEvent.start_time)}
          </p>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <button onClick={() => onNavigate("calendar")} className="bg-white rounded-2xl border border-pink-100 p-4 text-left hover:border-pink-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <CalendarDays size={18} className="text-pink-400" />
            <span className="text-xs text-pink-300">Today</span>
          </div>
          <p className="text-2xl font-bold text-pink-700">{todayEvents.length}</p>
          <p className="text-xs text-pink-400 mt-0.5">scheduled events</p>
        </button>

        <button onClick={() => onNavigate("tasks")} className="bg-white rounded-2xl border border-pink-100 p-4 text-left hover:border-pink-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <CheckSquare size={18} className="text-pink-400" />
            <span className="text-xs text-pink-300">{todayEvents.length > 0 ? `${Math.round((todayEvents.filter(e => e.is_done).length / todayEvents.length) * 100)}%` : "0%"}</span>
          </div>
          <p className="text-2xl font-bold text-pink-700">{todayEvents.filter(e => e.is_done).length}<span className="text-sm font-normal text-pink-300">/{todayEvents.length}</span></p>
          <p className="text-xs text-pink-400 mt-0.5">tasks done</p>
        </button>

        <button onClick={() => onNavigate("notes")} className="bg-white rounded-2xl border border-pink-100 p-4 text-left hover:border-pink-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <NotebookPen size={18} className="text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-pink-700">{notes.length}</p>
          <p className="text-xs text-pink-400 mt-0.5">notes saved</p>
        </button>

        <button onClick={() => onNavigate("food")} className="bg-white rounded-2xl border border-pink-100 p-4 text-left hover:border-pink-300 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <UtensilsCrossed size={18} className="text-pink-400" />
            {totalCals > 0 && <span className="text-xs text-pink-300 flex items-center gap-0.5"><Flame size={10} />{totalCals}</span>}
          </div>
          <p className="text-2xl font-bold text-pink-700">{mealsLogged}</p>
          <p className="text-xs text-pink-400 mt-0.5">meals logged today</p>
        </button>
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's schedule */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-pink-700 text-sm flex items-center gap-1.5"><Clock size={15} /> Today&apos;s Schedule</h3>
            <button onClick={() => onNavigate("calendar")} className="text-xs text-pink-400 hover:text-pink-600">View all</button>
          </div>
          {todayEvents.length === 0 ? (
            <div className="text-center text-pink-200 py-6">
              <CalendarDays size={28} className="mx-auto mb-1" />
              <p className="text-xs text-pink-300">No events today</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {todayEvents.slice(0, 4).map(e => (
                <li key={e.task_id} className={`flex items-center gap-3 p-2 rounded-xl ${e.is_done ? "opacity-50" : "bg-pink-50"}`}>
                  <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${e.is_done ? "bg-pink-200" : "bg-pink-400"}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${e.is_done ? "line-through text-pink-300" : "text-pink-800"}`}>{e.name}</p>
                    <p className="text-xs text-pink-400">{formatTime(e.start_time)} – {formatTime(e.end_time)}</p>
                  </div>
                  {e.is_done && <Check size={14} className="text-pink-300 flex-shrink-0 ml-auto" />}
                </li>
              ))}
              {todayEvents.length > 4 && <p className="text-xs text-pink-300 text-center">+{todayEvents.length - 4} more</p>}
            </ul>
          )}
        </div>


        {/* Recent notes */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-pink-700 text-sm flex items-center gap-1.5"><NotebookPen size={15} /> Recent Notes</h3>
            <button onClick={() => onNavigate("notes")} className="text-xs text-pink-400 hover:text-pink-600">View all</button>
          </div>
          {notes.length === 0 ? (
            <div className="text-center text-pink-200 py-6">
              <NotebookPen size={28} className="mx-auto mb-1" />
              <p className="text-xs text-pink-300">No notes yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.slice(-3).reverse().map(n => (
                <div key={n.note_id} className={`${n.color ?? "bg-pink-50"} rounded-xl p-3 border border-pink-100`}>
                  {n.title && <p className="text-xs font-semibold text-pink-800 truncate">{n.title}</p>}
                  <div 
                    className="text-xs text-pink-500 line-clamp-2 mt-0.5 prose-preview"
                    dangerouslySetInnerHTML={{ __html: n.content }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's food */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-pink-700 text-sm flex items-center gap-1.5"><UtensilsCrossed size={15} /> Today&apos;s Food</h3>
            <button onClick={() => onNavigate("food")} className="text-xs text-pink-400 hover:text-pink-600">View all</button>
          </div>
          {mealsLogged === 0 ? (
            <div className="text-center text-pink-200 py-6">
              <UtensilsCrossed size={28} className="mx-auto mb-1" />
              <p className="text-xs text-pink-300">No food logged today</p>
            </div>
          ) :
          (
            <div className="space-y-1.5">
              {(["Breakfast", "Lunch", "Dinner", "Snack"] as MealType[]).map(type => {
                const items = groupedFood[type] ?? [];
                if (!items.length) return null;
                return (
                  <div key={type} className="flex items-center justify-between text-xs">
                    <span className="text-pink-500 font-medium w-20">{type}</span>
                    <span className="text-pink-700 flex-1 truncate">{items.map(i => i.food).join(", ")}</span>
                    {items.some(i => i.calories) && (
                      <span className="text-pink-400 ml-2 flex-shrink-0">{items.reduce((s, i) => s + (i.calories || 0), 0)} kcal</span>
                    )}
                  </div>
                );
              })}
              {totalCals > 0 && (
                <div className="pt-2 border-t border-pink-100 flex justify-between text-xs font-semibold">
                  <span className="text-pink-600">Total</span>
                  <span className="text-pink-600 flex items-center gap-1"><Flame size={11} /> {totalCals} kcal</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
