"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface Annotation {
  id: string;
  timestamp_seconds: number;
  body: string;
  user_id: string;
}

interface AudioPlayerProps {
  previewUrl: string | null;
  durationMs: number;
  annotations: Annotation[];
  onTimeUpdate?: (seconds: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ previewUrl, durationMs, annotations, onTimeUpdate }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hoverAnnotation, setHoverAnnotation] = useState<Annotation | null>(null);

  // Preview is 30s max; use real duration for display but cap scrubber to preview length
  const previewDuration = 30;
  const displayDuration = durationMs / 1000;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    const onTime = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [previewUrl, onTimeUpdate]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.volume = 0.8;
      audio.play();
      setPlaying(true);
    }
  }

  const handleScrub = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = pct * previewDuration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [previewUrl]);

  const progress = previewUrl ? (currentTime / previewDuration) * 100 : 0;

  return (
    <div className="w-full flex flex-col gap-3">
      {previewUrl && <audio ref={audioRef} src={previewUrl} />}

      {/* Scrubber */}
      <div className="relative">
        <div
          className="relative h-1.5 bg-surface rounded-full cursor-pointer group"
          onClick={handleScrub}
        >
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 h-full bg-[#6b9e99] rounded-full transition-none"
            style={{ width: `${progress}%` }}
          />

          {/* Annotation dots */}
          {annotations.map((ann) => {
            const pct = (ann.timestamp_seconds / previewDuration) * 100;
            if (pct > 100) return null;
            return (
              <div
                key={ann.id}
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent-gold border-2 border-bg cursor-pointer z-10 hover:scale-125 transition-transform"
                style={{ left: `calc(${pct}% - 5px)` }}
                onMouseEnter={() => setHoverAnnotation(ann)}
                onMouseLeave={() => setHoverAnnotation(null)}
              />
            );
          })}

          {/* Playhead thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#6b9e99] border-2 border-bg shadow pointer-events-none"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>

        {/* Hovered annotation tooltip */}
        {hoverAnnotation && (
          <div
            className="absolute bottom-5 bg-bg border border-surface-border rounded-lg px-3 py-2 text-xs text-text-secondary font-mono max-w-[200px] shadow-lg z-20 pointer-events-none"
            style={{ left: `${(hoverAnnotation.timestamp_seconds / previewDuration) * 100}%`, transform: "translateX(-50%)" }}
          >
            <p className="text-[10px] text-text-tertiary mb-0.5">{formatTime(hoverAnnotation.timestamp_seconds)}</p>
            <p>{hoverAnnotation.body}</p>
          </div>
        )}
      </div>

      {/* Time display */}
      <div className="flex justify-between text-[10px] text-text-tertiary font-mono font-light">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(displayDuration)}</span>
      </div>

      {/* Play / Pause */}
      <div className="flex justify-center">
        <button
          onClick={toggle}
          disabled={!previewUrl}
          aria-label={playing ? "Pause" : "Play"}
          className="w-10 h-10 rounded-full bg-[#6b9e99]/20 hover:bg-[#6b9e99]/30 flex items-center justify-center transition-colors disabled:opacity-40"
        >
          {playing ? (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-[#6b9e99]">
              <rect x="5" y="4" width="3" height="12" rx="1" />
              <rect x="12" y="4" width="3" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="text-[#6b9e99]">
              <path d="M6 4l10 6-10 6V4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
