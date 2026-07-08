"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveQuickLog } from "@/app/actions/logging";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { QuickLogPayload } from "@/lib/schemas";

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
    <div className="space-y-3 rounded-[10px] border border-line bg-surface p-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="walked 3x, big3 done, back 4, slept 7.5"
        onKeyDown={(e) => e.key === "Enter" && handleParse()}
      />
      <Button
        variant="secondary"
        className="w-full"
        onClick={handleParse}
        disabled={loading || !text.trim()}
      >
        {loading ? "Parsing..." : "Parse entry"}
      </Button>

      {preview && (
        <div className="space-y-2 rounded-[10px] border border-line p-3 text-sm">
          <p className="font-medium">Preview</p>
          <ul className="space-y-1 text-text-dim">
            <li>Date: {preview.log_date}</li>
            {preview.back_score !== undefined && (
              <li>Back: {preview.back_score}</li>
            )}
            {preview.stress_score !== undefined && (
              <li>Stress: {preview.stress_score}</li>
            )}
            {preview.sleep_hours !== undefined && (
              <li>Sleep: {preview.sleep_hours}h</li>
            )}
            {preview.habits?.map((h) => (
              <li key={h.habit_id}>
                {h.habit_id}: {h.value}
              </li>
            ))}
            {preview.flare_started && <li>Flare started</li>}
            {preview.unparsed_notes && (
              <li>Notes: {preview.unparsed_notes}</li>
            )}
          </ul>
          <div className="flex gap-2">
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
