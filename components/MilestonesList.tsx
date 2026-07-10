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
                  className="rounded-[12px] border border-line/80 bg-surface/85 p-3.5 shadow-[inset_0_1px_0_rgba(242,239,230,0.03)]"
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
                      <span className="font-medium">{m.title}</span>
                      <span className="text-xs uppercase text-text-dim">
                        {m.status}
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
