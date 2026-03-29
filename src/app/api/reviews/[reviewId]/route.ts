import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updates: Record<string, any> = {};

  if (body.rating !== undefined) {
    if (body.rating < 1 || body.rating > 5 || !Number.isInteger(body.rating)) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }
    updates.rating = body.rating;
  }
  if (body.review_text !== undefined) {
    if (body.review_text && body.review_text.length > 2000) {
      return NextResponse.json({ error: "Review too long" }, { status: 400 });
    }
    updates.review_text = body.review_text?.trim() || null;
  }

  const { data, error } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", reviewId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  const { reviewId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
