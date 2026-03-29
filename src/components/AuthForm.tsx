"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push("/onboarding");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check if user has a profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (profile) {
          router.push("/explore");
        } else {
          router.push("/onboarding");
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          LAMP<span className="text-accent-coral">.</span>
        </h1>
        <p className="text-text-secondary text-sm mt-2">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-accent-coral/10 border border-accent-coral/20 rounded-lg px-4 py-3">
            <p className="text-accent-coral text-sm">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent-gold text-bg font-semibold rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? mode === "login" ? "Signing in…" : "Creating account…"
            : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      {/* Switch link */}
      <p className="text-center text-sm text-text-secondary mt-6">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-accent-gold hover:opacity-80 transition-opacity font-medium">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent-gold hover:opacity-80 transition-opacity font-medium">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
