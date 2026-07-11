"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { updateMilestone } from "@/app/actions/logging";
import { Input } from "@/components/ui/input";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  criteria_text: string | null;
  target_date: string | null;
  status: string;
  notes: string | null;
};

const CATEGORIES = ["medical", "pt", "labs", "training", "checkpoint"] as const;

const STATUS_CYCLE: Record<string, string> = {
  todo: "scheduled",
  scheduled: "done",
  done: "todo",
  skipped: "todo",
};

const STATUS_LABELS: Record<string, string> = {
  todo: "To do",
  scheduled: "Scheduled",
  done: "Done",
  skipped: "Skipped",
};

const STATUS_STYLES: Record<string, string> = {
  todo: "text-text-dim",
  scheduled: "text-warn",
  done: "text-accent",
  skipped: "text-text-dim line-through",
};

// Maps milestone titles to the Guide section that explains how to do them.
const GUIDE_LINKS: { match: RegExp; href: string; label: string }[] = [
  { match: /directional preference/i, href: "/guide?section=self-tests", label: "How to run this test" },
  { match: /sorensen/i, href: "/guide?section=self-tests", label: "How to run this test" },
  { match: /side plank baseline/i, href: "/guide?section=self-tests", label: "How to run this test" },
  { match: /pt eval/i, href: "/guide?section=self-tests", label: "What to say to the PT" },
  { match: /phase|burpee|deadlift|maintenance floor/i, href: "/guide?section=training", label: "See the training plan" },
  { match: /relapse/i, href: "/guide?section=flare", label: "Why this is predicted" },
  { match: /escalation/i, href: "/guide?section=flare", label: "See the escalation path" },
];

function guideLinkFor(title: string) {
  return GUIDE_LINKS.find((g) => g.match.test(title));
}

export function MilestonesList({ milestones }: { milestones: Milestone[] }) {
  const [items, setItems] = useState(milestones);

  const doneCount = items.filter((m) => m.status === "done").length;
  const pendingCount = items.filter(
    (m) => m.status === "todo" || m.status === "scheduled",
  ).length;
  const skippedCount = items.filter((m) => m.status === "skipped").length;

  async function cycleStatus(m: Milestone) {
    const next = STATUS_CYCLE[m.status] ?? "todo";
    setItems((prev) =>
      prev.map((i) => (i.id === m.id ? { ...i, status: next } : i)),
    );
    const result = await updateMilestone(m.id, {
      status: next as "todo" | "scheduled" | "done" | "skipped",
    });
    if (!result.ok) toast.error(result.error);
  }

  async function skip(m: Milestone) {
    setItems((prev) =>
      prev.map((i) => (i.id === m.id ? { ...i, status: "skipped" } : i)),
    );
    const result = await updateMilestone(m.id, { status: "skipped" });
    if (!result.ok) toast.error(result.error);
  }

  async function setTargetDate(m: Milestone, date: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === m.id ? { ...i, target_date: date } : i)),
    );
    const result = await updateMilestone(m.id, { target_date: date || null });
    if (!result.ok) toast.error(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2.5">
        <div className="flex-1 rounded-[12px] border border-accent/40 bg-accent-dim/30 px-3 py-2.5 text-center">
          <p className="font-display text-2xl font-semibold text-accent">
            {doneCount}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-text-dim">
            Done
          </p>
        </div>
        <div className="flex-1 rounded-[12px] border border-line/80 bg-surface/80 px-3 py-2.5 text-center">
          <p className="font-display text-2xl font-semibold">{pendingCount}</p>
          <p className="text-[11px] uppercase tracking-wide text-text-dim">
            Pending
          </p>
        </div>
        {skippedCount > 0 && (
          <div className="flex-1 rounded-[12px] border border-line/80 bg-surface/80 px-3 py-2.5 text-center">
            <p className="font-display text-2xl font-semibold text-text-dim">
              {skippedCount}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-text-dim">
              Skipped
            </p>
          </div>
        )}
      </div>

      <p className="text-xs text-text-dim">
        Tap a card to cycle: To do &rarr; Scheduled &rarr; Done. The date field
        is only when you plan to do it — it does not mark it complete.
      </p>

      {CATEGORIES.map((cat) => {
        const group = items.filter((m) => m.category === cat);
        if (group.length === 0) return null;
        return (
          <section key={cat}>
            <h3 className="mb-3 font-display text-lg capitalize">{cat}</h3>
            <div className="space-y-3">
              {group.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-[12px] border p-3.5 shadow-[inset_0_1px_0_rgba(242,239,230,0.03)] ${
                    m.status === "done"
                      ? "border-accent/50 bg-accent-dim/20"
                      : m.status === "skipped"
                        ? "border-line/50 bg-surface/50 opacity-70"
                        : "border-line/80 bg-surface/85"
                  }`}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    void skip(m);
                  }}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => cycleStatus(m)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`font-medium ${m.status === "done" ? "text-accent" : ""}`}
                      >
                        {m.title}
                      </span>
                      <span
                        className={`shrink-0 text-xs font-medium uppercase tracking-wide ${STATUS_STYLES[m.status] ?? "text-text-dim"}`}
                      >
                        {STATUS_LABELS[m.status] ?? m.status}
                      </span>
                    </div>
                    {m.description && (
                      <p className="mt-1 text-sm text-text-dim">{m.description}</p>
                    )}
                    {m.criteria_text && (
                      <ul className="mt-2 list-disc pl-4 text-sm text-text-dim">
                        {m.criteria_text.split(";").map((c) => (
                          <li key={c}>{c.trim()}</li>
                        ))}
                      </ul>
                    )}
                  </button>
                  {(() => {
                    const link = guideLinkFor(m.title);
                    return link ? (
                      <Link
                        href={link.href}
                        className="mt-1 inline-block text-sm text-accent underline underline-offset-4"
                      >
                        {link.label}
                      </Link>
                    ) : null;
                  })()}
                  <div className="mt-2">
                    <label className="mb-1 block text-[11px] uppercase tracking-wide text-text-dim">
                      Target date (planned)
                    </label>
                    <Input
                      type="date"
                      value={m.target_date ?? ""}
                      onChange={(e) => setTargetDate(m, e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
