import { GuideClient } from "@/components/GuideClient";

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<{ habit?: string; section?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent/80">
          Manual
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Guide
        </h2>
        <p className="mt-1 text-sm text-text-dim">
          Your full recovery manual: how to do everything, and why.
        </p>
      </div>
      <GuideClient focusHabit={params.habit} focusSection={params.section} />
    </div>
  );
}
