"use client";

type Props = {
  habits: { id: string; label: string; target_value: number | null; input_type: string }[];
  entries: { log_date: string; habit_id: string; value: number }[];
  dates: string[];
};

export function AdherenceBars({ habits, entries, dates }: Props) {
  if (dates.length === 0) {
    return (
      <p className="text-sm text-text-dim">No adherence data yet.</p>
    );
  }

  const rates = habits.map((habit) => {
    const relevant = entries.filter((e) => e.habit_id === habit.id);
    const completed = relevant.filter((e) => {
      if (habit.input_type === "boolean") return e.value >= 1;
      return e.value >= (habit.target_value ?? 1);
    }).length;
    const pct = dates.length > 0 ? Math.round((completed / dates.length) * 100) : 0;
    return { label: habit.label, pct };
  });

  const overall = Math.round(
    rates.reduce((s, r) => s + r.pct, 0) / Math.max(rates.length, 1),
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-dim">Overall adherence: {overall}%</p>
      {rates.map((r) => (
        <div key={r.label}>
          <div className="mb-1 flex justify-between text-xs">
            <span>{r.label}</span>
            <span className="text-text-dim">{r.pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-accent"
              style={{ width: `${r.pct}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
