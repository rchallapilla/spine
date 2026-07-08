import { FlareModeClient } from "@/components/FlareModeClient";
import { getActiveFlare } from "@/lib/queries";

export default async function FlarePage() {
  const activeFlare = await getActiveFlare();

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-flare">Flare mode</h2>
      <FlareModeClient activeFlare={activeFlare} />
    </div>
  );
}
