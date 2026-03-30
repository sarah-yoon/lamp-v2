"use client";

import { useState } from "react";

interface BookmarkButtonProps {
  albumId: string;
  albumData: {
    name: string;
    artist: string;
    imageUrl: string;
  };
  initialSaved?: boolean;
}

export function BookmarkButton({ albumId, albumData, initialSaved = false }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;

    const wasSaved = saved;
    setSaved(!wasSaved); // Optimistic
    setLoading(true);

    try {
      if (wasSaved) {
        const res = await fetch(`/api/want-to-listen/${albumId}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
      } else {
        const res = await fetch("/api/want-to-listen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spotify_album_id: albumId,
            album_name: albumData.name,
            album_artist: albumData.artist,
            album_image_url: albumData.imageUrl,
          }),
        });
        if (!res.ok) throw new Error();
      }
    } catch {
      setSaved(wasSaved); // Revert on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-label={saved ? "Unsave album" : "Save album"}
      className={`p-1.5 rounded-full transition-all ${
        saved
          ? "text-accent-gold bg-bg/80"
          : "text-text-tertiary hover:text-text-primary bg-bg/60"
      }`}
    >
      {saved ? "🔖" : "🔖"}
    </button>
  );
}
