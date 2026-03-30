import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_GENRES = [
  "Rock", "Pop", "Hip-Hop", "R&B", "Jazz", "Classical", "Electronic",
  "Country", "Folk", "Metal", "Punk", "Indie", "Blues", "Soul",
  "Reggae", "Latin", "K-Pop", "Alternative",
];

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, any> = {};

  if (body.bio !== undefined) {
    if (typeof body.bio !== "string" || body.bio.length > 300) {
      return NextResponse.json({ error: "Bio must be 300 characters or less" }, { status: 400 });
    }
    updates.bio = body.bio.trim();
  }

  if (body.favorite_genres !== undefined) {
    if (!Array.isArray(body.favorite_genres) || !body.favorite_genres.every((g: any) => ALLOWED_GENRES.includes(g))) {
      return NextResponse.json({ error: "Invalid genres" }, { status: 400 });
    }
    updates.favorite_genres = body.favorite_genres;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json(data);
}
