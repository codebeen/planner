"use client";
import { CalendarDays, CheckSquare, NotebookPen, UtensilsCrossed, Clock, Check, Flame, TrendingUp } from "lucide-react";

type CalendarTask = { id: number; text: string; start: string; end: string; done: boolean };
type CategoryMap = Record<string, { id: number; label: string; done: boolean }[]>;
type Note = { id: number; title: string; body: string; color: string };
type Meal = { id: number; time: string; food: string; calories: string };
type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

interface DashboardProps {
  calendarTasks: Record<string, CalendarTask[]>;
  categoryTasks: CategoryMap;
  notes: Note[];
  foodLog: Record<string, Record<MealType, Meal[]>>;
  onNavigate: (tab: string) => void;
}

function formatTime(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${m.toString().padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function Dashboard({ calendarTasks, categoryTasks, notes, foodLog, onNavigate }: DashboardProps) {
  const todayDate = new Date();
  const todayKey = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
  const todayEvents = (calendarTasks[todayKey] ?? []).sort((a, b) => a.start.localeCompare(b.start));

  const allTasks = Object.values(categoryTasks).flat();
  const doneTasks = allTasks.filter(t => t.done).length;
  const totalTasks = allTasks.length;

  const todayFood = foodLog[new Date().toISOString().split("T")[0]] ?? {};
  const totalCals = Object.values(todayFood).flat().reduce((s, m) => s + (parseInt(m.calories) || 0), 0);
  const mealsLogged = Object.values(todayFood).flat().length;

  const upcomingEvent = todayEvents.find(e => !e.done);

  const PRESETS = ["Morning Routine", "Self Care", "Study / Work", "Household"];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-300 rounded-2xl p-5 text-white">
        <p className="text-sm opacity-80">
          {todayDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="text-2xl font-bold mt-0.5">Good {todayDate.getHours() < 12 ? "morning" : todayDate.getHours() < 17 ? "afternoon" : "evening"}, Shanel ✨</h2>
        {upcomingEvent && (
          <p className="text-sm mt-2 opacity-90 flex items-center gap-1.5">
            <Clock size={13} /> Next: <span className="font-medium">{upcomingEvent.text}</span> at {formatTime(upcomingEvent.start)}
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
            <span className="text-xs text-pink-300">{totalTasks > 0 ? `${Math.round((doneTasks / totalTasks) * 100)}%` : "0%"}</span>
          </div>
          <p className="text-2xl font-bold text-pink-700">{doneTasks}<span className="text-sm font-normal text-pink-300">/{totalTasks}</span></p>
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
                <li key={e.id} className={`flex items-center gap-3 p-2 rounded-xl ${e.done ? "opacity-50" : "bg-pink-50"}`}>
                  <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${e.done ? "bg-pink-200" : "bg-pink-400"}`} />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${e.done ? "line-through text-pink-300" : "text-pink-800"}`}>{e.text}</p>
                    <p className="text-xs text-pink-400">{formatTime(e.start)} – {formatTime(e.end)}</p>
                  </div>
                  {e.done && <Check size={14} className="text-pink-300 flex-shrink-0 ml-auto" />}
                </li>
              ))}
              {todayEvents.length > 4 && <p className="text-xs text-pink-300 text-center">+{todayEvents.length - 4} more</p>}
            </ul>
          )}
        </div>

        {/* Task progress per category */}
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-pink-700 text-sm flex items-center gap-1.5"><TrendingUp size={15} /> Task Progress</h3>
            <button onClick={() => onNavigate("tasks")} className="text-xs text-pink-400 hover:text-pink-600">View all</button>
          </div>
          <div className="space-y-3">
            {PRESETS.map(cat => {
              const tasks = categoryTasks[cat] ?? [];
              const done = tasks.filter(t => t.done).length;
              const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-pink-700 font-medium">{cat}</span>
                    <span className="text-pink-400">{done}/{tasks.length}</span>
                  </div>
                  <div className="h-2 bg-pink-100 rounded-full">
                    <div className="h-2 bg-pink-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
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
                <div key={n.id} className={`${n.color} rounded-xl p-3 border border-pink-100`}>
                  {n.title && <p className="text-xs font-semibold text-pink-800 truncate">{n.title}</p>}
                  <p className="text-xs text-pink-500 line-clamp-2 mt-0.5">{n.body}</p>
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
                const items = todayFood[type] ?? [];
                if (!items.length) return null;
                return (
                  <div key={type} className="flex items-center justify-between text-xs">
                    <span className="text-pink-500 font-medium w-20">{type}</span>
                    <span className="text-pink-700 flex-1 truncate">{items.map(i => i.food).join(", ")}</span>
                    {items.some(i => i.calories) && (
                      <span className="text-pink-400 ml-2 flex-shrink-0">{items.reduce((s, i) => s + (parseInt(i.calories) || 0), 0)} kcal</span>
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
