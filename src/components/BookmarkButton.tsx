"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface BookmarkButtonProps {
  albumId: string;
  albumData: {
    name: string;
    artist: string;
    imageUrl: string;
  };
  initialSaved?: boolean;
  variant?: "icon" | "button";
}

export function BookmarkButton({ albumId, albumData, initialSaved = false, variant = "icon" }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check if album is already saved on mount
  useEffect(() => {
    if (initialSaved || checked) return;
    async function checkSaved() {
      try {
        const res = await fetch(`/api/want-to-listen/${albumId}`);
        if (res.ok) {
          const data = await res.json();
          setSaved(data.saved);
        }
      } catch {
        // Silently fail
      } finally {
        setChecked(true);
      }
    }
    checkSaved();
  }, [albumId, initialSaved, checked]);

  async function toggle() {
    if (loading) return;

    const wasSaved = saved;
    setSaved(!wasSaved);
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
      setSaved(wasSaved);
    } finally {
      setLoading(false);
    }
  }

  const SavedIcon = saved ? BookmarkCheck : Bookmark;

  if (variant === "button") {
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        aria-label={saved ? "Unsave album" : "Save album"}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          saved
            ? "bg-accent-gold/10 border border-accent-gold/30 text-accent-gold"
            : "bg-surface border border-surface-border text-text-secondary hover:text-text-primary"
        }`}
      >
        <SavedIcon className="w-4 h-4" />
        {saved ? "Saved" : "Save to Library"}
      </button>
    );
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
      <SavedIcon className="w-4 h-4" />
    </button>
  );
}
