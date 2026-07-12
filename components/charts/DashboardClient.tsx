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
    return tw - lw;
  };

  // For back and stress, down is good; for sleep, up is good.
  const deltaRow = (
    label: string,
    key: "back_score" | "stress_score" | "sleep_hours",
    upIsGood: boolean,
    unit = "",
  ) => {
    const d = delta(key);
    if (d === null) {
      return (
        <p key={label} className="flex justify-between text-text-dim">
          <span>{label}</span>
          <span>Not enough data yet</span>
        </p>
      );
    }
    const flat = Math.abs(d) < 0.05;
    const good = upIsGood ? d > 0 : d < 0;
    const arrow = flat ? "\u2192" : d > 0 ? "\u2191" : "\u2193";
    const word = flat ? "steady" : good ? "better" : "watch";
    return (
      <p key={label} className="flex justify-between">
        <span>{label}</span>
        <span
          className={`tabular-nums ${
            flat ? "text-text-dim" : good ? "text-accent" : "text-warn"
          }`}
        >
          {arrow} {d > 0 ? "+" : ""}
          {d.toFixed(1)}
          {unit} · {word}
        </span>
      </p>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex h-12 w-full items-center rounded-[12px] border border-line/70 bg-surface/80 p-1">
        {[7, 30, 90].map((d) => (
          <Link
            key={d}
            href={`/dashboard?range=${d}`}
            aria-current={d === range ? "true" : undefined}
            className={cn(
              "flex min-h-10 flex-1 items-center justify-center rounded-[10px] text-sm font-medium transition-colors",
              d === range
                ? "bg-surface-2 text-text shadow-[inset_0_1px_0_rgba(242,239,230,0.05)]"
                : "text-text-dim hover:text-text",
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
              aria-pressed={on as boolean}
              onClick={() => (setOn as (v: boolean) => void)(!(on as boolean))}
              className={`min-h-9 rounded-full border px-3 py-1 transition-colors ${on ? "border-accent text-accent" : "border-line text-text-dim hover:text-text"}`}
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

      <section className="space-y-2 rounded-[12px] border border-line/80 bg-surface/85 p-4 text-sm">
        <h3 className="font-display text-lg">This week vs last</h3>
        {deltaRow("Back", "back_score", false)}
        {deltaRow("Stress", "stress_score", false)}
        {deltaRow("Sleep", "sleep_hours", true, "h")}
      </section>
    </div>
  );
}
