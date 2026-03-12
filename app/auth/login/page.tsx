"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { Leaf, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sage-800 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage-700 opacity-40" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-sage-900 opacity-60" />
        <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-sage-600 opacity-20" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-sage-700" />
          </div>
          <span className="text-cream-100 font-display text-xl">HabitFlow</span>
        </div>

        <div className="relative z-10">
          <p className="text-sage-300 font-body text-sm uppercase tracking-widest mb-4">
            Small steps, big change
          </p>
          <h1 className="text-cream-100 font-display text-5xl leading-tight mb-6">
            Build habits that<br />
            <em>actually</em> stick.
          </h1>
          <p className="text-sage-300 font-body text-base leading-relaxed max-w-sm">
            Track daily rituals, celebrate streaks, and watch your consistency grow — one day at a time.
          </p>
        </div>

        <div className="relative z-10 flex gap-4">
          {["💧 Water", "📚 Reading", "🏋️ Workout"].map((habit) => (
            <div key={habit} className="bg-sage-700 bg-opacity-60 px-3 py-2 rounded-xl text-sage-200 text-sm font-body">
              {habit}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-sage-600" />
            </div>
            <span className="text-charcoal-800 font-display text-xl">HabitFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl text-charcoal-800 mb-2">Welcome back</h2>
            <p className="text-sage-600 font-body text-sm">Sign in to continue your streak.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-body font-medium text-charcoal-800 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-sage-200 bg-white font-body text-sm text-charcoal-800 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-body font-medium text-charcoal-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-sage-200 bg-white font-body text-sm text-charcoal-800 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sage-700 hover:bg-sage-800 text-cream-50 font-body font-medium text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-body text-sage-500">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-sage-700 font-medium hover:text-sage-800 underline underline-offset-2">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
