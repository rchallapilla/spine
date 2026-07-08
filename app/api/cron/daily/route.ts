import { NextResponse } from "next/server";
import { generateAndStoreReport } from "@/lib/coach";
import { getCronSecret } from "@/lib/env";
import {
  getTodayInTimezone,
  isEveningReminderWindow,
  isSundayInTimezone,
} from "@/lib/dates";
import { sendPushToUser } from "@/lib/push";
import { createServiceClient } from "@/lib/supabase/admin";

async function isDayComplete(
  userId: string,
  date: string,
  admin: ReturnType<typeof createServiceClient>,
) {
  const { data: defs } = await admin
    .from("habit_definitions")
    .select("*")
    .eq("active", true);

  const { data: entries } = await admin
    .from("habit_entries")
    .select("habit_id, value")
    .eq("user_id", userId)
    .eq("log_date", date);

  if (!defs || defs.length === 0) return true;

  const map: Record<string, number> = {};
  entries?.forEach((e) => {
    map[e.habit_id] = Number(e.value);
  });

  return defs.every((d) => {
    const value = map[d.id] ?? 0;
    if (d.input_type === "boolean") return value >= 1;
    return value >= (d.target_value ?? 1);
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  let cronSecret: string;
  try {
    cronSecret = getCronSecret();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceClient();
  const { data: profiles } = await admin.from("profiles").select("*");

  const results: string[] = [];

  for (const profile of profiles ?? []) {
    const timezone = profile.timezone ?? "America/New_York";
    const today = getTodayInTimezone(timezone);

    if (
      profile.reminder_evening &&
      isEveningReminderWindow(timezone) &&
      !(await isDayComplete(profile.id, today, admin))
    ) {
      // Push is optional: missing VAPID keys must not break report generation.
      try {
        await sendPushToUser(profile.id, {
          title: "Spine",
          body: "Complete your spine",
          url: "/",
        });
        results.push(`evening:${profile.email}`);
      } catch (e) {
        results.push(
          `evening-failed:${profile.email}:${e instanceof Error ? e.message : "unknown"}`,
        );
      }
    }

    if (profile.reminder_weekly && isSundayInTimezone(timezone)) {
      const since = new Date();
      since.setDate(since.getDate() - 28);
      const start = since.toISOString().slice(0, 10);

      const [logs, habits, flares, milestones, habitDefs] = await Promise.all([
        admin
          .from("daily_logs")
          .select("*")
          .eq("user_id", profile.id)
          .gte("log_date", start)
          .lte("log_date", today),
        admin
          .from("habit_entries")
          .select("*")
          .eq("user_id", profile.id)
          .gte("log_date", start)
          .lte("log_date", today),
        admin
          .from("flare_events")
          .select("*")
          .eq("user_id", profile.id)
          .gte("started_on", start),
        admin
          .from("milestones")
          .select("*")
          .eq("user_id", profile.id),
        admin.from("habit_definitions").select("*").eq("active", true),
      ]);

      try {
        await generateAndStoreReport(profile.id, {
          profile,
          logs: logs.data ?? [],
          habitEntries: habits.data ?? [],
          flares: flares.data ?? [],
          milestones: milestones.data ?? [],
          habitDefs: (habitDefs.data ?? []) as Array<{
            id: string;
            label: string;
            input_type: string;
            target_value: number | null;
          }>,
          today,
        });
        results.push(`report:${profile.email}`);
      } catch (e) {
        results.push(
          `report-failed:${profile.email}:${e instanceof Error ? e.message : "unknown"}`,
        );
        continue;
      }

      try {
        await sendPushToUser(profile.id, {
          title: "Spine",
          body: "Your weekly coach report is ready.",
          url: "/coach",
        });
      } catch {
        // Report is stored; notification failure is non-fatal.
      }
    }
  }

  return NextResponse.json({ ok: true, results });
}
