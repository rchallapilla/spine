import { NextResponse } from "next/server";
import { parseQuickLog } from "@/lib/anthropic";
import { PARSER_SYSTEM } from "@/lib/prompts";
import { quickLogSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const text = body.text as string;
    const today = body.today as string;
    const timezone = body.timezone as string;

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const userMessage = JSON.stringify({
      today,
      timezone,
      habit_ids: [
        "sleep_window",
        "walks",
        "mcgill_big3",
        "hip_openers",
        "sit_stand",
        "morning_rule",
      ],
      text,
    });

    const raw = await parseQuickLog(PARSER_SYSTEM, userMessage);
    const parsed = quickLogSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Could not parse entry into a valid day log" },
        { status: 422 },
      );
    }

    return NextResponse.json({ preview: parsed.data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Parse failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
