import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 20;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const supabase = await createClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  const { data: ratingData } = await supabase
    .from("reviews")
    .select("rating")
    .eq("user_id", profile.id);

  const ratings = (ratingData || []).map((r: any) => r.rating);
  const avgRating = ratings.length > 0
    ? Math.round((ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) * 10) / 10
    : 0;

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, spotify_album_id, album_name, album_artist, album_image_url, rating, review_text, created_at")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  const total = totalReviews || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return NextResponse.json({
    profile,
    stats: { totalReviews: total, avgRating },
    reviews: reviews || [],
    pagination: { page, totalPages, totalReviews: total },
  });
}
