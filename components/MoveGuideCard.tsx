import type { Move } from "@/lib/guideContent";

export function MoveGuideCard({ move }: { move: Move }) {
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
      {move.videoUrl && (
        <a
          href={move.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-accent underline underline-offset-4"
        >
          {move.videoLabel ?? "Watch how-to video"}
        </a>
      )}
    </div>
  );
}
