"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { toggleHabit } from "@/app/actions/logging";
import type { HabitDefinition } from "@/lib/queries";
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

const WIDTHS = ["72%", "84%", "96%", "100%", "96%", "84%"];

function isComplete(habit: HabitDefinition, value: number | undefined): boolean {
  if (habit.input_type === "boolean") return (value ?? 0) >= 1;
  return (value ?? 0) >= (habit.target_value ?? 1);
}

export function SpineWidget({ habits, entries, date }: Props) {
  const [localEntries, setLocalEntries] = useState(entries);
  const [countHabit, setCountHabit] = useState<HabitDefinition | null>(null);
  const [countValue, setCountValue] = useState(0);

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

  return (
    <>
      <div className="mx-auto flex h-[44vh] max-h-96 w-full flex-col items-center justify-center gap-1.5 py-4">
        {habits.map((habit, i) => {
          const value = localEntries[habit.id];
          const filled = isComplete(habit, value);
          return (
            <button
              key={habit.id}
              type="button"
              aria-label={`${habit.label}${filled ? ", done" : ""}`}
              onClick={() => handleToggle(habit)}
              onContextMenu={(e) => {
                if (habit.input_type === "count") {
                  e.preventDefault();
                  setCountHabit(habit);
                  setCountValue(value ?? 0);
                }
              }}
              className={cn(
                "spine-segment-fill rounded-[10px] border min-h-12",
                filled
                  ? "border-accent bg-accent shadow-[inset_0_0_12px_rgba(47,212,184,0.3)]"
                  : "border-line bg-surface",
              )}
              style={{ width: WIDTHS[i] }}
            />
          );
        })}
      </div>

      <Dialog open={!!countHabit} onOpenChange={() => setCountHabit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{countHabit?.label}</DialogTitle>
          </DialogHeader>
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
    </>
  );
}
