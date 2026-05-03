"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import AuthLayout from "@/src/components/layouts/AuthLayout";
import { login } from "../actions";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);
    
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to plan your day" >
      <form onSubmit={handleSubmit} className="space-y-4">
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
              required
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
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 text-sm border border-pink-200 rounded-xl outline-none focus:border-pink-400 bg-pink-50 placeholder-pink-300 text-pink-800"
              required
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-300 hover:text-pink-500">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-xs text-pink-400 hover:text-pink-600">Forgot password?</button>
        </div>

        {error && <p className="text-xs text-rose-500 text-center">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-pink-500 hover:bg-pink-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-center text-xs text-pink-400 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-pink-600 font-semibold hover:underline">Sign up</Link>
      </p>
    </AuthLayout>
  );
}
