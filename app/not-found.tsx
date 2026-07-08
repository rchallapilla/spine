import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-text-dim">
        That route does not exist in Spine.
      </p>
      <Link href="/" className="mt-6 text-accent">
        Back to today
      </Link>
    </div>
  );
}
