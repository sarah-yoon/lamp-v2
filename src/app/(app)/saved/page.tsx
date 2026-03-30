"use client";

import { useState, useEffect } from "react";
import { AlbumCard } from "@/components/AlbumCard";
import Link from "next/link";

interface SavedAlbum {
  id: string;
  spotify_album_id: string;
  album_name: string;
  album_artist: string;
  album_image_url: string | null;
  created_at: string;
}

export default function SavedPage() {
  const [albums, setAlbums] = useState<SavedAlbum[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await fetch("/api/want-to-listen");
        if (res.ok) {
          const data = await res.json();
          setAlbums(data);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchSaved();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Saved</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square rounded-lg skeleton mb-2" />
              <div className="h-4 w-3/4 skeleton mb-1" />
              <div className="h-3 w-1/2 skeleton" />
            </div>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary mb-2">
            No saved albums yet. Browse the explore page to find something to listen to.
          </p>
          <Link href="/explore" className="text-accent-gold text-sm hover:opacity-80">
            Explore albums →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              id={album.spotify_album_id}
              name={album.album_name}
              artist={album.album_artist}
              imageUrl={album.album_image_url || ""}
              showBookmark
              initialSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
