import { generateCoachReport } from "@/lib/anthropic";
import { getWeekStart } from "@/lib/dates";
import {
  CLINICAL_CONTEXT,
  COACH_INSTRUCTIONS,
} from "@/lib/prompts";
import { createServiceClient } from "@/lib/supabase/admin";

type CoachInput = {
  profile: {
    current_phase: string;
    timezone: string;
  };
  logs: Array<{
    log_date: string;
    back_score: number | null;
    stress_score: number | null;
    sleep_hours: number | null;
    notes: string | null;
  }>;
  habitEntries: Array<{
    log_date: string;
    habit_id: string;
    value: number;
  }>;
  flares: Array<{
    started_on: string;
    ended_on: string | null;
    severity: number | null;
    suspected_trigger: string | null;
  }>;
  milestones: Array<{
    title: string;
    status: string;
    target_date: string | null;
  }>;
  habitDefs: Array<{
    id: string;
    label: string;
    input_type: string;
    target_value: number | null;
  }>;
  today: string;
};

function computeAdherence(input: CoachInput) {
  const dates = [...new Set(input.logs.map((l) => l.log_date))].sort();
  return input.habitDefs.map((habit) => {
    const completed = dates.filter((date) => {
      const entry = input.habitEntries.find(
        (e) => e.log_date === date && e.habit_id === habit.id,
      );
      const value = entry?.value ?? 0;
      if (habit.input_type === "boolean") return value >= 1;
      return value >= (habit.target_value ?? 1);
    }).length;
    const pct = dates.length ? Math.round((completed / dates.length) * 100) : 0;
    return { habit_id: habit.id, label: habit.label, adherence_pct: pct };
  });
}

export function buildCoachPayload(input: CoachInput) {
  return {
    current_phase: input.profile.current_phase,
    adherence: computeAdherence(input),
    logs: input.logs,
    flares: input.flares,
    milestones: input.milestones.map((m) => ({
      title: m.title,
      status: m.status,
      target_date: m.target_date,
    })),
    today: input.today,
  };
}

export function parseRiskFlag(content: string): "green" | "amber" | "red" | null {
  const match = content.match(/RISK_FLAG:\s*(green|amber|red)\s*$/im);
  return (match?.[1]?.toLowerCase() as "green" | "amber" | "red") ?? null;
}

export async function generateAndStoreReport(
  userId: string,
  input: CoachInput,
): Promise<{ content_md: string; risk_flag: string | null; week_start: string }> {
  const payload = buildCoachPayload(input);
  const system = `${CLINICAL_CONTEXT}\n\n${COACH_INSTRUCTIONS}`;
  const content_md = await generateCoachReport(
    system,
    JSON.stringify(payload),
  );
  const risk_flag = parseRiskFlag(content_md);
  const week_start = getWeekStart(input.today);

  const admin = createServiceClient();
  await admin.from("weekly_reports").upsert(
    {
      user_id: userId,
      week_start,
      content_md,
      risk_flag,
      model: "claude-sonnet-4-6",
    },
    { onConflict: "user_id,week_start" },
  );

  return { content_md, risk_flag, week_start };
}

export async function canGenerateNow(userId: string): Promise<boolean> {
  const admin = createServiceClient();
  const since = new Date();
  since.setHours(since.getHours() - 24);

  const { data } = await admin
    .from("weekly_reports")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .limit(1);

  return !data || data.length === 0;
}
