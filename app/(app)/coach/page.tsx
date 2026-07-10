import { CoachClient } from "@/components/CoachClient";
import { getWeeklyReports } from "@/lib/queries";

export default async function CoachPage() {
  const reports = await getWeeklyReports();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Weekly
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Coach
        </h2>
      </div>
      <CoachClient reports={reports} />
    </div>
  );
}
