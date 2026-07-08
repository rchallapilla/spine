import { z } from "zod";

export const habitIdSchema = z.enum([
  "sleep_window",
  "walks",
  "mcgill_big3",
  "hip_openers",
  "sit_stand",
  "morning_rule",
]);

export const quickLogSchema = z.object({
  log_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  back_score: z.number().int().min(1).max(10).optional(),
  stress_score: z.number().int().min(1).max(10).optional(),
  sleep_hours: z.number().min(0).max(14).optional(),
  habits: z
    .array(
      z.object({
        habit_id: habitIdSchema,
        value: z.number(),
      }),
    )
    .optional(),
  flare_started: z.boolean().optional(),
  flare_notes: z.string().optional(),
  unparsed_notes: z.string().optional(),
});

export type QuickLogPayload = z.infer<typeof quickLogSchema>;

export const dailyScoresSchema = z.object({
  back: z.number().int().min(1).max(10).nullable(),
  stress: z.number().int().min(1).max(10).nullable(),
  sleep: z.number().min(0).max(14).nullable(),
});

export const toggleHabitSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  habitId: habitIdSchema,
  value: z.number(),
});

export const startFlareSchema = z.object({
  severity: z.number().int().min(1).max(10),
  notes: z.string().optional(),
});

export const endFlareSchema = z.object({
  id: z.string().uuid(),
  trigger: z.string().optional(),
  notes: z.string().optional(),
});

export const updateMilestoneSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["todo", "scheduled", "done", "skipped"]).optional(),
  target_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
