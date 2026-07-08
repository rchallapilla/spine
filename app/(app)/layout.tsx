import { OfflineProvider } from "@/components/OfflineProvider";
import { BottomNav } from "@/components/BottomNav";
import { SettingsSheet } from "@/components/SettingsSheet";
import { TimezoneSync } from "@/components/TimezoneSync";
import { bootstrapProfile } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await bootstrapProfile(user.id, user.email ?? "");
  }

  return (
    <OfflineProvider>
      <TimezoneSync />
      <div className="mx-auto min-h-dvh max-w-lg pb-20">
        <header className="flex items-center justify-between border-b border-line px-4 py-3">
          <h1 className="font-display text-lg font-semibold">Spine</h1>
          <SettingsSheet />
        </header>
        <main className="px-4 py-4">{children}</main>
        <BottomNav />
      </div>
    </OfflineProvider>
  );
}
