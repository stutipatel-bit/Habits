"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabaseClient";
import { Leaf, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Try to immediately sign in (works when email confirmation is disabled)
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInError) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setSuccess(true);
        setLoading(false);
      }
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-7 h-7 text-sage-600" />
          </div>
          <h2 className="font-display text-2xl text-charcoal-800 mb-2">Check your email</h2>
          <p className="text-sage-500 font-body text-sm">
            We sent a confirmation link to <strong className="text-charcoal-800">{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/auth/login" className="mt-6 inline-block text-sage-700 font-body text-sm underline underline-offset-2">
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sage-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-sage-700 opacity-40" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-sage-900 opacity-60" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-8 h-8 bg-cream-100 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-sage-700" />
          </div>
          <span className="text-cream-100 font-display text-xl">HabitFlow</span>
        </div>

        <div className="relative z-10">
          <p className="text-sage-300 font-body text-sm uppercase tracking-widest mb-4">
            Start your journey
          </p>
          <h1 className="text-cream-100 font-display text-5xl leading-tight mb-6">
            Every expert was<br />
            once a <em>beginner.</em>
          </h1>
          <p className="text-sage-300 font-body text-base leading-relaxed max-w-sm">
            Your first habit starts today. Join thousands of people building better daily routines with HabitFlow.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-sage-700 bg-opacity-50 rounded-2xl px-4 py-3 w-fit">
            <div className="flex -space-x-2">
              {["🌿", "⚡", "🔥"].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-sage-600 flex items-center justify-center text-sm border-2 border-sage-700">
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sage-200 text-sm font-body">Join 2,400+ habit builders</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-sage-600" />
            </div>
            <span className="text-charcoal-800 font-display text-xl">HabitFlow</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl text-charcoal-800 mb-2">Create your account</h2>
            <p className="text-sage-600 font-body text-sm">Free forever. No credit card needed.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
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

            <div>
              <label className="block text-sm font-body font-medium text-charcoal-800 mb-1.5">
                Password
                <span className="text-sage-400 font-normal ml-1">(min. 6 characters)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-sage-200 bg-white font-body text-sm text-charcoal-800 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sage-700 hover:bg-sage-800 text-cream-50 font-body font-medium text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream-200 border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </>
              ) : (
                <>
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm font-body text-sage-500">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-sage-700 font-medium hover:text-sage-800 underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
