import { ER_FLAGS, FLARE_PROTOCOL } from "@/lib/prompts";

export function FlareChecklist() {
  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <h3 className="font-display text-lg">48-hour protocol</h3>
        <div className="whitespace-pre-line rounded-[12px] border border-line bg-surface p-4 text-sm leading-relaxed">
          {FLARE_PROTOCOL}
        </div>
      </section>
      <section className="space-y-2">
        <h3 className="font-display text-lg text-flare">ER red flags</h3>
        <div className="whitespace-pre-line rounded-[12px] border border-flare bg-surface p-4 text-sm text-flare">
          {ER_FLAGS}
        </div>
      </section>
    </div>
  );
}
