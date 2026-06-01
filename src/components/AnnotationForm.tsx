"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface AnnotationFormProps {
  trackId: string;
  getCurrentTime: () => number;
  onAnnotationAdded: (annotation: { id: string; timestamp_seconds: number; body: string; user_id: string }) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AnnotationForm({ trackId, getCurrentTime, onAnnotationAdded }: AnnotationFormProps) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSubmit = useCallback(async () => {
    const timestamp = getCurrentTime();
    const trimmed = body.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not logged in"); setSubmitting(false); return; }

    const { data, error: err } = await supabase
      .from("annotations")
      .insert({ user_id: user.id, spotify_track_id: trackId, timestamp_seconds: timestamp, body: trimmed })
      .select()
      .single();

    if (err) {
      setError("Failed to save annotation");
    } else {
      onAnnotationAdded(data);
      setBody("");
    }

    setSubmitting(false);
  }, [body, trackId, getCurrentTime, supabase, onAnnotationAdded]);

  const timestamp = getCurrentTime();

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="add an annotation..."
          maxLength={500}
          rows={3}
          className="w-full px-4 py-3 pb-6 rounded-2xl bg-[rgba(37,171,102,0.08)] text-sm text-text-primary font-mono font-light placeholder:text-text-tertiary resize-none focus:outline-none focus:ring-1 focus:ring-[#6b9e99]/40"
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-text-tertiary font-mono font-light">
          {formatTime(timestamp)}
        </span>
      </div>

      {error && <p className="text-xs text-accent-coral font-mono">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !body.trim()}
          className="btn-join px-6 py-2 font-sans font-bold text-sm text-white disabled:opacity-40"
        >
          {submitting ? "saving..." : "enter"}
        </button>
      </div>
    </div>
  );
}
