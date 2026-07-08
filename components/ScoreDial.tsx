"use client";

import { useState } from "react";
import { toast } from "sonner";
import { upsertDailyScores } from "@/app/actions/logging";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

type Props = {
  label: string;
  value: number | null;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  date: string;
  field: "back" | "stress" | "sleep";
  scores: {
    back: number | null;
    stress: number | null;
    sleep: number | null;
  };
};

export function ScoreDial({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  date,
  field,
  scores,
}: Props) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(value ?? min);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    const next = { ...scores, [field]: local };

    if (!navigator.onLine) {
      const { enqueueMutation } = await import("@/lib/offlineQueue");
      await enqueueMutation("upsertDailyScores", { date, scores: next });
      setSaving(false);
      setOpen(false);
      return;
    }

    const result = await upsertDailyScores(date, next);
    setSaving(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) setLocal(value ?? min);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-20 flex-1 flex-col items-center justify-center rounded-[10px] border border-line bg-surface p-3"
        >
          <span className="text-xs text-text-dim">{label}</span>
          <span className="font-display text-2xl font-semibold">
            {value ?? "—"}
            {value !== null && unit ? unit : ""}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="text-center font-display text-4xl">
            {local}
            {unit}
          </div>
          <Slider
            min={min}
            max={max}
            step={step}
            value={[local]}
            onValueChange={([v]) => setLocal(v)}
          />
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save day"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
