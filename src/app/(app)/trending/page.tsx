"use client";

import { useState, useEffect } from "react";
import { AlbumCard } from "@/components/AlbumCard";
import { StarRating } from "@/components/StarRating";

type Period = "week" | "month" | "all";

interface TrendingAlbum {
  spotify_album_id: string;
  album_name: string;
  album_artist: string;
  album_image_url: string | null;
  review_count: number;
  avg_rating: number;
  trending_score: number;
}

const PERIODS: { label: string; value: Period }[] = [
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "All Time", value: "all" },
];

export default function TrendingPage() {
  const [period, setPeriod] = useState<Period>("all");
  const [albums, setAlbums] = useState<TrendingAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 20;

  useEffect(() => {
    setOffset(0);
    fetchTrending(0, period);
  }, [period]);

  async function fetchTrending(newOffset: number, currentPeriod: Period) {
    setLoading(true);
    try {
      const res = await fetch(`/api/trending?period=${currentPeriod}&offset=${newOffset}&limit=${limit}`);
      const data = await res.json();
      if (newOffset === 0) {
        setAlbums(data);
      } else {
        setAlbums((prev) => [...prev, ...data]);
      }
      setHasMore(data.length === limit);
    } catch {
      if (newOffset === 0) setAlbums([]);
    } finally {
      setLoading(false);
    }
  }

  function loadMore() {
    const newOffset = offset + limit;
    setOffset(newOffset);
    fetchTrending(newOffset, period);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Trending</h1>

      <div className="flex gap-2 mb-6">
        {PERIODS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === value
                ? "bg-accent-gold text-bg"
                : "bg-surface border border-surface-border text-text-secondary hover:text-text-primary"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && albums.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square rounded-lg skeleton mb-2" />
              <div className="h-4 w-3/4 skeleton mb-1" />
              <div className="h-3 w-1/2 skeleton" />
            </div>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary mb-2">No trending albums yet. Be the first to review!</p>
          <a href="/search" className="text-accent-gold text-sm hover:opacity-80">
            Search for albums →
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album) => (
              <div key={album.spotify_album_id}>
                <AlbumCard
                  id={album.spotify_album_id}
                  name={album.album_name}
                  artist={album.album_artist}
                  imageUrl={album.album_image_url || ""}
                />
                <div className="flex items-center gap-2 mt-1">
                  <StarRating value={Math.round(album.avg_rating)} readonly size="sm" />
                  <span className="text-xs text-text-tertiary">
                    {album.review_count} {album.review_count === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2.5 bg-surface border border-surface-border rounded-lg text-sm text-text-secondary hover:text-text-primary transition-colors disabled:opacity-50"
              >
                {loading ? "Loading…" : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
