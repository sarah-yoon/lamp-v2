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
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {albums.map((album) => (
            <div key={album.id} className="flex-shrink-0 w-36">
              <AlbumCard
                id={album.id}
                name={album.name}
                artist={album.artists.map((a) => a.name).join(", ")}
                imageUrl={album.images[0]?.url || ""}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
