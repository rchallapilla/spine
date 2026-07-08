"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  dailyScoresSchema,
  endFlareSchema,
  quickLogSchema,
  startFlareSchema,
  toggleHabitSchema,
  updateMilestoneSchema,
  type ActionResult,
  type QuickLogPayload,
} from "@/lib/schemas";
import { isWithinBackEditWindow } from "@/lib/dates";

async function getUserContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");

  const { data: profile } = await supabase
    .from("profiles")
    .select("timezone")
    .eq("id", user.id)
    .single();

  return {
    supabase,
    userId: user.id,
    timezone: profile?.timezone ?? "America/New_York",
  };
}

export async function upsertDailyScores(
  date: string,
  scores: { back: number | null; stress: number | null; sleep: number | null },
): Promise<ActionResult<null>> {
  try {
    const parsed = dailyScoresSchema.safeParse(scores);
    if (!parsed.success) return { ok: false, error: "Invalid scores" };

    const { supabase, userId, timezone } = await getUserContext();
    if (!isWithinBackEditWindow(date, timezone)) {
      return { ok: false, error: "Date is outside the 7-day edit window" };
    }

    const { error } = await supabase.from("daily_logs").upsert(
      {
        user_id: userId,
        log_date: date,
        back_score: scores.back,
        stress_score: scores.stress,
        sleep_hours: scores.sleep,
      },
      { onConflict: "user_id,log_date" },
    );

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function toggleHabit(
  date: string,
  habitId: string,
  value: number,
): Promise<ActionResult<null>> {
  try {
    const parsed = toggleHabitSchema.safeParse({ date, habitId, value });
    if (!parsed.success) return { ok: false, error: "Invalid habit data" };

    const { supabase, userId, timezone } = await getUserContext();
    if (!isWithinBackEditWindow(date, timezone)) {
      return { ok: false, error: "Date is outside the 7-day edit window" };
    }

    const { error } = await supabase.from("habit_entries").upsert(
      {
        user_id: userId,
        log_date: date,
        habit_id: habitId,
        value,
      },
      { onConflict: "user_id,log_date,habit_id" },
    );

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/dashboard");
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function startFlare(
  severity: number,
  notes?: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const parsed = startFlareSchema.safeParse({ severity, notes });
    if (!parsed.success) return { ok: false, error: "Invalid flare data" };

    const { supabase, userId, timezone } = await getUserContext();
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: timezone,
    });

    const { data, error } = await supabase
      .from("flare_events")
      .insert({
        user_id: userId,
        started_on: today,
        severity,
        notes: notes ?? null,
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/flare");
    revalidatePath("/dashboard");
    return { ok: true, data: { id: data.id } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to start flare" };
  }
}

export async function endFlare(
  id: string,
  trigger?: string,
  notes?: string,
): Promise<ActionResult<null>> {
  try {
    const parsed = endFlareSchema.safeParse({ id, trigger, notes });
    if (!parsed.success) return { ok: false, error: "Invalid flare data" };

    const { supabase, userId, timezone } = await getUserContext();
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: timezone,
    });

    const update: Record<string, unknown> = { ended_on: today };
    if (trigger !== undefined) update.suspected_trigger = trigger;
    if (notes !== undefined) update.notes = notes;

    const { error } = await supabase
      .from("flare_events")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/");
    revalidatePath("/flare");
    revalidatePath("/dashboard");
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to end flare" };
  }
}

export async function updateMilestone(
  id: string,
  patch: {
    status?: "todo" | "scheduled" | "done" | "skipped";
    target_date?: string | null;
    notes?: string | null;
  },
): Promise<ActionResult<null>> {
  try {
    const parsed = updateMilestoneSchema.safeParse({ id, ...patch });
    if (!parsed.success) return { ok: false, error: "Invalid milestone data" };

    const { supabase, userId } = await getUserContext();
    const update: Record<string, unknown> = { ...patch };
    if (patch.status === "done") {
      update.completed_at = new Date().toISOString().slice(0, 10);
    }

    const { error } = await supabase
      .from("milestones")
      .update(update)
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return { ok: false, error: error.message };
    revalidatePath("/milestones");
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to update" };
  }
}

export async function saveQuickLog(
  payload: QuickLogPayload,
): Promise<ActionResult<null>> {
  try {
    const parsed = quickLogSchema.safeParse(payload);
    if (!parsed.success) return { ok: false, error: "Invalid quick log data" };

    const { supabase, userId, timezone } = await getUserContext();
    if (!isWithinBackEditWindow(payload.log_date, timezone)) {
      return { ok: false, error: "Date is outside the 7-day edit window" };
    }

    const logUpdate: Record<string, unknown> = {
      user_id: userId,
      log_date: payload.log_date,
    };
    if (payload.back_score !== undefined) logUpdate.back_score = payload.back_score;
    if (payload.stress_score !== undefined)
      logUpdate.stress_score = payload.stress_score;
    if (payload.sleep_hours !== undefined) logUpdate.sleep_hours = payload.sleep_hours;

    const notes = [payload.unparsed_notes, payload.flare_notes]
      .filter(Boolean)
      .join("\n");
    if (notes) logUpdate.notes = notes;

    const { error: logError } = await supabase
      .from("daily_logs")
      .upsert(logUpdate, { onConflict: "user_id,log_date" });

    if (logError) return { ok: false, error: logError.message };

    if (payload.habits) {
      for (const habit of payload.habits) {
        const { error } = await supabase.from("habit_entries").upsert(
          {
            user_id: userId,
            log_date: payload.log_date,
            habit_id: habit.habit_id,
            value: habit.value,
          },
          { onConflict: "user_id,log_date,habit_id" },
        );
        if (error) return { ok: false, error: error.message };
      }
    }

    if (payload.flare_started) {
      const { error } = await supabase.from("flare_events").insert({
        user_id: userId,
        started_on: payload.log_date,
        severity: 5,
        notes: payload.flare_notes ?? null,
      });
      if (error) return { ok: false, error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath("/flare");
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}
