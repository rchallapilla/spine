import { GuideClient } from "@/components/GuideClient";

export default async function GuidePage({
  searchParams,
}: {
  searchParams: Promise<{ habit?: string; section?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold">Guide</h2>
        <p className="text-sm text-text-dim">
          Your full recovery manual: how to do everything, and why.
        </p>
      </div>
      <GuideClient focusHabit={params.habit} focusSection={params.section} />
    </div>
  );
}
