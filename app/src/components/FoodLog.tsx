"use client";
import { useState, useEffect, useCallback } from "react";
import { Sunrise, Sun, Moon, Apple, UtensilsCrossed, Flame, X, Plus, Loader2 } from "lucide-react";

import { useUser } from "@/src/hooks/useUser";
import { apiFetch } from "@/src/lib/api";

export type FoodLogEntry = { 
  food_log_id: string; 
  date_time: string; 
  food: string; 
  calories: number; 
  category: MealType;
  user_id: string;
};

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

const MEAL_TYPES: { label: MealType; icon: React.ReactNode }[] = [
  { label: "Breakfast", icon: <Sunrise size={14} /> },
  { label: "Lunch",     icon: <Sun size={14} /> },
  { label: "Dinner",    icon: <Moon size={14} /> },
  { label: "Snack",     icon: <Apple size={14} /> },
];
const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const datePart = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).toLowerCase();
  return `${datePart} - ${timePart}`;
};

export default function FoodLog() {
  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };
  const [date, setDate] = useState(getTodayStr());
  const [active, setActive] = useState<MealType>("Breakfast");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // ── Fetch logs ───────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Calculate local day boundaries in UTC
      const localDate = new Date(date + "T00:00:00");
      const start = new Date(localDate.getTime());
      const end = new Date(localDate.getTime());
      end.setHours(23, 59, 59, 999);

      const data = await apiFetch(`/api/food-logs?user_id=${user.user_id}&start=${start.toISOString()}&end=${end.toISOString()}`);
      setEntries(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [user, date]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // ── Add entry ────────────────────────────────────────────────────────────
  const add = async () => {
    if (!user || !food.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const created = await apiFetch("/api/food-logs", {
        method: "POST",
        body: JSON.stringify({
          food: food.trim(),
          category: active,
          calories: parseFloat(calories) || 0,
          date_time: `${date}T${new Date().toISOString().split("T")[1]}`,
          user_id: user.user_id,
        }),
      });
      setEntries(prev => [...prev, created]);
      setFood(""); 
      setCalories("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setAdding(false);
    }
  };

  // ── Remove entry ─────────────────────────────────────────────────────────
  const remove = async (id: string) => {
    setError(null);
    try {
      await apiFetch(`/api/food-logs/${id}`, { method: "DELETE" });
      setEntries(prev => prev.filter(m => m.food_log_id !== id));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    }
  };

  const filteredMeals = entries.filter(e => e.category === active);
  const totalCals = entries.reduce((sum, m) => sum + (m.calories || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-pink-700 font-semibold text-lg flex items-center gap-2"><UtensilsCrossed size={18} /> Food Log</h2>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="text-sm border border-pink-200 rounded-xl px-3 py-1.5 outline-none focus:border-pink-400 bg-pink-50 text-pink-700" />
          {!loading && totalCals > 0 && (
            <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1"><Flame size={12} /> {totalCals} kcal</span>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-2 mb-4 flex-wrap">
        {MEAL_TYPES.map(m => (
          <button key={m.label} onClick={() => setActive(m.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${active === m.label ? "bg-pink-500 text-white shadow-sm" : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"}`}>
            {m.icon} {m.label}
            {entries.filter(e => e.category === m.label).length > 0 && (
              <span className={`ml-0.5 text-xs ${active === m.label ? "text-pink-200" : "text-pink-400"}`}>
                ({entries.filter(e => e.category === m.label).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          <input value={food} onChange={e => setFood(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
            placeholder={`What did you eat for ${active.toLowerCase()}?`}
            disabled={adding}
            className="flex-1 min-w-40 text-sm border border-pink-200 rounded-xl px-3 py-2 outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 disabled:opacity-50" />
          <input value={calories} onChange={e => setCalories(e.target.value)} placeholder="kcal (optional)"
            type="number"
            step="any"
            disabled={adding}
            className="w-32 text-sm border border-pink-200 rounded-xl px-3 py-2 outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 disabled:opacity-50" />
          <button onClick={add} disabled={adding || !food.trim()} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 text-sm font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors">
            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 text-pink-300">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {filteredMeals.length === 0 && (
            <div className="text-center text-pink-300 py-8">
              <UtensilsCrossed size={36} className="mx-auto mb-1 text-pink-200" />
              <p className="text-sm">Nothing logged for {active.toLowerCase()} yet</p>
            </div>
          )}
          {filteredMeals.map(m => (
            <div key={m.food_log_id} className="bg-white rounded-xl border border-pink-100 px-4 py-3 flex items-center justify-between group">
              <div>
                <p className="text-sm font-medium text-pink-800">{m.food}</p>
                <p className="text-xs text-pink-400">
                  {formatDateTime(m.date_time)}
                  {m.calories ? ` · ${m.calories} kcal` : ""}
                </p>
              </div>
              <button onClick={() => remove(m.food_log_id)} className="text-pink-400 hover:text-pink-600 flex-shrink-0 mt-0.5">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
