import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_PERIODS = ["week", "month", "all"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let period = searchParams.get("period") || "all";
  if (!VALID_PERIODS.includes(period)) period = "all";

  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_trending", { period });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 });
  }

  const paginated = (data || []).slice(offset, offset + limit);
  return NextResponse.json(paginated);
}
