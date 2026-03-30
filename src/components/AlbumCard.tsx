import Image from "next/image";
import Link from "next/link";
import { Music } from "lucide-react";
import { BookmarkButton } from "./BookmarkButton";

interface AlbumCardProps {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  showBookmark?: boolean;
  initialSaved?: boolean;
}

export function AlbumCard({ id, name, artist, imageUrl, showBookmark = false, initialSaved = false }: AlbumCardProps) {
  return (
    <Link href={`/album/${id}`} className="group block">
      <div className="aspect-square rounded-lg overflow-hidden bg-surface mb-2 relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary">
            <Music className="w-8 h-8" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        {showBookmark && (
          <div className="absolute top-2 right-2">
            <BookmarkButton
              albumId={id}
              albumData={{ name, artist, imageUrl }}
              initialSaved={initialSaved}
            />
          </div>
        )}
      </div>
      <p className="text-sm font-medium text-text-primary truncate">{name}</p>
      <p className="text-xs text-text-secondary truncate">{artist}</p>
    </Link>
  );
}
