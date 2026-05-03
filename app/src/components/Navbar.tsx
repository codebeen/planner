"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    CalendarDays,
    CheckSquare,
    Flower2,
    LayoutDashboard,
    ListTodo,
    LogOut,
    NotebookPen,
    Settings,
    UserCircle2,
    UtensilsCrossed,
} from "lucide-react";
import QuoteBar from "./QuoteBar";
import { logout } from "../app/(auth)/actions";

export const TABS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
    { id: "tasks", label: "Tasks", icon: ListTodo },
    { id: "notes", label: "Notes", icon: NotebookPen },
    { id: "food", label: "Food Log", icon: UtensilsCrossed },
];

interface NavbarProps {
    tab: string;
    setTab: (tab: string) => void;
}

export default function Navbar({ tab, setTab }: NavbarProps) {
    const [avatarOpen, setAvatarOpen] = useState(false);
    const avatarRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    return (
        <header className="bg-white border-b border-pink-100 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Flower2 className="text-pink-400" size={22} />
                    <div>
                        <h1 className="text-xl font-bold text-pink-600">
                            Planner
                        </h1>
                        <p className="text-xs text-pink-400">
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
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
                            onClick={() => setAvatarOpen((v) => !v)}
                            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-50 transition-colors cursor-pointer"
                        >
                            <UserCircle2 size={28} className="text-pink-400" />
                        </button>

                        {avatarOpen && (
                            <div className="absolute right-0 top-11 w-44 bg-white rounded-2xl shadow-lg border border-pink-100 py-1.5 z-50">
                                <div className="px-4 py-2 border-b border-pink-50">
                                    <p className="text-xs font-semibold text-pink-700">
                                        My Account
                                    </p>
                                </div>
                                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-pink-600 hover:bg-pink-50 transition-colors cursor-pointer">
                                    <Settings size={14} /> Settings
                                </button>
                                <button
                                    onClick={async () => {
                                        await logout();
                                    }}
                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                >
                                    <LogOut size={14} /> Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <QuoteBar />

            <nav className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto scrollbar-hide">
                {TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer
              ${
                  tab === t.id
                      ? "border-pink-500 text-pink-600"
                      : "border-transparent text-pink-400 hover:text-pink-600 hover:border-pink-200"
              }`}
                    >
                        <t.icon size={15} />
                        {t.label}
                    </button>
                ))}
            </nav>
        </header>
    );
}
