"use client";

import { useState, useRef, useCallback } from "react";
import SpinningCD from "@/components/SpinningCD";
import AudioPlayer from "@/components/AudioPlayer";
import AnnotationForm from "@/components/AnnotationForm";

interface Annotation {
  id: string;
  timestamp_seconds: number;
  body: string;
  user_id: string;
}

interface ListenClientProps {
  trackId: string;
  trackName: string;
  artistName: string;
  albumName: string;
  trackNumber: number;
  albumArt: string | null;
  previewUrl: string | null;
  durationMs: number;
  initialAnnotations: Annotation[];
}

export default function ListenClient({
  trackId, trackName, artistName, albumName, trackNumber,
  albumArt, previewUrl, durationMs, initialAnnotations,
}: ListenClientProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
  const currentTimeRef = useRef(0);

  const handleTimeUpdate = useCallback((seconds: number) => {
    currentTimeRef.current = seconds;
  }, []);

  const getCurrentTime = useCallback(() => currentTimeRef.current, []);

  const handleAnnotationAdded = useCallback((ann: Annotation) => {
    setAnnotations((prev) => [...prev, ann].sort((a, b) => a.timestamp_seconds - b.timestamp_seconds));
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 max-w-lg mx-auto py-8">
      {/* Spinning CD */}
      <SpinningCD albumArt={albumArt} albumName={trackName} size={260} />

      {/* Track info */}
      <div className="text-center">
        <p className="text-base font-sans font-medium text-text-primary">{trackName}</p>
        <p className="text-sm text-text-tertiary font-mono font-light">{albumName} • {artistName}</p>
        <p className="text-xs text-text-tertiary font-mono font-light">track #{trackNumber}</p>
      </div>

      {/* Audio player + scrubber */}
      <div className="w-full">
        <AudioPlayer
          previewUrl={previewUrl}
          durationMs={durationMs}
          annotations={annotations}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>

      {/* Annotation form */}
      <div className="w-full">
        <AnnotationForm
          trackId={trackId}
          getCurrentTime={getCurrentTime}
          onAnnotationAdded={handleAnnotationAdded}
        />
      </div>
    </div>
  );
}
