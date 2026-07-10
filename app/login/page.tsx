import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(62,207,186,0.14),transparent_65%)]"
      />
      <div className="relative mb-10 text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent/80">
          Recovery companion
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          Spine
        </h1>
        <p className="mt-3 text-sm text-text-dim">
          Sign in to your recovery tracker
        </p>
      </div>
      {error === "unauthorized" && (
        <p className="relative mb-4 rounded-[12px] border border-flare/60 bg-flare/10 p-3 text-sm text-flare">
          This email is not authorized to access Spine.
        </p>
      )}
      {error === "auth" && (
        <p className="relative mb-4 rounded-[12px] border border-line bg-surface p-3 text-sm text-text-dim">
          Sign-in link expired or was invalid. Request a new one.
        </p>
      )}
      <div className="relative rounded-[16px] border border-line/80 bg-surface/80 p-4 shadow-[inset_0_1px_0_rgba(242,239,230,0.04)]">
        <LoginForm />
      </div>
    </div>
  );
}
