"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { toggleHabit } from "@/app/actions/logging";
import type { HabitDefinition } from "@/lib/queries";
import { getHabitGuide } from "@/lib/guideContent";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  habits: HabitDefinition[];
  entries: Record<string, number>;
  date: string;
};

const WIDTHS = ["76%", "86%", "96%", "100%", "96%", "86%"];

function isComplete(habit: HabitDefinition, value: number | undefined): boolean {
  if (habit.input_type === "boolean") return (value ?? 0) >= 1;
  return (value ?? 0) >= (habit.target_value ?? 1);
}

function statusText(habit: HabitDefinition, value: number | undefined): string {
  if (habit.input_type === "count") {
    return `${value ?? 0}/${habit.target_value ?? 1}`;
  }
  return isComplete(habit, value) ? "\u2713" : "";
}

export function SpineWidget({ habits, entries, date }: Props) {
  const [localEntries, setLocalEntries] = useState(entries);
  const [countHabit, setCountHabit] = useState<HabitDefinition | null>(null);
  const [countValue, setCountValue] = useState(0);
  const [infoHabit, setInfoHabit] = useState<HabitDefinition | null>(null);

  const handleToggle = useCallback(
    async (habit: HabitDefinition) => {
      if (habit.input_type === "count") {
        setCountHabit(habit);
        setCountValue(localEntries[habit.id] ?? 0);
        return;
      }

      const current = localEntries[habit.id] ?? 0;
      const next = current >= 1 ? 0 : 1;
      setLocalEntries((prev) => ({ ...prev, [habit.id]: next }));

      if (!navigator.onLine) {
        const { enqueueMutation } = await import("@/lib/offlineQueue");
        await enqueueMutation("toggleHabit", {
          date,
          habitId: habit.id,
          value: next,
        });
        return;
      }

      const result = await toggleHabit(date, habit.id, next);
      if (!result.ok) {
        setLocalEntries((prev) => ({ ...prev, [habit.id]: current }));
        toast.error(result.error);
      }
    },
    [date, localEntries],
  );

  async function saveCount() {
    if (!countHabit) return;
    const prev = localEntries[countHabit.id] ?? 0;
    setLocalEntries((e) => ({ ...e, [countHabit.id]: countValue }));
    setCountHabit(null);

    if (!navigator.onLine) {
      const { enqueueMutation } = await import("@/lib/offlineQueue");
      await enqueueMutation("toggleHabit", {
        date,
        habitId: countHabit.id,
        value: countValue,
      });
      return;
    }

    const result = await toggleHabit(date, countHabit.id, countValue);
    if (!result.ok) {
      setLocalEntries((e) => ({ ...e, [countHabit.id]: prev }));
      toast.error(result.error);
    }
  }

  const infoGuide = infoHabit ? getHabitGuide(infoHabit.id) : undefined;

  return (
    <>
      <div className="mx-auto flex w-full flex-col items-center gap-1.5 py-2">
        <p className="text-xs text-text-dim">
          Your daily six. Tap a segment when done; tap &#9432; for how-to.
        </p>
        {habits.map((habit, i) => {
          const value = localEntries[habit.id];
          const filled = isComplete(habit, value);
          const status = statusText(habit, value);
          return (
            <div
              key={habit.id}
              className="flex items-stretch gap-1.5"
              style={{ width: WIDTHS[i] }}
            >
              <button
                type="button"
                aria-label={`${habit.label}${filled ? ", done" : ""}`}
                onClick={() => handleToggle(habit)}
                className={cn(
                  "spine-segment-fill flex min-h-12 flex-1 items-center justify-between rounded-[10px] border px-3 text-sm",
                  filled
                    ? "border-accent bg-accent text-bg shadow-[inset_0_0_12px_rgba(47,212,184,0.3)]"
                    : "border-line bg-surface text-text",
                )}
              >
                <span className="font-medium">{habit.label}</span>
                <span
                  className={cn(
                    "text-xs",
                    filled ? "font-semibold text-bg" : "text-text-dim",
                  )}
                >
                  {status}
                </span>
              </button>
              <button
                type="button"
                aria-label={`How to do ${habit.label}`}
                onClick={() => setInfoHabit(habit)}
                className="flex w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-surface text-text-dim"
              >
                &#9432;
              </button>
            </div>
          );
        })}
      </div>

      <Dialog open={!!countHabit} onOpenChange={() => setCountHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{countHabit?.label}</DialogTitle>
          </DialogHeader>
          {countHabit?.id === "walks" && (
            <p className="text-sm text-text-dim">
              How many 5-10 min walks today? Target: {countHabit.target_value ?? 3}.
            </p>
          )}
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCountValue((v) => Math.max(0, v - 1))}
            >
              -
            </Button>
            <span className="font-display text-3xl">{countValue}</span>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setCountValue((v) => v + 1)}
            >
              +
            </Button>
          </div>
          <Button onClick={saveCount} className="w-full">
            Save count
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!infoHabit} onOpenChange={() => setInfoHabit(null)}>
        <DialogContent className="max-h-[85dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{infoGuide?.title ?? infoHabit?.label}</DialogTitle>
          </DialogHeader>
          {infoGuide ? (
            <div className="space-y-3 text-sm">
              <p>{infoGuide.what}</p>
              <p className="text-text-dim">{infoGuide.why}</p>
              {infoGuide.moves.map((move) => (
                <div
                  key={move.id}
                  className="rounded-[10px] border border-line bg-bg p-3"
                >
                  <p className="font-medium">{move.name}</p>
                  <p className="mt-0.5 text-xs text-accent">{move.dose}</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-4 text-text-dim">
                    {move.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  {move.avoid && (
                    <ul className="mt-2 space-y-1 text-warn">
                      {move.avoid.map((a) => (
                        <li key={a}>Watch out: {a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <Link
                href={`/guide?habit=${infoHabit?.id}`}
                className="block text-center text-sm text-accent underline underline-offset-4"
                onClick={() => setInfoHabit(null)}
              >
                Open the full guide
              </Link>
            </div>
          ) : (
            <p className="text-sm text-text-dim">{infoHabit?.description}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
