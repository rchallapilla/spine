import { createClient } from "@/lib/supabase/server";
import { getTodayInTimezone, getRangeDates } from "@/lib/dates";

export type HabitDefinition = {
  id: string;
  label: string;
  description: string | null;
  input_type: "boolean" | "count";
  target_value: number | null;
  sort_order: number;
};

export type DayData = {
  log_date: string;
  back_score: number | null;
  stress_score: number | null;
  sleep_hours: number | null;
  notes: string | null;
  habits: Record<string, number>;
};

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function getHabitDefinitions(): Promise<HabitDefinition[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("habit_definitions")
    .select("*")
    .eq("active", true)
    .order("sort_order");

  return (data ?? []) as HabitDefinition[];
}

export async function getDayData(date: string): Promise<DayData | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: log } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", user.id)
    .eq("log_date", date)
    .maybeSingle();

  const { data: habits } = await supabase
    .from("habit_entries")
    .select("habit_id, value")
    .eq("user_id", user.id)
    .eq("log_date", date);

  const habitMap: Record<string, number> = {};
  habits?.forEach((h) => {
    habitMap[h.habit_id] = Number(h.value);
  });

  return {
    log_date: date,
    back_score: log?.back_score ?? null,
    stress_score: log?.stress_score ?? null,
    sleep_hours: log?.sleep_hours ?? null,
    notes: log?.notes ?? null,
    habits: habitMap,
  };
}

export async function getActiveFlare() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("flare_events")
    .select("*")
    .eq("user_id", user.id)
    .is("ended_on", null)
    .order("started_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

export function isHabitComplete(
  habit: HabitDefinition,
  value: number | undefined,
): boolean {
  if (habit.input_type === "boolean") return (value ?? 0) >= 1;
  const target = habit.target_value ?? 1;
  return (value ?? 0) >= target;
}

export function isDayComplete(
  habits: HabitDefinition[],
  entries: Record<string, number>,
): boolean {
  return habits.every((h) => isHabitComplete(h, entries[h.id]));
}

export async function calculateStreak(timezone: string): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const habits = await getHabitDefinitions();
  const today = getTodayInTimezone(timezone);
  const { start } = getRangeDates(today, 90);

  const { data: habitEntries } = await supabase
    .from("habit_entries")
    .select("log_date, habit_id, value")
    .eq("user_id", user.id)
    .gte("log_date", start)
    .lte("log_date", today);

  const byDate: Record<string, Record<string, number>> = {};
  habitEntries?.forEach((e) => {
    if (!byDate[e.log_date]) byDate[e.log_date] = {};
    byDate[e.log_date][e.habit_id] = Number(e.value);
  });

  const previousDay = (date: string): string => {
    const d = new Date(date + "T12:00:00");
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  };

  let streak = 0;
  let checkDate = today;

  // An incomplete today (evening not logged yet) should not zero out an
  // ongoing streak; count from yesterday in that case.
  if (!isDayComplete(habits, byDate[checkDate] ?? {})) {
    checkDate = previousDay(checkDate);
  }

  while (streak <= 90) {
    if (!isDayComplete(habits, byDate[checkDate] ?? {})) break;
    streak++;
    checkDate = previousDay(checkDate);
  }

  return streak;
}

export async function getDashboardData(rangeDays: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await getProfile();
  const timezone = profile?.timezone ?? "America/New_York";
  const today = getTodayInTimezone(timezone);
  const { start, end } = getRangeDates(today, rangeDays);

  const [logsRes, habitsRes, flaresRes, defs] = await Promise.all([
    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .lte("log_date", end)
      .order("log_date"),
    supabase
      .from("habit_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .lte("log_date", end),
    supabase
      .from("flare_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("started_on", start)
      .lte("started_on", end),
    getHabitDefinitions(),
  ]);

  return {
    timezone,
    today,
    rangeDays,
    logs: logsRes.data ?? [],
    habitEntries: habitsRes.data ?? [],
    flares: flaresRes.data ?? [],
    habits: defs,
  };
}

export async function getMilestones() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("milestones")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order");

  return data ?? [];
}

export async function getWeeklyReports() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("weekly_reports")
    .select("*")
    .eq("user_id", user.id)
    .order("week_start", { ascending: false });

  return data ?? [];
}

export async function getCoachData() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await getProfile();
  const timezone = profile?.timezone ?? "America/New_York";
  const today = getTodayInTimezone(timezone);
  const { start } = getRangeDates(today, 28);

  const [logs, habits, flares, milestones] = await Promise.all([
    supabase
      .from("daily_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .lte("log_date", today),
    supabase
      .from("habit_entries")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", start)
      .lte("log_date", today),
    supabase
      .from("flare_events")
      .select("*")
      .eq("user_id", user.id)
      .gte("started_on", start),
    getMilestones(),
  ]);

  const habitDefs = await getHabitDefinitions();

  return {
    profile,
    logs: logs.data ?? [],
    habitEntries: habits.data ?? [],
    flares: flares.data ?? [],
    milestones,
    habitDefs,
    timezone,
    today,
  };
}
