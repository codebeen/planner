"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flower2, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/src/components/layouts/AuthLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    // Simulate auth — replace with real auth logic
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    router.push("/");
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start planning your day" >
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="text-xs font-semibold text-pink-600 mb-1.5 block">Full Name</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300" />
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-pink-200 rounded-xl outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 text-pink-800"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-pink-600 mb-1.5 block">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-pink-200 rounded-xl outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 text-pink-800"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-xs font-semibold text-pink-600 mb-1.5 block">Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-pink-200 rounded-xl outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 text-pink-800"
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-semibold text-pink-600 mb-1.5 block">Confirm Password</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-300" />
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-pink-200 rounded-xl outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 text-pink-800"
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500">
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirm && password !== confirm && (
            <p className="text-xs text-rose-400 mt-1">Passwords do not match</p>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="text-center text-xs text-pink-400 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-pink-600 font-semibold hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
