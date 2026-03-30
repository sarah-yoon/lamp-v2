"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AvatarUpload } from "@/components/AvatarUpload";
import GenreChips from "@/components/GenreChips";

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setUsername(profile.username);
        setBio(profile.bio || "");
        setGenres(profile.favorite_genres || []);
        setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio, favorite_genres: genres }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="skeleton h-8 w-48 mb-6" />
        <div className="skeleton h-24 w-24 rounded-full mx-auto mb-6" />
        <div className="skeleton h-32 w-full mb-4" />
        <div className="skeleton h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Edit Profile</h1>

      <div className="mb-8">
        <AvatarUpload
          currentUrl={avatarUrl}
          username={username}
          onUpload={(url) => setAvatarUrl(url)}
        />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-text-secondary mb-1.5">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
            rows={3}
            placeholder="Tell people about yourself..."
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold/50 transition-colors resize-none"
          />
          <p className="text-text-tertiary text-xs mt-1 text-right">
            {bio.length} / 300
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            Favorite Genres
          </label>
          <GenreChips selected={genres} onChange={setGenres} />
        </div>

        {error && (
          <div className="bg-accent-coral/10 border border-accent-coral/20 rounded-lg px-4 py-3">
            <p className="text-accent-coral text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-lg px-4 py-3">
            <p className="text-accent-gold text-sm">Profile updated!</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-accent-gold text-bg font-semibold rounded-lg px-4 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/profile/${username}`)}
            className="px-4 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
