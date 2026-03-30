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

  const { data } = await supabase
    .from("want_to_listen")
    .select("id")
    .eq("user_id", user.id)
    .eq("spotify_album_id", albumId)
    .single();

  return NextResponse.json({ saved: !!data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ albumId: string }> }
) {
  const { albumId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("want_to_listen")
    .delete()
    .eq("user_id", user.id)
    .eq("spotify_album_id", albumId);

  if (error) {
    return NextResponse.json({ error: "Failed to remove album" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
