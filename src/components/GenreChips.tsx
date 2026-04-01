"use client";

const GENRES = [
  "Rock", "Pop", "Hip-Hop", "R&B", "Jazz", "Classical", "Electronic",
  "Country", "Folk", "Metal", "Punk", "Indie", "Blues", "Soul",
  "Reggae", "Latin", "K-Pop", "Alternative",
];

interface GenreChipsProps {
  selected: string[];
  onChange: (genres: string[]) => void;
}

export default function GenreChips({ selected, onChange }: GenreChipsProps) {
  const toggle = (genre: string) => {
    if (selected.includes(genre)) {
      onChange(selected.filter((g) => g !== genre));
    } else {
      onChange([...selected, genre]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {GENRES.map((genre) => {
        const isSelected = selected.includes(genre);
        return (
          <button
            key={genre}
            type="button"
            onClick={() => toggle(genre)}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              isSelected
                ? "bg-accent-gold text-bg font-semibold border border-accent-gold"
                : "glass-pill text-text-secondary hover:text-text-primary"
            }`}
          >
            {genre}
          </button>
        );
      })}
    </div>
  );
}
