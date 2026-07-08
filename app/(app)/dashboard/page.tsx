import { DashboardClient } from "@/components/charts/DashboardClient";
import { getDashboardData } from "@/lib/queries";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = Number(params.range ?? 30);
  const rangeDays = [7, 30, 90].includes(range) ? range : 30;
  const data = await getDashboardData(rangeDays);

  if (!data) {
    return <p className="text-text-dim">Sign in to view your dashboard.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Dashboard</h2>
      <DashboardClient data={{ ...data, rangeDays }} />
    </div>
  );
}
