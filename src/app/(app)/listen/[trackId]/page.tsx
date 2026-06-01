import { getTrack } from "@/lib/spotify";
import { createClient } from "@/lib/supabase/server";
import ListenClient from "./ListenClient";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ trackId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trackId } = await params;
  try {
    const track = await getTrack(trackId);
    return { title: `${track.name} — ${track.artists[0]?.name}` };
  } catch {
    return { title: "Listen" };
  }
}

async function getItunesPreview(query: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=5`,
      { next: { revalidate: 86400 } }
    );
    const data = await res.json();
    const track = data.results?.find((t: { previewUrl?: string }) => t.previewUrl);
    return track?.previewUrl ?? null;
  } catch {
    return null;
  }
}

export default async function ListenPage({ params }: Props) {
  const { trackId } = await params;

  let track;
  try {
    track = await getTrack(trackId);
  } catch {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary font-mono font-light">track unavailable.</p>
      </div>
    );
  }

  const trackName: string = track.name;
  const artistName: string = track.artists?.[0]?.name ?? "";
  const albumName: string = track.album?.name ?? "";
  const trackNumber: number = track.track_number ?? 0;
  const albumArt: string | null = track.album?.images?.[0]?.url ?? null;
  const durationMs: number = track.duration_ms ?? 0;

  const previewUrl = await getItunesPreview(`${trackName} ${artistName}`);

  // Fetch annotations
  const supabase = await createClient();
  const { data: annotations } = await supabase
    .from("annotations")
    .select("id, timestamp_seconds, body, user_id")
    .eq("spotify_track_id", trackId)
    .order("timestamp_seconds", { ascending: true });

  return (
    <ListenClient
      trackId={trackId}
      trackName={trackName}
      artistName={artistName}
      albumName={albumName}
      trackNumber={trackNumber}
      albumArt={albumArt}
      previewUrl={previewUrl}
      durationMs={durationMs}
      initialAnnotations={annotations ?? []}
    />
  );
}
