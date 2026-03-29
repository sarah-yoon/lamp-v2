import { NextRequest, NextResponse } from "next/server";
import { searchAlbums } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  try {
    const albums = await searchAlbums(q.trim());
    return NextResponse.json(albums);
  } catch (error) {
    console.error("Spotify search error:", error);
    return NextResponse.json(
      { error: "Search is temporarily unavailable. Try again later." },
      { status: 503 }
    );
  }
}
