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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-line/80 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg pb-[env(safe-area-inset-bottom)]">
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
                "flex min-h-14 flex-1 items-center justify-center text-[13px] font-medium tracking-wide transition-colors",
                active ? "nav-tab-active" : "text-text-dim hover:text-text",
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
