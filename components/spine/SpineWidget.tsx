"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { MoveGuideCard } from "@/components/MoveGuideCard";

type Props = {
  habits: HabitDefinition[];
  entries: Record<string, number>;
  date: string;
};

// Lumbar curve: widths trace the taper of a real spine, widest at L3/L4.
const WIDTHS = ["72%", "84%", "95%", "100%", "95%", "84%"];

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
  const doneCount = habits.filter((h) =>
    isComplete(h, localEntries[h.id]),
  ).length;
  const allDone = habits.length > 0 && doneCount === habits.length;

  // Fire the alignment sweep only when the last segment fills in this
  // session, not when the page loads with an already-complete day.
  const [sweeping, setSweeping] = useState(false);
  const prevDone = useRef(doneCount);
  useEffect(() => {
    const wasOneShort = prevDone.current === habits.length - 1;
    prevDone.current = doneCount;
    if (doneCount === habits.length && wasOneShort) {
      setSweeping(true);
      const t = setTimeout(() => setSweeping(false), 1200);
      return () => clearTimeout(t);
    }
  }, [doneCount, habits.length]);

  return (
    <>
      <section className="relative mx-auto w-full overflow-hidden rounded-[18px] border border-line/70 bg-surface/70 p-3.5 shadow-[inset_0_1px_0_rgba(243,235,221,0.04)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(227,168,87,0.12),transparent_70%)]"
        />
        {sweeping && (
          <div
            aria-hidden
            className="spine-align-sweep pointer-events-none absolute inset-0 z-10"
          />
        )}
        <div className="relative mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-dim">
              Your spine
            </p>
            <p
              className={cn(
                "mt-0.5 text-sm",
                allDone ? "font-medium text-accent" : "text-text-dim",
              )}
              aria-live="polite"
            >
              {allDone
                ? "All six done — aligned"
                : "Tap a segment when done · ⓘ for how-to"}
            </p>
          </div>
          <p className="font-mono text-sm tabular-nums text-accent">
            {doneCount}/{habits.length}
          </p>
        </div>

        <div className="relative mx-auto flex w-full flex-col items-center">
          {habits.map((habit, i) => {
            const value = localEntries[habit.id];
            const filled = isComplete(habit, value);
            const status = statusText(habit, value);
            const prevFilled =
              i > 0 && isComplete(habits[i - 1], localEntries[habits[i - 1].id]);
            return (
              <div key={habit.id} className="contents">
                {i > 0 && (
                  <div
                    aria-hidden
                    className={cn(
                      "spine-segment-fill my-[3px] h-[5px] w-9 rounded-full",
                      filled && prevFilled
                        ? "bg-accent/85 shadow-[0_0_8px_rgba(227,168,87,0.55)]"
                        : "bg-line/70",
                    )}
                  />
                )}
                <div
                  className="flex items-stretch gap-1.5"
                  style={{ width: WIDTHS[i] }}
                >
                  <button
                    type="button"
                    aria-label={`${habit.label}${filled ? ", done" : ""}`}
                    onClick={() => handleToggle(habit)}
                    className={cn(
                      "spine-segment-fill flex min-h-12 flex-1 items-center justify-between rounded-[16px] border px-3.5 text-sm",
                      filled
                        ? "border-accent/80 bg-gradient-to-b from-accent to-[#cf9243] text-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_14px_rgba(227,168,87,0.28)]"
                        : "border-line bg-surface-2/80 text-text shadow-[inset_0_1px_0_rgba(243,235,221,0.03)]",
                    )}
                  >
                    <span className="font-medium tracking-tight">
                      {habit.label}
                    </span>
                    <span
                      className={cn(
                        "font-mono text-xs tabular-nums",
                        filled ? "font-semibold text-bg/90" : "text-text-dim",
                      )}
                    >
                      {status}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`How to do ${habit.label}`}
                    onClick={() => setInfoHabit(habit)}
                    className="flex w-10 shrink-0 items-center justify-center rounded-[16px] border border-line/45 bg-transparent text-text-dim/80 transition-colors hover:border-accent/40 hover:text-accent"
                  >
                    &#9432;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Dialog open={!!countHabit} onOpenChange={() => setCountHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{countHabit?.label}</DialogTitle>
          </DialogHeader>
          {countHabit?.id === "walks" && (
            <p className="text-sm text-text-dim">
              How many 5-10 min walks today? Target:{" "}
              {countHabit.target_value ?? 3}.
            </p>
          )}
          <div className="flex items-center justify-center gap-4 py-4">
            <Button
              variant="secondary"
              size="icon"
              aria-label="Decrease count"
              onClick={() => setCountValue((v) => Math.max(0, v - 1))}
            >
              &minus;
            </Button>
            <span
              className="font-display text-3xl tabular-nums"
              aria-live="polite"
            >
              {countValue}
            </span>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Increase count"
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
                <MoveGuideCard key={move.id} move={move} />
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
