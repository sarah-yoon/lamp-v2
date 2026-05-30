import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotify";

export const revalidate = 3600;

const ITUNES_RSS = "https://itunes.apple.com/us/rss/topsongs/limit=10/json";

export async function GET() {
  try {
    // 1. Fetch iTunes Top Songs RSS feed
    const rssRes = await fetch(ITUNES_RSS, { next: { revalidate: 3600 } });
    const rssData = await rssRes.json();
    const topEntry = rssData.feed?.entry?.[0];

    const trackName: string = topEntry?.["im:name"]?.label ?? "";
    const artistName: string = topEntry?.["im:artist"]?.label ?? "";
    const itunesArt: string | null = topEntry?.["im:image"]?.[2]?.label ?? null;

    if (!trackName) throw new Error("No track found in iTunes RSS");

    // 2. Search Spotify for higher-res album art
    let art: string | null = itunesArt;
    try {
      const token = await getAccessToken();
      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=track:${encodeURIComponent(trackName)}+artist:${encodeURIComponent(artistName)}&type=track&limit=1`,
        { headers: { Authorization: `Bearer ${token}` }, next: { revalidate: 3600 } }
      );
      const searchData = await searchRes.json();
      const spotifyArt = searchData.tracks?.items?.[0]?.album?.images?.[0]?.url;
      if (spotifyArt) art = spotifyArt;
    } catch {
      // Spotify unavailable — fall back to iTunes art
    }

    // 3. Fetch iTunes preview URL
    const previewRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(`${trackName} ${artistName}`)}&media=music&entity=song&limit=5`,
      { next: { revalidate: 3600 } }
    );
    const previewData = await previewRes.json();
    const previewUrl =
      previewData.results?.find((t: { previewUrl?: string }) => t.previewUrl)?.previewUrl ?? null;

    return NextResponse.json({ name: trackName, artist: artistName, art, previewUrl });
  } catch (e) {
    console.error("[featured-track]", e);
    return NextResponse.json(
      { name: null, artist: null, art: null, previewUrl: null },
      { status: 500 }
    );
  }
}
