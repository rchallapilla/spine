import { MilestonesList } from "@/components/MilestonesList";
import { getMilestones } from "@/lib/queries";

export default async function MilestonesPage() {
  const milestones = await getMilestones();

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Milestones</h2>
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
