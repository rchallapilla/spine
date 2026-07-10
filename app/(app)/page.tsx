import { Suspense } from "react";
import Link from "next/link";
import { DateStrip, FlareButton } from "@/components/DateStrip";
import { QuickLogBox } from "@/components/QuickLogBox";
import { ScoreDial } from "@/components/ScoreDial";
import { SpineWidget } from "@/components/spine/SpineWidget";
import {
  calculateStreak,
  getActiveFlare,
  getDayData,
  getHabitDefinitions,
  getProfile,
} from "@/lib/queries";
import { getDateStrip, getTodayInTimezone } from "@/lib/dates";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const params = await searchParams;
  const profile = await getProfile();
  const timezone = profile?.timezone ?? "America/New_York";
  const today = getTodayInTimezone(timezone);
  const selectedDate = params.date ?? today;
  const dates = getDateStrip(timezone, 7);

  const [habits, dayData, streak, activeFlare] = await Promise.all([
    getHabitDefinitions(),
    getDayData(selectedDate),
    calculateStreak(timezone),
    getActiveFlare(),
  ]);

  const scores = {
    back: dayData?.back_score ?? null,
    stress: dayData?.stress_score ?? null,
    sleep: dayData?.sleep_hours ?? null,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Today</h2>
          <p className="text-sm text-text-dim">{streak} day streak</p>
        </div>
      </div>

      {activeFlare && (
        <Link
          href="/flare"
          className="block rounded-[10px] border border-flare bg-surface p-3 text-sm text-flare"
        >
          Active flare since {activeFlare.started_on}. Tap to manage.
        </Link>
      )}

      <Suspense fallback={<div className="h-10" />}>
        <DateStrip dates={dates} selected={selectedDate} />
      </Suspense>

      <QuickLogBox date={selectedDate} timezone={timezone} />

      <SpineWidget
        habits={habits}
        entries={dayData?.habits ?? {}}
        date={selectedDate}
      />

      <div>
        <p className="mb-1.5 text-xs text-text-dim">
          Tonight&apos;s three numbers &mdash; tap to set each:
        </p>
        <div className="flex gap-2">
          <ScoreDial
            label="Back pain"
            sublabel="1-10"
            hint="How did your back feel today? 1 = felt nothing, 10 = worst imaginable."
            value={scores.back}
            min={1}
            max={10}
            date={selectedDate}
            field="back"
            scores={scores}
          />
          <ScoreDial
            label="Stress"
            sublabel="1-10"
            hint="Overall life/work stress today. 1 = fully relaxed, 10 = maximum."
            value={scores.stress}
            min={1}
            max={10}
            date={selectedDate}
            field="stress"
            scores={scores}
          />
          <ScoreDial
            label="Sleep"
            sublabel="hours"
            hint="Hours you actually slept last night. Target: 8.25h in bed."
            value={scores.sleep}
            min={0}
            max={14}
            step={0.5}
            unit="h"
            date={selectedDate}
            field="sleep"
            scores={scores}
          />
        </div>
      </div>

      <FlareButton />
    </div>
  );
}
