"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Today" },
  { href: "/dashboard", label: "Trends" },
  { href: "/guide", label: "Guide" },
  { href: "/milestones", label: "Plan" },
  { href: "/coach", label: "Coach" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line bg-bg">
      <div className="mx-auto flex max-w-lg">
        {tabs.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-14 flex-1 items-center justify-center text-sm font-medium",
                active ? "text-accent" : "text-text-dim",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
