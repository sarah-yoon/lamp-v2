"use client";

interface ReviewsSectionProps {
  albumId: string;
  albumName: string;
  albumArtist: string;
  albumImageUrl: string;
}

export function ReviewsSection({ albumId }: ReviewsSectionProps) {
  return (
    <div className="border border-surface-border rounded-lg p-6 text-center">
      <p className="text-text-secondary text-sm">Reviews coming soon</p>
    </div>
  );
}
