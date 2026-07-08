import { NextResponse } from "next/server";
import { canGenerateNow, generateAndStoreReport } from "@/lib/coach";
import { getCoachData } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const allowed = await canGenerateNow(user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: "Generate now is limited to once per day" },
      { status: 429 },
    );
  }

  const data = await getCoachData();
  if (!data?.profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  try {
    const report = await generateAndStoreReport(user.id, {
      profile: data.profile,
      logs: data.logs,
      habitEntries: data.habitEntries,
      flares: data.flares,
      milestones: data.milestones,
      habitDefs: data.habitDefs,
      today: data.today,
    });

    return NextResponse.json({ report });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
