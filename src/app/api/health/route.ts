import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);

    if (error) {
      return NextResponse.json(
        { status: "degraded", supabase: "error", timestamp },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { status: "ok", supabase: "ok", timestamp },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", supabase: "error", timestamp },
      { status: 503 }
    );
  }
}
