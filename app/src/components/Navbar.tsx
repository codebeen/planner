import { CalendarDays, CheckSquare, Flower2, LayoutDashboard, NotebookPen, UtensilsCrossed } from "lucide-react";
import QuoteBar from "./QuoteBar";
import { useState } from "react";


const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar",  label: "Calendar",  icon: CalendarDays },
  { id: "tasks",     label: "Tasks",     icon: CheckSquare },
  { id: "notes",     label: "Notes",     icon: NotebookPen },
  { id: "food",      label: "Food Log",  icon: UtensilsCrossed },
];

export default function Navbar() {
    const [tab, setTab] = useState("dashboard");
    
    return (
        <header className="bg-white border-b border-pink-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
                <div className="flex items-center gap-2">
                    <Flower2 className="text-pink-400" size={22} />
                    <div>
                    <h1 className="text-xl font-bold text-pink-600">My Planner</h1>
                    <p className="text-xs text-pink-400">
                        {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    </div>
                </div>
                {/* Avatar */}
                <div>
                </div>
            </div>
            <QuoteBar />
            <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                    ${tab === t.id ? "border-pink-500 text-pink-600" : "border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-200"}`}>
                <t.icon size={15} />{t.label}
                </button>
            ))}
            </nav>
        </header>
    )
}