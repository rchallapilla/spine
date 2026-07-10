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
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  sublabel?: string;
  hint?: string;
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
  sublabel,
  hint,
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
          className={cn(
            "flex min-h-[5.5rem] flex-1 flex-col items-center justify-center rounded-[12px] border p-3 transition-colors",
            value !== null
              ? "border-accent/35 bg-surface-2 shadow-[inset_0_1px_0_rgba(242,239,230,0.04)]"
              : "border-line bg-surface hover:border-line hover:bg-surface-2",
          )}
        >
          <span className="text-[11px] uppercase tracking-[0.06em] text-text-dim">
            {label}
          </span>
          <span className="mt-1 font-display text-2xl font-semibold tracking-tight">
            {value ?? "—"}
            {value !== null && unit ? (
              <span className="text-base text-text-dim">{unit}</span>
            ) : null}
          </span>
          {sublabel && (
            <span className="mt-0.5 text-[10px] text-text-dim">{sublabel}</span>
          )}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {hint && <p className="text-center text-sm text-text-dim">{hint}</p>}
          <div className="text-center font-display text-4xl tracking-tight">
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
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
