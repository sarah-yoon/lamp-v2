import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const { albumId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if user has reviewed this album
  const { data: userReview } = await supabase
    .from("reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("spotify_album_id", albumId)
    .single();

  // Get total review count
  const { count } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("spotify_album_id", albumId);

  // If user hasn't reviewed, return locked
  if (!userReview) {
    return NextResponse.json({ locked: true, count: count || 0 });
  }

  // User has reviewed — fetch all reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*")
    .eq("spotify_album_id", albumId)
    .order("created_at", { ascending: false });

  // Fetch usernames for all review authors
  const userIds = [...new Set((reviews || []).map((r: any) => r.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username")
    .in("id", userIds);

  const usernameMap = new Map<string, string>();
  (profiles || []).forEach((p: any) => usernameMap.set(p.id, p.username));

  const formattedReviews = (reviews || []).map((r: any) => ({
    ...r,
    username: usernameMap.get(r.user_id) || "unknown",
  }));

  return NextResponse.json({
    locked: false,
    count: count || 0,
    reviews: formattedReviews,
    userReview,
  });
}
