import { FlareModeClient } from "@/components/FlareModeClient";
import { getActiveFlare } from "@/lib/queries";

export default async function FlarePage() {
  const activeFlare = await getActiveFlare();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-flare/90">
          Protocol
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-flare">
          Flare mode
        </h2>
      </div>
      <FlareModeClient activeFlare={activeFlare} />
    </div>
  );
}
