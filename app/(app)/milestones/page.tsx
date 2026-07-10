import { MilestonesList } from "@/components/MilestonesList";
import { getMilestones } from "@/lib/queries";

export default async function MilestonesPage() {
  const milestones = await getMilestones();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold">Plan</h2>
        <p className="text-sm text-text-dim">
          The one-time checkpoints of your recovery. Tap a card to cycle its
          status (to-do &rarr; scheduled &rarr; done).
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
