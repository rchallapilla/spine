import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-semibold">Spine</h1>
        <p className="mt-2 text-sm text-text-dim">
          Sign in to your recovery tracker
        </p>
      </div>
      {error === "unauthorized" && (
        <p className="mb-4 rounded-[10px] border border-flare bg-surface p-3 text-sm text-flare">
          This email is not authorized to access Spine.
        </p>
      )}
      {error === "auth" && (
        <p className="mb-4 rounded-[10px] border border-line bg-surface p-3 text-sm text-text-dim">
          Sign-in link expired or was invalid. Request a new one.
        </p>
      )}
      <LoginForm />
    </div>
  );
}
