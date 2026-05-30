"use client";

import { useRef, useState, useEffect } from "react";

interface NowPlayingProps {
  albumName: string | null;
  artist: string | null;
  previewUrl: string | null;
}

export default function NowPlaying({ albumName, artist, previewUrl }: NowPlayingProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;
    audio.volume = 0.15;
    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [previewUrl]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.15;
      audio.play();
      setPlaying(true);
    }
  }

  const label = albumName && artist ? `${albumName} • ${artist}` : albumName ?? "—";

  return (
    <div className="flex flex-col items-center gap-1 mt-4 pt-4 w-full">
      {previewUrl && <audio ref={audioRef} src={previewUrl} loop />}

      <p className="text-[10px] text-text-tertiary font-mono font-light tracking-wide uppercase">
        currently playing
      </p>

      {/* Scrolling ticker */}
      <div className="w-full overflow-hidden">
        <div className="ticker-track font-mono font-light text-xs text-text-secondary whitespace-nowrap inline-flex">
          <span className="pr-16">{label}</span>
          <span className="pr-16">{label}</span>
        </div>
      </div>

      {previewUrl && (
        <button
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="mt-1 text-text-tertiary hover:text-text-secondary transition-colors"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <rect x="5" y="4" width="3" height="12" rx="1" />
              <rect x="12" y="4" width="3" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
