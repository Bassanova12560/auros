"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useComparatorPage } from "./useComparatorPage";
import { COMPARATOR_REGISTRY } from "@/lib/comparators";

export function ComparatorTabs() {
  const pathname = usePathname();
  const { messages, tabLabel } = useComparatorPage();

  return (
    <nav className="flex items-center gap-1" aria-label={messages.nav.comparatorsAria}>
      {COMPARATOR_REGISTRY.map((item) => {
        const active = pathname === item.href;
        const label = tabLabel(item.id);

        if (item.soon) {
          return (
            <span
              key={item.id}
              className="rounded-full px-3 py-1.5 font-mono text-[10px] text-white/20"
              title={messages.tabs.soon}
            >
              {label}
            </span>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`rounded-full px-3 py-1.5 font-mono text-[10px] transition ${
              active
                ? "bg-white/[0.08] text-white"
                : "text-white/45 hover:text-white/70"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
