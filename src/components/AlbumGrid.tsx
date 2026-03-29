import { AlbumCard } from "./AlbumCard";

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
}

export function AlbumGrid({ albums }: { albums: Album[] }) {
  if (albums.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          id={album.id}
          name={album.name}
          artist={album.artists.map(a => a.name).join(", ")}
          imageUrl={album.images[0]?.url || ""}
        />
      ))}
    </div>
  );
}
