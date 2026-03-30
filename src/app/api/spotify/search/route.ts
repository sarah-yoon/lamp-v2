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
  } catch (error: any) {
    console.error("Spotify search error:", error?.message, error?.cause);
    return NextResponse.json(
      { error: "Search is temporarily unavailable. Try again later.", detail: error?.message },
      { status: 503 }
    );
  }
}
