"use client";

import { useEffect, useRef } from "react";
import {
  DIAGNOSIS_PLAIN,
  FLARE_GUIDE,
  GLOSSARY,
  GYM_REFERENCE,
  HABIT_GUIDES,
  PHASES,
  PT_SCRIPT,
  SELF_TESTS,
  SUCCESS_DEFINITION,
  SUPPLEMENTS,
  type HabitGuide,
  type Move,
  type SelfTest,
} from "@/lib/guideContent";

function MoveCard({ move }: { move: Move }) {
  return (
    <div className="rounded-[12px] border border-line/80 bg-bg/70 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-medium">{move.name}</span>
      </div>
      <p className="mt-0.5 text-xs text-accent">{move.dose}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-text-dim">
        {move.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {move.avoid && (
        <ul className="mt-2 space-y-1 text-sm text-warn">
          {move.avoid.map((a) => (
            <li key={a}>Watch out: {a}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HabitSection({ guide }: { guide: HabitGuide }) {
  return (
    <details
      id={`habit-${guide.habitId}`}
      className="group rounded-[12px] border border-line/80 bg-surface/80"
    >
      <summary className="cursor-pointer list-none p-3.5 font-medium marker:hidden [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block text-text-dim transition-transform group-open:rotate-90">
          &#9656;
        </span>
        {guide.title}
      </summary>
      <div className="space-y-3 border-t border-line/70 p-3.5">
        <p className="text-sm">{guide.what}</p>
        <p className="text-sm text-text-dim">{guide.why}</p>
        {guide.moves.map((m) => (
          <MoveCard key={m.id} move={m} />
        ))}
      </div>
    </details>
  );
}

function TestSection({ test }: { test: SelfTest }) {
  return (
    <div className="rounded-[12px] border border-line/80 bg-bg/70 p-3.5">
      <span className="font-medium">{test.name}</span>
      <p className="mt-0.5 text-xs text-warn">{test.when}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-text-dim">
        {test.steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p className="mt-2 text-sm">
        <span className="text-accent">Reading it: </span>
        <span className="text-text-dim">{test.reading}</span>
      </p>
    </div>
  );
}

function Section({
  id,
  title,
  defaultOpen,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      id={id}
      open={defaultOpen}
      className="group rounded-[14px] border border-line/80 bg-surface/85 shadow-[inset_0_1px_0_rgba(242,239,230,0.03)]"
    >
      <summary className="cursor-pointer list-none p-4 font-display text-base font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
        <span className="mr-2 inline-block text-text-dim transition-transform group-open:rotate-90">
          &#9656;
        </span>
        {title}
      </summary>
      <div className="space-y-3 border-t border-line/70 p-4">{children}</div>
    </details>
  );
}

export function GuideClient({
  focusHabit,
  focusSection,
}: {
  focusHabit?: string;
  focusSection?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targetId = focusHabit ? `habit-${focusHabit}` : focusSection;
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (!el) return;
    // Open the target and any parent <details> so the deep link lands expanded.
    if (el instanceof HTMLDetailsElement) el.open = true;
    let parent = el.parentElement;
    while (parent) {
      if (parent instanceof HTMLDetailsElement) parent.open = true;
      parent = parent.parentElement;
    }
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusHabit, focusSection]);

  return (
    <div ref={containerRef} className="space-y-3">
      <Section id="why" title="Why this program (2-min read)" defaultOpen={!focusHabit && !focusSection}>
        {DIAGNOSIS_PLAIN.map((p) => (
          <p key={p.slice(0, 24)} className="text-sm text-text-dim">
            {p}
          </p>
        ))}
        <div className="rounded-[12px] border border-accent/40 bg-bg p-3 text-sm">
          <span className="font-medium text-accent">The One Rule: </span>
          Protect against loaded and end-range forward bending short term.
          Rebuild confident bending gradually over months.
        </div>
        <div className="rounded-[12px] border border-warn/40 bg-bg p-3 text-sm">
          <span className="font-medium text-warn">The WIP limit: </span>
          recovery is your only side project until 2027. No new courses,
          certifications, or ventures. This matters as much as any exercise.
        </div>
      </Section>

      <Section id="daily-six" title="The daily six: how to do each one">
        <p className="text-sm text-text-dim">
          These are the six rows on the Today screen (~25 min total). Tap one
          for the full how-to.
        </p>
        {HABIT_GUIDES.map((g) => (
          <HabitSection key={g.habitId} guide={g} />
        ))}
      </Section>

      <Section id="self-tests" title="Self-tests &amp; the PT visit">
        <div className="rounded-[12px] border border-line bg-bg p-3 text-sm">
          <p className="font-medium">What to say when booking the PT:</p>
          <p className="mt-1 italic text-text-dim">{PT_SCRIPT.script}</p>
          <p className="mt-2 text-text-dim">
            <span className="font-medium text-text">Firing criteria: </span>
            {PT_SCRIPT.firingCriteria}
          </p>
        </div>
        {SELF_TESTS.map((t) => (
          <TestSection key={t.id} test={t} />
        ))}
      </Section>

      <Section id="training" title="Training plan (phases 0-3)">
        {PHASES.map((phase) => (
          <div key={phase.id} className="rounded-[12px] border border-line bg-bg p-3">
            <p className="font-medium">{phase.title}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-text-dim">
              {phase.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="rounded-[12px] border border-line bg-bg p-3 text-sm">
          <p className="font-medium">Gym quick reference</p>
          <p className="mt-2">
            <span className="text-accent">Do now: </span>
            <span className="text-text-dim">{GYM_REFERENCE.doNow.join(", ")}</span>
          </p>
          <p className="mt-1">
            <span className="text-warn">Modify: </span>
            <span className="text-text-dim">{GYM_REFERENCE.modify.join("; ")}</span>
          </p>
          <p className="mt-1">
            <span className="text-flare">Parked until Phase 3 + PT clearance: </span>
            <span className="text-text-dim">{GYM_REFERENCE.parked.join(", ")}</span>
          </p>
          <p className="mt-2 text-text-dim">{GYM_REFERENCE.stretchingNote}</p>
        </div>
      </Section>

      <Section id="flare" title="Flare playbook">
        <p className="text-sm font-medium">First 48 hours</p>
        <ol className="list-decimal space-y-1 pl-4 text-sm text-text-dim">
          {FLARE_GUIDE.first48.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <p className="text-sm text-text-dim">{FLARE_GUIDE.stressLag}</p>
        <p className="text-sm text-text-dim">{FLARE_GUIDE.relapseScript}</p>
        <div className="rounded-[12px] border border-flare/50 bg-bg p-3 text-sm">
          <p className="font-medium text-flare">ER now (rare, NEW symptoms only):</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-text-dim">
            {FLARE_GUIDE.erFlags.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-text-dim">{FLARE_GUIDE.escalation}</p>
      </Section>

      <Section id="supplements" title="Supplements &amp; gadgets (final verdicts)">
        <div className="space-y-2">
          {SUPPLEMENTS.map((s) => (
            <div key={s.item} className="rounded-[12px] border border-line bg-bg p-3 text-sm">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{s.item}</span>
                <span className="shrink-0 text-xs uppercase text-accent">{s.verdict}</span>
              </div>
              <p className="mt-1 text-text-dim">{s.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="glossary" title="Glossary: every term in this app">
        <div className="space-y-2">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="rounded-[12px] border border-line bg-bg p-3 text-sm">
              <p className="font-medium">{g.term}</p>
              <p className="mt-1 text-text-dim">{g.def}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="success" title="What success looks like">
        <p className="text-sm text-text-dim">{SUCCESS_DEFINITION.isNot}</p>
        <p className="text-sm">{SUCCESS_DEFINITION.is}</p>
        <ul className="list-disc space-y-1 pl-4 text-sm text-text-dim">
          {SUCCESS_DEFINITION.timeline.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
