interface Track {
  name: string;
  duration_ms: number;
  track_number: number;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function Tracklist({ tracks }: { tracks: Track[] }) {
  return (
    <div className="space-y-1">
      {tracks.map((track) => (
        <div
          key={track.track_number}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface transition-colors"
        >
          <span className="text-xs text-text-tertiary w-6 text-right font-mono font-light">{track.track_number}</span>
          <span className="text-sm text-text-primary flex-1 truncate">{track.name}</span>
          <span className="text-xs text-text-tertiary font-mono font-light">{formatDuration(track.duration_ms)}</span>
        </div>
      ))}
    </div>
  );
}
