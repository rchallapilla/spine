"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type LogPoint = {
  log_date: string;
  back_score: number | null;
  stress_score: number | null;
  sleep_hours: number | null;
};

type Flare = {
  started_on: string;
  ended_on: string | null;
};

type Props = {
  logs: LogPoint[];
  flares: Flare[];
  showBack: boolean;
  showStress: boolean;
  showSleep: boolean;
};

export function TrendChart({
  logs,
  flares,
  showBack,
  showStress,
  showSleep,
}: Props) {
  const data = logs.map((l) => ({
    date: l.log_date.slice(5),
    back: l.back_score,
    stress: l.stress_score,
    sleep: l.sleep_hours,
  }));

  if (data.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-[12px] border border-line bg-surface p-6 text-sm text-text-dim">
        Log a few days to see trends here.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#3a3128" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#a79883" fontSize={12} />
          <YAxis stroke="#a79883" fontSize={12} domain={[0, 10]} />
          <Tooltip
            contentStyle={{
              background: "#211b16",
              border: "1px solid #43372c",
              borderRadius: 12,
            }}
          />
          <Legend />
          {flares.map((f) => (
            <ReferenceArea
              key={f.started_on}
              x1={f.started_on.slice(5)}
              x2={(f.ended_on ?? f.started_on).slice(5)}
              fill="#d9605b"
              fillOpacity={0.12}
            />
          ))}
          {showBack && (
            <Line
              type="monotone"
              dataKey="back"
              stroke="#e3a857"
              strokeWidth={2}
              dot={false}
              name="Back"
            />
          )}
          {showStress && (
            <Line
              type="monotone"
              dataKey="stress"
              stroke="#d9605b"
              strokeWidth={2}
              dot={false}
              name="Stress"
            />
          )}
          {showSleep && (
            <Line
              type="monotone"
              dataKey="sleep"
              stroke="#a79883"
              strokeWidth={2}
              dot={false}
              name="Sleep"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
