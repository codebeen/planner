"use client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import Calendar from "../components/Calendar";
import Notes from "../components/Notes";
import FoodLog from "../components/FoodLog";
import TasksList from "../components/TasksList";

export default function Home() {
    const [tab, setTab] = useState("dashboard");


    return (
        <div className="min-h-screen flex flex-col bg-[#fdf2f8]">
            <Navbar tab={tab} setTab={setTab} />
            <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
                {tab === "dashboard" && (
                    <Dashboard
                        onNavigate={setTab}
                    />
                )}
                {tab === "calendar" && (
                    <Calendar />
                )}
                {tab === "tasks" && (
                    <TasksList
                        onNavigate={setTab}
                    />
                )}
                {tab === "notes" && <Notes />}
                {tab === "food" && <FoodLog />}
            </main>

            <Footer />
        </div>
    );
}
