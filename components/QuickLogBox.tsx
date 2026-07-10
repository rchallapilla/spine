"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveQuickLog } from "@/app/actions/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuickLogPayload } from "@/lib/schemas";
import { HABIT_LABELS } from "@/lib/guideContent";

type Props = {
  date: string;
  timezone: string;
};

export function QuickLogBox({ date, timezone }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<QuickLogPayload | null>(null);

  async function handleParse() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/quick-log/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, today: date, timezone }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not parse entry");
        return;
      }
      setPreview(data.preview);
    } catch {
      toast.error("Could not parse entry");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    if (!preview) return;
    setLoading(true);
    const result = await saveQuickLog(preview);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    setText("");
    setPreview(null);
    toast.success("Day saved");
  }

  return (
    <div className="space-y-2.5 rounded-[14px] border border-line/80 bg-surface/80 p-3.5 shadow-[inset_0_1px_0_rgba(242,239,230,0.03)]">
      <p className="text-xs leading-relaxed text-text-dim">
        Describe your day in plain words &mdash; it fills in everything below.
        Or skip and tap the rows.
      </p>
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='e.g. "3 walks, did the big 3, back pain 4/10, slept 7.5h"'
        onKeyDown={(e) => e.key === "Enter" && handleParse()}
      />
      <Button
        variant={text.trim() ? "default" : "secondary"}
        className="w-full"
        onClick={handleParse}
        disabled={loading || !text.trim()}
      >
        {loading ? "Reading your entry..." : "Log my day"}
      </Button>

      {preview && (
        <div className="space-y-2 rounded-[12px] border border-accent/30 bg-accent-dim/30 p-3 text-sm">
          <p className="font-medium text-text">
            Here&apos;s what I understood &mdash; confirm to save:
          </p>
          <ul className="space-y-1 text-text-dim">
            <li>Date: {preview.log_date}</li>
            {preview.back_score !== undefined && (
              <li>Back pain: {preview.back_score}/10</li>
            )}
            {preview.stress_score !== undefined && (
              <li>Stress: {preview.stress_score}/10</li>
            )}
            {preview.sleep_hours !== undefined && (
              <li>Sleep: {preview.sleep_hours}h</li>
            )}
            {preview.habits?.map((h) => (
              <li key={h.habit_id}>
                {HABIT_LABELS[h.habit_id] ?? h.habit_id}:{" "}
                {h.habit_id === "walks"
                  ? `${h.value}`
                  : h.value >= 1
                    ? "done"
                    : "not done"}
              </li>
            ))}
            {preview.flare_started && <li>Flare started</li>}
            {preview.unparsed_notes && (
              <li>Notes: {preview.unparsed_notes}</li>
            )}
          </ul>
          <div className="flex gap-2 pt-1">
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setPreview(null)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleConfirm} disabled={loading}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
