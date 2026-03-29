import Image from "next/image";
import Link from "next/link";

interface AlbumCardProps {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
}

export function AlbumCard({ id, name, artist, imageUrl }: AlbumCardProps) {
  return (
    <Link href={`/album/${id}`} className="group">
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
          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-2xl">🎵</div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>
      <p className="text-sm font-medium text-text-primary truncate">{name}</p>
      <p className="text-xs text-text-secondary truncate">{artist}</p>
    </Link>
  );
}
