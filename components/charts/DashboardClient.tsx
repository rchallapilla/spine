"use client";

import Link from "next/link";
import { useState } from "react";
import { AdherenceBars } from "@/components/charts/AdherenceBars";
import { TrendChart } from "@/components/charts/TrendChart";
import { cn } from "@/lib/utils";
import type { getDashboardData } from "@/lib/queries";

type DashboardData = NonNullable<Awaited<ReturnType<typeof getDashboardData>>>;

export function DashboardClient({ data }: { data: DashboardData }) {
  const range = data.rangeDays;
  const [showBack, setShowBack] = useState(true);
  const [showStress, setShowStress] = useState(true);
  const [showSleep, setShowSleep] = useState(true);

  const dates = data.logs.map((l) => l.log_date);
  const uniqueDates = [...new Set([...dates, ...data.habitEntries.map((h) => h.log_date)])].sort();

  const thisWeekLogs = data.logs.slice(-7);
  const lastWeekLogs = data.logs.slice(-14, -7);

  const avg = (logs: typeof data.logs, key: "back_score" | "stress_score" | "sleep_hours") => {
    const vals = logs.map((l) => l[key]).filter((v): v is number => v !== null);
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  const delta = (key: "back_score" | "stress_score" | "sleep_hours") => {
    const tw = avg(thisWeekLogs, key);
    const lw = avg(lastWeekLogs, key);
    if (tw === null || lw === null) return null;
    return (tw - lw).toFixed(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex h-12 w-full items-center rounded-[10px] bg-surface p-1">
        {[7, 30, 90].map((d) => (
          <Link
            key={d}
            href={`/dashboard?range=${d}`}
            className={cn(
              "flex min-h-10 flex-1 items-center justify-center rounded-[8px] text-sm font-medium",
              d === range ? "bg-bg text-text" : "text-text-dim",
            )}
          >
            {d}d
          </Link>
        ))}
      </div>

      <section className="space-y-3">
        <h3 className="font-display text-lg">Trends</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            ["Back", showBack, setShowBack],
            ["Stress", showStress, setShowStress],
            ["Sleep", showSleep, setShowSleep],
          ].map(([label, on, setOn]) => (
            <button
              key={label as string}
              type="button"
              onClick={() => (setOn as (v: boolean) => void)(!(on as boolean))}
              className={`rounded-full border px-3 py-1 ${on ? "border-accent text-accent" : "border-line text-text-dim"}`}
            >
              {label as string}
            </button>
          ))}
        </div>
        <TrendChart
          logs={data.logs}
          flares={data.flares}
          showBack={showBack}
          showStress={showStress}
          showSleep={showSleep}
        />
      </section>

      <section className="space-y-3">
        <h3 className="font-display text-lg">Adherence</h3>
        <AdherenceBars
          habits={data.habits}
          entries={data.habitEntries}
          dates={uniqueDates}
        />
      </section>

      <section className="space-y-2 rounded-[10px] border border-line bg-surface p-4 text-sm">
        <h3 className="font-display text-lg">This week vs last</h3>
        <p>Back: {delta("back_score") ?? "—"}</p>
        <p>Stress: {delta("stress_score") ?? "—"}</p>
        <p>Sleep: {delta("sleep_hours") ?? "—"}</p>
      </section>
    </div>
  );
}
