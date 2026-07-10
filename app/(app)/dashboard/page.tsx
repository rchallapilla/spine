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
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Patterns
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Trends
        </h2>
      </div>
      <DashboardClient data={{ ...data, rangeDays }} />
    </div>
  );
}
