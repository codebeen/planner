"use client";
import { useState } from "react";
import { Sunrise, Sun, Moon, Sparkles, Check, Plus, X } from "lucide-react";

export type CategoryTask = { id: number; label: string; done: boolean };
export type CategoryMap = Record<string, CategoryTask[]>;

export const PRESETS: { category: string; icon: React.ReactNode; tasks: string[] }[] = [
  { category: "Morning Routine", icon: <Sunrise size={15} className="text-pink-500" />, tasks: ["Wake up early", "Drink water", "Skincare routine", "Exercise / stretch", "Eat breakfast", "Plan the day"] },
  { category: "Self Care", icon: <Sparkles size={15} className="text-pink-500" />, tasks: ["Meditate 10 mins", "Journal", "Read a book", "Take a walk", "No screen time 1hr before bed"] },
  { category: "Study / Work", icon: <Sun size={15} className="text-pink-500" />, tasks: ["Review notes", "Complete assignments", "Check emails", "Attend meetings", "Take breaks"] },
  { category: "Household", icon: <Moon size={15} className="text-pink-500" />, tasks: ["Make the bed", "Do laundry", "Clean desk", "Wash dishes", "Grocery shopping"] },
];

export function initCategoryTasks(): CategoryMap {
  return Object.fromEntries(
    PRESETS.map(p => [p.category, p.tasks.map((label, i) => ({ id: i, label, done: false }))])
  );
}

interface Props {
  categoryTasks: CategoryMap;
  setCategoryTasks: React.Dispatch<React.SetStateAction<CategoryMap>>;
}

export default function PreDefinedTasks({ categoryTasks, setCategoryTasks }: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  const toggle = (category: string, id: number) =>
    setCategoryTasks(prev => ({ ...prev, [category]: prev[category].map(t => t.id === id ? { ...t, done: !t.done } : t) }));

  const remove = (category: string, id: number) =>
    setCategoryTasks(prev => ({ ...prev, [category]: prev[category].filter(t => t.id !== id) }));

  const add = (category: string) => {
    const label = inputs[category]?.trim();
    if (!label) return;
    setCategoryTasks(prev => ({
      ...prev,
      [category]: [...(prev[category] ?? []), { id: Date.now(), label, done: false }],
    }));
    setInputs(prev => ({ ...prev, [category]: "" }));
  };

  return (
    <div className="space-y-5">
      {PRESETS.map(p => {
        const tasks = categoryTasks[p.category] ?? [];
        const done = tasks.filter(t => t.done).length;
        return (
          <div key={p.category} className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-pink-700 text-sm flex items-center gap-1.5">{p.icon} {p.category}</h3>
              <span className="text-xs text-pink-400">{done}/{tasks.length}</span>
            </div>
            <div className="w-full bg-pink-100 rounded-full h-1.5 mb-3">
              <div className="bg-pink-400 h-1.5 rounded-full transition-all" style={{ width: tasks.length ? `${(done / tasks.length) * 100}%` : "0%" }} />
            </div>
            <ul className="space-y-2 mb-3">
              {tasks.map(t => (
                <li key={t.id} className="flex items-center gap-2 group">
                  <button onClick={() => toggle(p.category, t.id)}
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors flex items-center justify-center
                      ${t.done ? "bg-pink-400 border-pink-400" : "border-pink-300 hover:border-pink-500"}`}>
                    {t.done && <Check size={10} className="text-white" strokeWidth={3} />}
                  </button>
                  <span className={`flex-1 text-sm ${t.done ? "line-through text-pink-300" : "text-pink-800"}`}>{t.label}</span>
                  <button onClick={() => remove(p.category, t.id)} className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-500"><X size={13} /></button>
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <input value={inputs[p.category] ?? ""} onChange={e => setInputs(prev => ({ ...prev, [p.category]: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && add(p.category)} placeholder="Add a routine..."
                className="flex-1 text-sm border border-pink-200 rounded-xl px-3 py-2 outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300" />
              <button onClick={() => add(p.category)} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-3 flex items-center justify-center"><Plus size={15} /></button>
            </div>
          </div>
        );
      })}

      <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-4">
        <h3 className="font-semibold text-pink-700 text-sm mb-3 flex items-center gap-1.5"><Sparkles size={15} className="text-pink-500" /> Custom Tasks</h3>
        <ul className="space-y-2 mb-3">
          {(categoryTasks["Custom"] ?? []).map(t => (
            <li key={t.id} className="flex items-center gap-2 group">
              <button onClick={() => toggle("Custom", t.id)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors flex items-center justify-center
                  ${t.done ? "bg-pink-400 border-pink-400" : "border-pink-300 hover:border-pink-500"}`}>
                {t.done && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
              <span className={`flex-1 text-sm ${t.done ? "line-through text-pink-300" : "text-pink-800"}`}>{t.label}</span>
              <button onClick={() => remove("Custom", t.id)} className="opacity-0 group-hover:opacity-100 text-pink-300 hover:text-pink-500"><X size={13} /></button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input value={inputs["Custom"] ?? ""} onChange={e => setInputs(prev => ({ ...prev, Custom: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && add("Custom")} placeholder="Add your own task..."
            className="flex-1 text-sm border border-pink-200 rounded-xl px-3 py-2 outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300" />
          <button onClick={() => add("Custom")} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl px-3 flex items-center justify-center"><Plus size={15} /></button>
        </div>
      </div>
    </div>
  );
}
