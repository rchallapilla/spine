"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatLogDate } from "@/lib/dates";

type Props = {
  dates: string[];
  selected: string;
};

export function DateStrip({ dates, selected }: Props) {
  const searchParams = useSearchParams();

  function hrefFor(date: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    return `/?${params.toString()}`;
  }

  return (
    <nav
      aria-label="Pick a day to log"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {dates.map((date) => (
        <Link
          key={date}
          href={hrefFor(date)}
          aria-current={date === selected ? "date" : undefined}
          className={cn(
            "flex min-h-12 shrink-0 items-center rounded-[12px] border px-3.5 py-2 text-xs font-medium tracking-tight transition-colors",
            date === selected
              ? "border-accent/70 bg-accent-dim/40 text-accent"
              : "border-line/80 bg-surface/50 text-text-dim hover:border-line hover:text-text",
          )}
        >
          {formatLogDate(date)}
        </Link>
      ))}
    </nav>
  );
}

export function FlareButton() {
  return (
    <Link
      href="/flare"
      className="fixed bottom-[5.5rem] right-4 z-30 flex min-h-12 items-center rounded-full border border-flare/70 bg-surface/95 px-4 text-sm font-medium text-flare shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm"
    >
      Flare
    </Link>
  );
}
