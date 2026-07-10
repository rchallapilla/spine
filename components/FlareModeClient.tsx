"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { endFlare, startFlare } from "@/app/actions/logging";
import { FlareChecklist } from "@/components/FlareChecklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type ActiveFlare = {
  id: string;
  started_on: string;
  severity: number | null;
} | null;

export function FlareModeClient({ activeFlare }: { activeFlare: ActiveFlare }) {
  const router = useRouter();
  const [severity, setSeverity] = useState(5);
  const [trigger, setTrigger] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    setLoading(true);
    const result = await startFlare(severity, notes || undefined);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Flare started");
    router.refresh();
  }

  async function handleEnd() {
    if (!activeFlare) return;
    setLoading(true);
    const result = await endFlare(activeFlare.id, trigger || undefined, notes || undefined);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Flare ended");
    router.push("/");
  }

  return (
    <div className="space-y-6 text-flare">
      {!activeFlare ? (
        <section className="space-y-4 rounded-[12px] border border-flare bg-surface p-4">
          <h3 className="font-display text-lg">Start flare</h3>
          <div className="space-y-2">
            <p className="text-sm">Severity: {severity}</p>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[severity]}
              onValueChange={([v]) => setSeverity(v)}
            />
          </div>
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button variant="flare" className="w-full" onClick={handleStart} disabled={loading}>
            Start flare
          </Button>
        </section>
      ) : (
        <section className="space-y-4 rounded-[12px] border border-flare bg-surface p-4">
          <p className="text-sm">
            Active flare since {activeFlare.started_on}
          </p>
          <Input
            placeholder="Suspected trigger"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
          <Input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button variant="flare" className="w-full" onClick={handleEnd} disabled={loading}>
            End flare
          </Button>
        </section>
      )}

      <FlareChecklist />

      <Button variant="ghost" className="w-full text-text" onClick={() => router.push("/")}>
        Back to today
      </Button>
    </div>
  );
}
