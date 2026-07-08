"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatLogDate } from "@/lib/dates";

type Props = {
  dates: string[];
  selected: string;
};

export function DateStrip({ dates, selected }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function selectDate(date: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {dates.map((date) => (
        <button
          key={date}
          type="button"
          onClick={() => selectDate(date)}
          className={cn(
            "min-h-12 shrink-0 rounded-[10px] border px-3 py-2 text-xs",
            date === selected
              ? "border-accent text-accent"
              : "border-line text-text-dim",
          )}
        >
          {formatLogDate(date)}
        </button>
      ))}
    </div>
  );
}

export function FlareButton() {
  return (
    <Link
      href="/flare"
      className="fixed bottom-20 right-4 z-30 flex min-h-12 items-center rounded-full border border-flare bg-surface px-4 text-sm text-flare"
    >
      Flare
    </Link>
  );
}
