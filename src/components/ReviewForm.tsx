"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";

interface ReviewFormProps {
  onSubmit: (rating: number, reviewText: string) => Promise<void>;
  initialRating?: number;
  initialText?: string;
  isEdit?: boolean;
}

export function ReviewForm({ onSubmit, initialRating = 0, initialText = "", isEdit = false }: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [text, setText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating"); return; }
    setError("");
    setLoading(true);
    try {
      await onSubmit(rating, text.trim());
    } catch (err: any) {
      setError(err.message || "Failed to save review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <p className="text-sm text-text-secondary mb-2">Your rating</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review (optional)..."
          maxLength={2000}
          rows={4}
          className="w-full bg-surface border border-surface-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-gold/50 transition-colors resize-none"
        />
        <p className="text-xs text-text-tertiary mt-1 text-right">{text.length}/2000</p>
      </div>
      {error && (
        <p className="text-sm text-accent-coral">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="px-6 py-2.5 bg-accent-gold text-bg font-semibold rounded-lg hover:bg-accent-gold/90 disabled:opacity-50 transition-colors text-sm"
      >
        {loading ? "Saving..." : isEdit ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
}
