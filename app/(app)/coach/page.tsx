import { CoachClient } from "@/components/CoachClient";
import { getWeeklyReports } from "@/lib/queries";

export default async function CoachPage() {
  const reports = await getWeeklyReports();

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Coach</h2>
      <CoachClient reports={reports} />
    </div>
  );
}
