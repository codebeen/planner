"use client";
import { Flower2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdf2f8] px-4">
            {/* Decorative blobs */}
            <div className="fixed top-0 left-0 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-96 h-96 bg-rose-200 rounded-full blur-3xl opacity-30 translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="relative w-full max-w-lg">
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-3">
                    <Flower2 size={28} className="text-pink-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-pink-700">{title}</h1>
                    <p className="text-sm text-pink-400 mt-1">{subtitle}</p>
                </div>

                {children}

                </div>
            </div>
            </div>
    )
}