"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Report = {
  id: string;
  week_start: string;
  content_md: string;
  risk_flag: string | null;
  created_at: string;
};

export function CoachClient({ reports }: { reports: Report[] }) {
  const [loading, setLoading] = useState(false);
  const latest = reports[0];

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/coach/generate-now", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Could not generate report");
        return;
      }
      toast.success("Report generated");
      window.location.reload();
    } catch {
      toast.error("Could not generate report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Button onClick={handleGenerate} disabled={loading} className="w-full">
        {loading ? "Generating..." : "Generate now"}
      </Button>

      {!latest ? (
        <p className="text-sm text-text-dim">
          Your first weekly report will appear after enough logged days.
        </p>
      ) : (
        <article className="space-y-3 rounded-[10px] border border-line bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-lg">Week of {latest.week_start}</h3>
            {latest.risk_flag && (
              <span
                className={`rounded-full px-2 py-1 text-xs uppercase ${
                  latest.risk_flag === "red"
                    ? "bg-flare/20 text-flare"
                    : latest.risk_flag === "amber"
                      ? "bg-warn/20 text-warn"
                      : "bg-accent/20 text-accent"
                }`}
              >
                {latest.risk_flag}
              </span>
            )}
          </div>
          <div className="prose prose-invert max-w-none text-sm leading-relaxed">
            <ReactMarkdown>{latest.content_md}</ReactMarkdown>
          </div>
        </article>
      )}

      {reports.length > 1 && (
        <section className="space-y-2">
          <h3 className="font-display text-lg">History</h3>
          {reports.slice(1).map((r) => (
            <details
              key={r.id}
              className="rounded-[10px] border border-line bg-surface p-3 text-sm"
            >
              <summary className="cursor-pointer font-medium">
                Week of {r.week_start}
                {r.risk_flag ? ` · ${r.risk_flag}` : ""}
              </summary>
              <div className="prose prose-invert mt-3 max-w-none text-sm">
                <ReactMarkdown>{r.content_md}</ReactMarkdown>
              </div>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}
