"use client";
import { useState } from "react";
import { Sunrise, Sun, Moon, Apple, UtensilsCrossed, Flame, X, Plus } from "lucide-react";

export type Meal = { id: number; time: string; food: string; calories: string };
export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type FoodLogData = Record<string, Record<MealType, Meal[]>>;

const MEAL_TYPES: { label: MealType; icon: React.ReactNode }[] = [
  { label: "Breakfast", icon: <Sunrise size={14} /> },
  { label: "Lunch",     icon: <Sun size={14} /> },
  { label: "Dinner",    icon: <Moon size={14} /> },
  { label: "Snack",     icon: <Apple size={14} /> },
];

interface Props {
  log: FoodLogData;
  setLog: React.Dispatch<React.SetStateAction<FoodLogData>>;
}

export default function FoodLog({ log, setLog }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [active, setActive] = useState<MealType>("Breakfast");
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  const meals = log[date]?.[active] ?? [];

  const add = () => {
    if (!food.trim()) return;
    const entry: Meal = { id: Date.now(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), food: food.trim(), calories };
    setLog(prev => ({ ...prev, [date]: { ...prev[date], [active]: [...(prev[date]?.[active] ?? []), entry] } }));
    setFood(""); setCalories("");
  };

  const remove = (id: number) =>
    setLog(prev => ({ ...prev, [date]: { ...prev[date], [active]: prev[date][active].filter(m => m.id !== id) } }));

  const totalCals = Object.values(log[date] ?? {}).flat()
    .flatMap(m => (Array.isArray(m) ? m : []))
    .reduce((sum, m) => sum + (parseInt(m.calories) || 0), 0);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-pink-700 font-semibold text-lg flex items-center gap-2"><UtensilsCrossed size={18} /> Food Log</h2>
        <div className="flex items-center gap-2">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="text-sm border border-pink-200 rounded-xl px-3 py-1.5 outline-none focus:border-pink-400 bg-pink-50 text-pink-700" />
          {totalCals > 0 && (
            <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1"><Flame size={12} /> {totalCals} kcal</span>
          )}
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {MEAL_TYPES.map(m => (
          <button key={m.label} onClick={() => setActive(m.label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors
              ${active === m.label ? "bg-pink-500 text-white shadow-sm" : "bg-white border border-pink-200 text-pink-600 hover:bg-pink-50"}`}>
            {m.icon} {m.label}
            {(log[date]?.[m.label]?.length ?? 0) > 0 && (
              <span className={`ml-0.5 text-xs ${active === m.label ? "text-pink-200" : "text-pink-400"}`}>({log[date][m.label].length})</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          <input value={food} onChange={e => setFood(e.target.value)} onKeyDown={e => e.key === "Enter" && add()}
            placeholder={`What did you eat for ${active.toLowerCase()}?`}
            className="flex-1 min-w-40 text-sm border border-pink-200 rounded-xl px-3 py-2 outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300" />
          <input value={calories} onChange={e => setCalories(e.target.value)} placeholder="kcal (optional)"
            className="w-32 text-sm border border-pink-200 rounded-xl px-3 py-2 outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300" />
          <button onClick={add} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-4 text-sm font-medium flex items-center gap-1.5"><Plus size={14} /> Add</button>
        </div>
      </div>

      <div className="space-y-2">
        {meals.length === 0 && (
          <div className="text-center text-pink-300 py-8">
            <UtensilsCrossed size={36} className="mx-auto mb-1 text-pink-200" />
            <p className="text-sm">Nothing logged for {active.toLowerCase()} yet</p>
          </div>
        )}
        {meals.map(m => (
          <div key={m.id} className="bg-white rounded-xl border border-pink-100 px-4 py-3 flex items-center justify-between group">
            <div>
              <p className="text-sm font-medium text-pink-800">{m.food}</p>
              <p className="text-xs text-pink-400">{m.time}{m.calories ? ` · ${m.calories} kcal` : ""}</p>
            </div>
            <button onClick={() => remove(m.id)} className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-500"><X size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
