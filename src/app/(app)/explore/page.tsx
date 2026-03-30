import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { searchByYear, searchByGenre } from "@/lib/spotify";
import { createClient } from "@/lib/supabase/server";
import { AlbumRow } from "@/components/AlbumRow";

export const metadata: Metadata = {
  title: "Explore",
};

function getAlbumOfTheDayIndex(albums: any[]): number {
  if (albums.length === 0) return 0;
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const hash = dayOfYear + now.getFullYear() * 366;
  return hash % albums.length;
}

export default async function ExplorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userGenres: string[] = [];
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("favorite_genres")
      .eq("id", user.id)
      .single();
    userGenres = profile?.favorite_genres || [];
  }

  const [recentAlbumsResult, spotifyAlbumsResult, ...genreResults] = await Promise.allSettled([
    supabase
      .from("reviews")
      .select("spotify_album_id, album_name, album_artist, album_image_url")
      .order("created_at", { ascending: false })
      .limit(20),
    searchByYear(new Date().getFullYear()),
    ...userGenres.slice(0, 4).map((genre) => searchByGenre(genre)),
  ]);

  let recentAlbums: any[] = [];
  if (recentAlbumsResult.status === "fulfilled" && recentAlbumsResult.value.data) {
    const seen = new Set<string>();
    for (const r of recentAlbumsResult.value.data) {
      if (!seen.has(r.spotify_album_id)) {
        seen.add(r.spotify_album_id);
        recentAlbums.push({
          id: r.spotify_album_id,
          name: r.album_name,
          artists: [{ name: r.album_artist }],
          images: r.album_image_url ? [{ url: r.album_image_url }] : [],
        });
      }
      if (recentAlbums.length >= 10) break;
    }
  }

  let spotifyAlbums: any[] = [];
  if (spotifyAlbumsResult.status === "fulfilled") {
    spotifyAlbums = spotifyAlbumsResult.value;
  }

  const albumOfTheDay = spotifyAlbums.length > 0
    ? spotifyAlbums[getAlbumOfTheDayIndex(spotifyAlbums)]
    : null;

  const genreSections: { genre: string; albums: any[] }[] = [];
  userGenres.slice(0, 4).forEach((genre, i) => {
    const result = genreResults[i];
    if (result?.status === "fulfilled" && result.value?.length > 0) {
      genreSections.push({ genre, albums: result.value });
    }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Explore</h1>

      {albumOfTheDay && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Album of the Day</h2>
          <Link href={`/album/${albumOfTheDay.id}`} className="block">
            <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-surface border border-surface-border hover:border-accent-gold/30 transition-colors">
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 mx-auto sm:mx-0">
                <div className="absolute inset-0 rounded-lg blur-xl opacity-30 bg-gradient-to-br from-accent-gold to-accent-coral" />
                {albumOfTheDay.images?.[0]?.url && (
                  <Image
                    src={albumOfTheDay.images[0].url}
                    alt={albumOfTheDay.name}
                    fill
                    sizes="160px"
                    className="object-cover rounded-lg relative"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center text-center sm:text-left">
                <p className="text-xs text-accent-gold uppercase tracking-wider mb-1">Album of the Day</p>
                <p className="text-xl font-bold text-text-primary">{albumOfTheDay.name}</p>
                <p className="text-text-secondary">
                  {albumOfTheDay.artists?.map((a: any) => a.name).join(", ")}
                </p>
                <p className="text-sm text-text-tertiary mt-1">
                  {albumOfTheDay.release_date?.split("-")[0]}
                </p>
                <span className="inline-block mt-3 text-sm text-accent-gold font-medium">
                  Listen &amp; Review →
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {genreSections.map(({ genre, albums }) => (
        <AlbumRow key={genre} title={genre} albums={albums} />
      ))}

      <AlbumRow
        title="Recently Reviewed on LAMP"
        albums={recentAlbums}
        emptyMessage="Be the first to review an album!"
      />
    </div>
  );
}
