import { AlbumCard } from "./AlbumCard";

interface Album {
  id: string;
  name: string;
  artists: { name: string }[];
  images: { url: string }[];
}

interface AlbumRowProps {
  title: string;
  albums: Album[];
  emptyMessage?: string;
}

export function AlbumRow({ title, albums, emptyMessage }: AlbumRowProps) {
  if (albums.length === 0 && !emptyMessage) return null;

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-text-primary mb-4">{title}</h2>
      {albums.length === 0 ? (
        <p className="text-text-secondary text-sm">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              id={album.id}
              name={album.name}
              artist={album.artists.map((a) => a.name).join(", ")}
              imageUrl={album.images[0]?.url || ""}
            />
          ))}
        </div>
      )}
    </section>
  );
}
