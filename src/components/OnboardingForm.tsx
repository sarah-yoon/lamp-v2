"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GenreChips from "@/components/GenreChips";

const RESERVED = [
  "edit", "settings", "admin", "trending", "explore",
  "login", "signup", "api", "saved", "profile",
];

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export default function OnboardingForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateUsername = (value: string): string | null => {
    if (!USERNAME_REGEX.test(value)) {
      return "Username must be 3–30 characters and only contain letters, numbers, or underscores.";
    }
    if (RESERVED.includes(value.toLowerCase())) {
      return "That username is reserved. Please choose another.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Not authenticated. Please sign in again.");
      }

      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        username,
        favorite_genres: genres,
      });

      if (insertError) {
        if (
          insertError.code === "23505" ||
          insertError.message?.toLowerCase().includes("duplicate") ||
          insertError.message?.toLowerCase().includes("unique")
        ) {
          setError("This username is taken. Try another.");
        } else {
          throw insertError;
        }
        return;
      }

      router.push("/explore");
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
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">
          <span className="font-display">LAMP</span><span className="text-accent-coral">.</span>
        </h1>
        <p className="text-text-secondary text-sm mt-2">Set up your profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1.5">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="your_username"
            minLength={3}
            maxLength={30}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold/50 transition-colors"
          />
          <p className="text-text-tertiary text-xs mt-1.5">
            3–30 characters. Letters, numbers, and underscores only.
          </p>
        </div>

        {/* Genre Selection */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Favorite genres{" "}
            <span className="text-text-tertiary font-normal">(optional)</span>
          </label>
          <GenreChips selected={genres} onChange={setGenres} />
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
          {loading ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
