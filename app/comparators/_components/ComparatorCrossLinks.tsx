"use client";

import Link from "next/link";

import { COMPARATOR_CROSS_LINKS } from "@/lib/comparators/risk";
import { COMPARATOR_REGISTRY } from "@/lib/comparators";
import { useComparatorPage } from "./useComparatorPage";

export function ComparatorCrossLinks() {
  const { entry, messages, tabLabel } = useComparatorPage();

  if (!entry) return null;

  const relatedIds = COMPARATOR_CROSS_LINKS[entry.id] ?? [];
  const related = relatedIds
    .map((id) => COMPARATOR_REGISTRY.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  if (related.length === 0) return null;

  return (
    <section className="border-t border-white/[0.06] px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          {messages.crossLinks.title}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {related.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-4 transition hover:border-white/15 hover:bg-white/[0.04]"
            >
              <p className="font-display text-base text-white transition group-hover:text-white">
                {tabLabel(item.id)}
              </p>
              <p className="mt-1 font-mono text-[10px] text-white/40 transition group-hover:text-white/60">
                {messages.crossLinks.explore}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
