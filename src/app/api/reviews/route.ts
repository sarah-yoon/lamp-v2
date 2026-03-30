import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { spotify_album_id, album_name, album_artist, album_image_url, rating, review_text } = body;

  // Validate
  if (!spotify_album_id || !album_name || !album_artist) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }
  if (review_text && review_text.length > 2000) {
    return NextResponse.json({ error: "Review too long (max 2000 chars)" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      user_id: user.id,
      spotify_album_id,
      album_name,
      album_artist,
      album_image_url: album_image_url || null,
      rating,
      review_text: review_text?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Review insert error:", error.code, error.message, error.details);
    if (error.code === "23505") {
      return NextResponse.json({ error: "You've already reviewed this album" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
