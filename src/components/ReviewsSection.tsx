"use client";

import { useState, useEffect, useCallback } from "react";
import { Lock } from "lucide-react";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";
import type { ReviewsResponse } from "@/types";

interface ReviewsSectionProps {
  albumId: string;
  albumName: string;
  albumArtist: string;
  albumImageUrl: string;
}

export function ReviewsSection({ albumId, albumName, albumArtist, albumImageUrl }: ReviewsSectionProps) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [unlockAnimation, setUnlockAnimation] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/album/${albumId}`);
      if (res.ok) setData(await res.json());
    } catch {} finally {
      setLoading(false);
    }
  }, [albumId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function handleSubmit(rating: number, reviewText: string) {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spotify_album_id: albumId,
        album_name: albumName,
        album_artist: albumArtist,
        album_image_url: albumImageUrl,
        rating,
        review_text: reviewText || null,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Failed to save review");
    }

    // Trigger unlock animation
    setUnlockAnimation(true);
    await fetchReviews();
  }

  async function handleEdit(rating: number, reviewText: string) {
    if (!data?.userReview) return;
    const res = await fetch(`/api/reviews/${data.userReview.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, review_text: reviewText || null }),
    });
    if (!res.ok) throw new Error("Failed to update review");
    setEditing(false);
    await fetchReviews();
  }

  async function handleDelete() {
    if (!data?.userReview || !confirm("Delete your review? The album will re-lock.")) return;
    await fetch(`/api/reviews/${data.userReview.id}`, { method: "DELETE" });
    setUnlockAnimation(false);
    await fetchReviews();
  }

  if (loading) {
    return <div className="skeleton h-40 w-full" />;
  }

  // LOCKED STATE
  if (data?.locked) {
    return (
      <div className="border border-surface-border rounded-lg p-6">
        <div className="text-center mb-6">
          <div className="mb-2 text-text-tertiary">
            <Lock className="w-6 h-6 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Rate this album to unlock reviews</h3>
          <p className="text-sm text-text-secondary">
            {data.count > 0
              ? `${data.count} review${data.count !== 1 ? "s" : ""} waiting to be unlocked`
              : "Be the first to review this album"}
          </p>
        </div>
        <ReviewForm onSubmit={handleSubmit} />
      </div>
    );
  }

  // UNLOCKED STATE
  return (
    <div className={`space-y-4 ${unlockAnimation ? "animate-in fade-in duration-500" : ""}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Reviews ({data?.count || 0})
        </h2>
      </div>

      {/* User's review or edit form */}
      {editing && data?.userReview ? (
        <div className="border border-accent-gold/30 rounded-lg p-4 bg-accent-gold/5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-text-primary">Edit your review</span>
            <button onClick={() => setEditing(false)} className="text-xs text-text-tertiary hover:text-text-primary">Cancel</button>
          </div>
          <ReviewForm
            onSubmit={handleEdit}
            initialRating={data.userReview.rating}
            initialText={data.userReview.review_text || ""}
            isEdit
          />
        </div>
      ) : data?.userReview ? (
        <ReviewCard
          username="You"
          rating={data.userReview.rating}
          reviewText={data.userReview.review_text}
          createdAt={data.userReview.created_at}
          isOwn
          onEdit={() => setEditing(true)}
          onDelete={handleDelete}
        />
      ) : null}

      {/* Other reviews */}
      {data?.reviews
        ?.filter(r => r.id !== data.userReview?.id)
        .map(review => (
          <ReviewCard
            key={review.id}
            username={review.username}
            rating={review.rating}
            reviewText={review.review_text}
            createdAt={review.created_at}
          />
        ))}
    </div>
  );
}
