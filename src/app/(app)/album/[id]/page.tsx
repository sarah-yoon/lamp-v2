import Image from "next/image";
import { getAlbum } from "@/lib/spotify";
import { Tracklist } from "@/components/Tracklist";
import { ReviewsSection } from "@/components/ReviewsSection";
import { BookmarkButton } from "@/components/BookmarkButton";
import type { Metadata } from "next";

interface AlbumPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const album = await getAlbum(id);
    return { title: `${album.name} — ${album.artists[0]?.name}` };
  } catch {
    return { title: "Album" };
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { id } = await params;
  let album;

  try {
    album = await getAlbum(id);
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Music data temporarily unavailable.</p>
      </div>
    );
  }

  const imageUrl = album.images[0]?.url || "";
  const artist = album.artists.map((a: { name: string }) => a.name).join(", ");
  const year = album.release_date?.split("-")[0] || "";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Album header */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-8">
        {/* Art with glow */}
        <div className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0 mx-auto md:mx-0">
          <div className="absolute inset-0 rounded-lg blur-2xl opacity-30 bg-gradient-to-br from-accent-gold to-accent-coral" />
          <div className="relative w-full h-full rounded-lg overflow-hidden">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={album.name}
                fill
                sizes="224px"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-end text-center md:text-left">
          <p className="text-xs text-text-tertiary uppercase tracking-wider mb-1">Album</p>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-1">{album.name}</h1>
          <p className="text-text-secondary">{artist}</p>
          <p className="text-sm text-text-tertiary mt-1">{year} · {album.tracks.items.length} tracks</p>
          <div className="mt-3">
            <BookmarkButton
              albumId={id}
              albumData={{ name: album.name, artist, imageUrl }}
              variant="button"
            />
          </div>
        </div>
      </div>

      {/* Tracklist */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Tracklist</h2>
        <Tracklist tracks={album.tracks.items} />
      </div>

      {/* Reviews section (locked/unlocked) */}
      <ReviewsSection
        albumId={id}
        albumName={album.name}
        albumArtist={artist}
        albumImageUrl={imageUrl}
      />
    </div>
  );
}
