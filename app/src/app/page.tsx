"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, CalendarDays, CheckSquare, NotebookPen, UtensilsCrossed, Flower2, Heart, Bell, UserCircle2, LogOut, Settings, ListTodo } from "lucide-react";
import QuoteBar from "../components/QuoteBar";
import Dashboard from "../components/Dashboard";
import Calendar, { type CalendarTaskMap } from "../components/Calendar";
import Notes, { type Note } from "../components/Notes";
import PreDefinedTasks, { type CategoryMap, initCategoryTasks } from "../components/PreDefinedTasks";
import FoodLog, { type FoodLogData } from "../components/FoodLog";
import TasksList from "../components/TasksList";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "tasks",     label: "Tasks",     icon: ListTodo },
  { id: "routine",   label: "Routine",   icon: CheckSquare },
  { id: "notes",     label: "Notes",     icon: NotebookPen },
  { id: "food",      label: "Food Log",  icon: UtensilsCrossed },
];

export default function Home() {
  const [tab, setTab] = useState("dashboard");

  const [calendarTasks, setCalendarTasks] = useState<CalendarTaskMap>({});
  const [categoryTasks, setCategoryTasks] = useState<CategoryMap>(initCategoryTasks);
  const [notes, setNotes] = useState<Note[]>([]);
  const [foodLog, setFoodLog] = useState<FoodLogData>({});
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        if (data.calendarTasks) setCalendarTasks(data.calendarTasks);
        if (data.categoryTasks) setCategoryTasks(data.categoryTasks);
        if (data.notes) setNotes(data.notes);
        if (data.foodLog) setFoodLog(data.foodLog);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoaded(true);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const timeout = setTimeout(() => {
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendarTasks,
          categoryTasks,
          notes,
          foodLog
        })
      }).catch(e => console.error("Failed to save data", e));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [calendarTasks, categoryTasks, notes, foodLog, isLoaded]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf2f8]">
      <header className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Flower2 className="text-pink-400" size={22} />
            <div>
              <h1 className="text-xl font-bold text-pink-600">My Planner</h1>
              <p className="text-xs text-pink-400">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
          </div>

          {/* Notification + Avatar */}
          <div className="flex items-center gap-1">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-50 transition-colors">
              <Bell size={18} className="text-pink-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
            </button>
            <div ref={avatarRef} className="relative">
              <button
                onClick={() => setAvatarOpen(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-50 transition-colors">
                <UserCircle2 size={28} className="text-pink-400" />
              </button>
              {avatarOpen && (
                <div className="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-lg border border-pink-100 py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-pink-50">
                    <p className="text-xs font-semibold text-pink-700">My Account</p>
                  </div>
                  <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 transition-colors">
                    <Settings size={14} /> Settings
                  </button>
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <QuoteBar />

        <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer
                ${tab === t.id ? "border-pink-500 text-pink-600" : "border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-200"}`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        {tab === "dashboard" && (
          <Dashboard
            calendarTasks={calendarTasks}
            categoryTasks={categoryTasks}
            notes={notes}
            foodLog={foodLog}
            onNavigate={setTab}
          />
        )}
        {tab === "calendar" && <Calendar tasks={calendarTasks} setTasks={setCalendarTasks} />}
        {tab === "tasks"    && <TasksList tasks={calendarTasks} setTasks={setCalendarTasks} onNavigate={setTab} />}
        {tab === "routine"  && <PreDefinedTasks categoryTasks={categoryTasks} setCategoryTasks={setCategoryTasks} />}
        {tab === "notes"    && <Notes notes={notes} setNotes={setNotes} />}
        {tab === "food"     && <FoodLog log={foodLog} setLog={setFoodLog} />}
      </main>

      <footer className="text-center text-pink-300 text-xs py-4 flex items-center justify-center gap-1">
        Made with <Heart size={12} className="fill-pink-300 text-pink-300" /> just for you
      </footer>
    </div>
  );
}
