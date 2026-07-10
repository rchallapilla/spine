import { MilestonesList } from "@/components/MilestonesList";
import { getMilestones } from "@/lib/queries";

export default async function MilestonesPage() {
  const milestones = await getMilestones();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Checkpoints
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Plan
        </h2>
        <p className="mt-1 text-sm text-text-dim">
          One-time recovery checkpoints. Tap a card to cycle status (to-do
          &rarr; scheduled &rarr; done).
        </p>
      </div>
      {milestones.length === 0 ? (
        <p className="text-sm text-text-dim">
          Milestones will appear after your first sign-in.
        </p>
      ) : (
        <MilestonesList milestones={milestones} />
      )}
    </div>
  );
}
