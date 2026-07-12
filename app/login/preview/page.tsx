// Dev-only visual QA page (public under /login). Not linked in production nav.
import { GuideClient } from "@/components/GuideClient";
import { QuickLogBox } from "@/components/QuickLogBox";
import { ScoreDial } from "@/components/ScoreDial";
import { SpineWidget } from "@/components/spine/SpineWidget";
import type { HabitDefinition } from "@/lib/queries";

const HABITS: HabitDefinition[] = [
  { id: "sleep_window", label: "Sleep window", description: null, input_type: "boolean", target_value: null, sort_order: 1 },
  { id: "walks", label: "Walks", description: null, input_type: "count", target_value: 3, sort_order: 2 },
  { id: "mcgill_big3", label: "McGill Big 3", description: null, input_type: "boolean", target_value: null, sort_order: 3 },
  { id: "hip_openers", label: "Hip openers", description: null, input_type: "boolean", target_value: null, sort_order: 4 },
  { id: "sit_stand", label: "Position changes", description: null, input_type: "boolean", target_value: null, sort_order: 5 },
  { id: "morning_rule", label: "Morning rule", description: null, input_type: "boolean", target_value: null, sort_order: 6 },
];

export default function PreviewPage() {
  if (process.env.NODE_ENV === "production") {
    return (
      <p className="p-6 text-sm text-text-dim">Preview is only available in development.</p>
    );
  }

  const scores = { back: 4, stress: null as number | null, sleep: 7.5 };

  return (
    <div className="mx-auto max-w-lg space-y-8 px-4 py-6 pb-24">
      <header className="border-b border-line/70 pb-3">
        <h1 className="font-display text-lg font-semibold tracking-tight">Spine</h1>
      </header>
      <section className="space-y-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
              Fri Jul 10
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
              Good evening
            </h2>
          </div>
          <p className="shrink-0 rounded-full border border-accent/50 bg-accent-dim/30 px-3 py-1.5 text-xs font-medium tabular-nums text-accent">
            <span className="font-mono text-sm text-accent">8</span>
            {" day streak"}
          </p>
        </div>
        <QuickLogBox date="2026-07-10" timezone="America/New_York" />
        <SpineWidget
          habits={HABITS}
          entries={{
            sleep_window: 1,
            walks: 3,
            mcgill_big3: 1,
            hip_openers: 1,
            sit_stand: 1,
          }}
          date="2026-07-10"
        />
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-text-dim">
            Tonight&apos;s three numbers
          </p>
          <div className="flex gap-2.5">
            <ScoreDial label="Back pain" sublabel="1-10" hint="Scale hint" value={scores.back} min={1} max={10} date="2026-07-10" field="back" scores={scores} />
            <ScoreDial label="Stress" sublabel="1-10" hint="Scale hint" value={scores.stress} min={1} max={10} date="2026-07-10" field="stress" scores={scores} />
            <ScoreDial label="Sleep" sublabel="hours" hint="Scale hint" value={scores.sleep} min={0} max={14} step={0.5} unit="h" date="2026-07-10" field="sleep" scores={scores} />
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight">Guide</h2>
        <GuideClient />
      </section>
    </div>
  );
}
